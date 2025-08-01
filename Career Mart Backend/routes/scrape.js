const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');

// Try to import Job model, but don't fail if MongoDB is not available
let Job;
try {
  Job = require('../models/Job');
} catch (error) {
  Job = null;
}

// Get scraping information and available endpoints
router.get('/', async (req, res) => {
  try {
    let totalJobs = 0;
    let recentJobs = 0;
    
    if (Job) {
      totalJobs = await Job.countDocuments();
      recentJobs = await Job.countDocuments({
        postedDate: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });
    }
    
    const response = {
      message: 'Career Mart Job Scraping API',
      description: 'API for scraping and managing job listings',
      endpoints: {
        'POST /': 'Scrape jobs from a single company career page URL',
        'POST /bulk-urls': 'Scrape jobs from multiple company career page URLs',
        'GET /status': 'Get scraping statistics',
        'POST /manual': 'Manually add a single job',
        'POST /bulk': 'Bulk import multiple jobs'
      },
      statistics: {
        totalJobs,
        jobsAddedToday: recentJobs,
        lastScrape: new Date().toISOString()
      }
    };
    
    res.json(response);
  } catch (error) {
    console.error('GET / error:', error);
    res.status(500).json({ message: `Failed to fetch API info: ${error.message}` });
  }
});

// Scrape jobs from a single company career page
router.post('/', async (req, res) => {
  try {
    const { url, keywords, location, type, limit = 50 } = req.body;
    
    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ message: 'Valid URL is required' });
    }

    // Check if it's a known dynamic site requiring APIs
    const isKnownDynamicSite = checkIfDynamicSite(url);
    if (isKnownDynamicSite) {
      return res.json({
        jobs: [],
        totalFound: 0,
        company: extractCompanyName(url),
        method: 'dynamic-site-detected',
        message: 'This site uses dynamic content loading. For sites like Google Careers, LinkedIn, or Indeed, please use their official APIs or job search features instead.',
        suggestions: [
          'Try using the company\'s direct career page instead of job aggregators',
          'Use the company\'s official job application portal',
          'Check if the company has a public API for job listings',
          'Consider using job search APIs like LinkedIn API or Indeed API'
        ]
      });
    }

    // Use the enhanced scraping function
    const scrapeResult = await scrapeSingleUrl(url, keywords, location, type, limit);
    
    if (scrapeResult.jobs.length === 0) {
      return res.json({
        jobs: [],
        totalFound: 0,
        company: scrapeResult.company,
        method: 'no-jobs-found',
        message: 'No job listings found on this page. This could be because:',
        reasons: [
          'The page requires additional JavaScript to load content',
          'The site uses anti-bot protection',
          'Job listings are loaded dynamically',
          'The page structure is not recognized by our scraper',
          'The site requires authentication or cookies'
        ],
        suggestions: [
          'Try using the company\'s direct career page',
          'Check if the URL points to a job listings page',
          'Consider using job search APIs instead'
        ]
      });
    }

    const response = {
      message: `Successfully scraped and saved ${scrapeResult.savedJobs.length} new jobs`,
      jobs: scrapeResult.savedJobs,
      totalScraped: scrapeResult.jobs.length,
      newJobs: scrapeResult.savedJobs.length,
      duplicates: scrapeResult.duplicates.length,
      company: scrapeResult.company,
      method: 'enhanced-scraping'
    };

    // If there are duplicates, add them to the response
    if (scrapeResult.duplicates.length > 0) {
      response.message += `, ${scrapeResult.duplicates.length} duplicates found`;
      response.duplicateDetails = scrapeResult.duplicates;
    }

    res.json(response);

  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({
      message: `Scraping failed: ${error.message}`,
      suggestions: [
        'Try using the company\'s direct career page',
        'Check if the site requires authentication',
        'Ensure the URL contains job listings'
      ]
    });
  }
});

// Bulk URL scraping endpoint
router.post('/bulk-urls', async (req, res) => {
  try {
    const { urls, keywords, location, type, limit = 50 } = req.body;
    
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ message: 'URLs array is required' });
    }

    const results = {
      totalUrls: urls.length,
      successful: 0,
      failed: 0,
      totalJobsFound: 0,
      totalJobsSaved: 0,
      results: []
    };

    // Process URLs sequentially to avoid overwhelming servers
    for (const url of urls) {
      try {
        if (!isValidUrl(url)) {
          results.failed++;
          results.results.push({
            url,
            status: 'failed',
            error: 'Invalid URL format'
          });
          continue;
        }

        // Check if it's a known dynamic site
        if (checkIfDynamicSite(url)) {
          results.failed++;
          results.results.push({
            url,
            status: 'skipped',
            error: 'Dynamic site detected - use official APIs instead'
          });
          continue;
        }

        // Scrape the URL
        const scrapeResult = await scrapeSingleUrl(url, keywords, location, type, limit);
        
        results.results.push({
          url,
          status: 'success',
          jobsFound: scrapeResult.jobs.length,
          jobsSaved: scrapeResult.savedJobs.length,
          duplicates: scrapeResult.duplicates.length,
          company: scrapeResult.company
        });

        results.successful++;
        results.totalJobsFound += scrapeResult.jobs.length;
        results.totalJobsSaved += scrapeResult.savedJobs.length;

        // Add delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 2000));

             } catch (error) {
         results.failed++;
        results.results.push({
          url,
          status: 'failed',
          error: error.message
        });
      }
    }

    res.json({
      message: `Bulk scraping completed. Processed ${results.totalUrls} URLs`,
      summary: results,
      timestamp: new Date().toISOString()
    });

     } catch (error) {
     res.status(500).json({
      message: `Bulk scraping failed: ${error.message}`,
      suggestions: [
        'Check if all URLs are valid career pages',
        'Ensure URLs are accessible',
        'Try with fewer URLs at once'
      ]
    });
  }
});

// Enhanced single URL scraping function
async function scrapeSingleUrl(url, keywords, location, type, limit = 50) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage', 
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    const page = await browser.newPage();

    // Set realistic user agent and headers
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({ 
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
    });

    // Navigate to the page
    try {
      await page.goto(url, { 
        waitUntil: 'networkidle2', 
        timeout: 40000 
      });
    } catch (error) {
      throw new Error(`Failed to load page: ${error.message}`);
    }

    // Handle cookies and popups
    try {
      await handleCookiesAndPopups(page);
    } catch (error) {
      // Continue if cookie handling fails
    }

    // Wait for dynamic content
    try {
      await page.waitForTimeout(10000);
    } catch (error) {
      // Continue if wait fails
    }

    // Auto-scroll to load more content
    try {
      await autoScroll(page);
    } catch (error) {
      // Continue if auto-scroll fails
    }

    // Extract company name
    let company;
    try {
      company = await extractCompanyNameFromPage(page, url);
    } catch (error) {
      company = extractCompanyName(url);
    }

    // Try different scraping strategies
    let jobs = [];
    const scrapingStrategies = [
      () => scrapeWithCheerio(page),
      () => scrapeWithPuppeteer(page),
      () => scrapeGenericJobs(page)
    ];

    for (const strategy of scrapingStrategies) {
      try {
        jobs = await strategy();
        if (jobs.length > 0) {
          break;
        }
      } catch (error) {
        // Continue to next strategy
      }
    }

    // Filter and process jobs
    let filteredJobs = filterJobs(jobs, keywords, location, type, limit);
    
    // Save jobs to database
    const saveResult = Job ? await saveJobsToDatabase(filteredJobs, company, url) : { savedJobs: [], duplicates: [] };

    return {
      jobs: filteredJobs,
      savedJobs: saveResult.savedJobs,
      duplicates: saveResult.duplicates,
      company,
      url
    };

  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Handle cookies and popups
async function handleCookiesAndPopups(page) {
  try {
    // Common cookie consent selectors
    const cookieSelectors = [
      '[id*="cookie"]', '[class*="cookie"]', '[id*="accept"]', '[class*="accept"]',
      'button[class*="btn-accept"]', '[class*="consent"]', '[class*="gdpr"]',
      '[data-testid*="cookie"]', '[aria-label*="cookie"]', '[title*="cookie"]'
    ];

    for (const selector of cookieSelectors) {
      try {
        await page.click(selector, { timeout: 3000 });
        break;
      } catch (error) {
        // Continue to next selector
      }
    }

    // Handle other popups
    const popupSelectors = [
      '[class*="modal"]', '[class*="popup"]', '[class*="overlay"]',
      'button[class*="close"]', '[class*="dismiss"]', '[class*="skip"]'
    ];

    for (const selector of popupSelectors) {
      try {
        await page.click(selector, { timeout: 2000 });
      } catch (error) {
        // Continue to next selector
      }
    }

  } catch (error) {
    // Silently handle errors
  }
}

// Extract company name from page content
async function extractCompanyNameFromPage(page, url) {
  try {
    const companyName = await page.evaluate(() => {
      // Try to find company name in various places
      const selectors = [
        'meta[name="application-name"]',
        'meta[property="og:site_name"]',
        '.company-name',
        '.company',
        '[class*="company"]',
        'h1',
        'title'
      ];

      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          const content = element.content || element.textContent;
          if (content && content.trim().length > 0) {
            return content.trim();
          }
        }
      }
      return null;
    });

    if (companyName) {
      return companyName;
    }
       } catch (error) {
       // Silently handle errors
     }

  // Fallback to URL-based extraction
  return extractCompanyName(url);
}

// Scrape with Cheerio (for static content)
async function scrapeWithCheerio(page) {
  try {
    const html = await page.content();
    const $ = cheerio.load(html);
    const jobs = [];

    // Common job listing selectors
    const jobSelectors = [
      '.job-listing', '.career-item', '.position-item', '.opening-item',
      '.posting', '.job-posting', 'article', '.card', '.item',
      '[class*="job"]', '[class*="career"]', '[class*="position"]'
    ];

    for (const selector of jobSelectors) {
      const elements = $(selector);
      if (elements.length > 0) {
        elements.each((i, element) => {
          const $el = $(element);
          
          const title = $el.find('h1, h2, h3, h4, .title, .job-title, [class*="title"]').first().text().trim();
          const location = $el.find('.location, .job-location, [class*="location"]').first().text().trim();
          const type = $el.find('.type, .job-type, [class*="type"]').first().text().trim();
          const applyUrl = $el.find('a[href*="apply"], a[href*="jobs"], a[class*="apply"]').first().attr('href');
          const description = $el.find('.description, .job-description, [class*="description"]').first().text().trim();
          
          if (title && title.length > 3) {
            jobs.push({
              title,
              location: location || 'Unknown',
              type: type || 'Full-Time',
              applyUrl: applyUrl || '',
              description: description || '',
              tags: []
            });
          }
        });
        break;
      }
    }

         return jobs;
   } catch (error) {
     return [];
   }
}

// Scrape with Puppeteer (for dynamic content)
async function scrapeWithPuppeteer(page) {
  try {
    return await page.evaluate(() => {
      const jobs = [];
      
      // Enhanced selectors for job listings
      const jobSelectors = [
        '.job-listing', '.career-item', '.position-item', '.opening-item',
        '.posting', '.job-posting', 'article', '.card', '.item',
        '[class*="job"]', '[class*="career"]', '[class*="position"]',
        '[data-qa*="posting"]', '[data-automation*="job"]'
      ];

      let jobElements = [];
      for (const selector of jobSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          jobElements = elements;
          break;
        }
      }

      jobElements.forEach((element) => {
        const title = element.querySelector('h1, h2, h3, h4, .title, .job-title, [class*="title"]')?.textContent?.trim() || '';
        const location = element.querySelector('.location, .job-location, [class*="location"]')?.textContent?.trim() || 'Unknown';
        const type = element.querySelector('.type, .job-type, [class*="type"]')?.textContent?.trim() || 'Full-Time';
        const applyUrl = element.querySelector('a[href*="apply"], a[href*="jobs"], a[class*="apply"]')?.href || '';
        const description = element.querySelector('.description, .job-description, [class*="description"]')?.textContent?.trim() || '';
        
        // Extract tags/skills
        const tagElements = element.querySelectorAll('.tag, .skill, .technology, .keyword, [class*="tag"], [class*="skill"]');
        const tags = Array.from(tagElements).map(tag => tag.textContent?.trim()).filter(Boolean);

        if (title && title.length > 3) {
          jobs.push({
            title,
            location,
            type,
            applyUrl,
            description,
            tags
          });
        }
      });

             return jobs;
     });
   } catch (error) {
     return [];
   }
}

// Filter jobs based on criteria
function filterJobs(jobs, keywords, location, type, limit) {
  let filteredJobs = jobs;

  if (keywords) {
    const keywordArray = keywords.toLowerCase().split(' ');
    filteredJobs = filteredJobs.filter(job =>
      keywordArray.some(keyword =>
        (job.title && job.title.toLowerCase().includes(keyword)) ||
        (job.description && job.description.toLowerCase().includes(keyword)) ||
        (job.tags && job.tags.some(tag => tag.toLowerCase().includes(keyword)))
      )
    );
  }

  if (location) {
    filteredJobs = filteredJobs.filter(job => 
      job.location && job.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  if (type) {
    filteredJobs = filteredJobs.filter(job => 
      job.type && job.type.toLowerCase() === type.toLowerCase()
    );
  }

  return filteredJobs.slice(0, limit);
}

// Save jobs to database
async function saveJobsToDatabase(jobs, company, sourceUrl) {
  const savedJobs = [];
  const duplicates = [];
  
     if (!Job) {
     return jobs.map(job => ({ ...job, company: job.company || company, sourceUrl }));
   }
  
  for (const jobData of jobs) {
    try {
      // Check if job already exists with same title, company, and URL
      const existingJob = await Job.findOne({
        title: jobData.title,
        company: jobData.company || company,
        applyUrl: jobData.applyUrl
      });

      if (!existingJob) {
        const job = new Job({
          ...jobData,
          company: jobData.company || company,
          sourceUrl,
          scrapedAt: new Date()
        });
        
        const savedJob = await job.save();
        savedJobs.push(savedJob);
      } else {
        // Track duplicates for reporting
        duplicates.push({
          job: jobData,
          existingJob: {
            id: existingJob._id,
            title: existingJob.title,
            company: existingJob.company,
            applyUrl: existingJob.applyUrl,
            location: existingJob.location,
            type: existingJob.type,
            postedDate: existingJob.postedDate
          }
        });
      }
     } catch (error) {
       // Silently handle job save errors
     }
  }

  return { savedJobs, duplicates };
}

// Validate URL
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Check if the site is known to use dynamic content requiring APIs
function checkIfDynamicSite(url) {
  const dynamicSites = [
    'google.com/about/careers',
    'linkedin.com/jobs',
    'indeed.com',
    'glassdoor.com',
    'monster.com',
    'careerbuilder.com',
    'ziprecruiter.com',
    'simplyhired.com',
    'dice.com',
    'angel.co/jobs',
    'stackoverflow.com/jobs',
    'github.com/jobs',
    'remote.co',
    'weworkremotely.com',
    'flexjobs.com'
  ];
  const urlLower = url.toLowerCase();
  return dynamicSites.some(site => urlLower.includes(site));
}

// Extract company name from URL
function extractCompanyName(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace('www.', '').split('.')[0];
  } catch {
    return 'Company';
  }
}

// Auto-scroll to load dynamic content
async function autoScroll(page) {
  try {
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
         });
   } catch (error) {
     // Silently handle auto-scroll errors
   }
}

// Scrape Infosys job board
async function scrapeInfosysJobs(page) {
     try {
     await page.waitForSelector('.job-listing, .job-card, .job-item, [class*="job"], [class*="Job"], .jobList', { timeout: 20000 }).catch(() => {});
     return await page.evaluate(() => {
      const jobs = [];
      const jobElements = document.querySelectorAll('.job-listing, .job-card, .job-item, [class*="job"], [class*="Job"], .jobList');
      jobElements.forEach((element) => {
        const title = element.querySelector('.job-title, .JobTitle, h3, h4, [class*="title"], [class*="Title"]')?.textContent?.trim() || '';
        const company = 'Infosys';
        const location = element.querySelector('.job-location, .location, .JobLocation, [class*="location"], [class*="Location"]')?.textContent?.trim() || 'Unknown';
        const type = element.querySelector('.job-type, .type, .JobType, [class*="type"], [class*="Type"]')?.textContent?.trim() || 'Full-Time';
        const applyUrl = element.querySelector('a[href*="apply"], a[class*="apply"], a[href*="jobs"], a[class*="Apply"]')?.href || '';
        const description = element.querySelector('.job-description, .description, .JobDescription, [class*="description"], [class*="Description"]')?.textContent?.trim() || '';
        const tagElements = element.querySelectorAll('.tag, .skill, .technology, .keyword, [class*="tag"], [class*="skill"], [class*="Tag"]');
        const tags = Array.from(tagElements).map(tag => tag.textContent?.trim()).filter(Boolean);
        if (title && title.length > 3) {
          jobs.push({ title, company, location, type, applyUrl, description, tags });
        }
      });
             return jobs;
     });
   } catch (error) {
     return [];
   }
}

// Scrape Lever job board
async function scrapeLeverJobs(page) {
     try {
     await page.waitForSelector('[data-qa="posting"], .posting, .job-posting', { timeout: 20000 }).catch(() => {});
     return await page.evaluate(() => {
      const jobs = [];
      const jobElements = document.querySelectorAll('[data-qa="posting"], .posting, .job-posting');
      jobElements.forEach((element) => {
        const title = element.querySelector('[data-qa="posting-name"], .posting-title, .job-title, h3, h4')?.textContent?.trim() || '';
        const company = element.querySelector('[data-qa="posting-company"], .company-name, .company')?.textContent?.trim() ||
                       document.querySelector('meta[name="application-name"]')?.content?.trim() || 'Unknown';
        const location = element.querySelector('[data-qa="posting-location"], .location, .job-location')?.textContent?.trim() || 'Unknown';
        const type = element.querySelector('[data-qa="posting-type"], .job-type, .type')?.textContent?.trim() || 'Full-Time';
        const applyUrl = element.querySelector('a[data-qa="posting-apply"], a[href*="apply"]')?.href || '';
        const description = element.querySelector('[data-qa="posting-description"], .description, .job-description')?.textContent?.trim() || '';
        const tagElements = element.querySelectorAll('[data-qa="posting-tags"], .tag, .skill, .technology');
        const tags = Array.from(tagElements).map(tag => tag.textContent?.trim()).filter(Boolean);
        if (title && title.length > 3) {
          jobs.push({ title, company, location, type, applyUrl, description, tags });
        }
      });
             return jobs;
     });
   } catch (error) {
     return [];
   }
}

// Scrape Greenhouse job board
async function scrapeGreenhouseJobs(page) {
     try {
     await page.waitForSelector('.opening, .job, [data-job-id]', { timeout: 20000 }).catch(() => {});
     return await page.evaluate(() => {
      const jobs = [];
      const jobElements = document.querySelectorAll('.opening, .job, [data-job-id]');
      jobElements.forEach((element) => {
        const title = element.querySelector('a, .job-title, h3, h4')?.textContent?.trim() || '';
        const company = element.querySelector('.company-name, .company')?.textContent?.trim() ||
                       document.querySelector('meta[name="application-name"]')?.content?.trim() || 'Unknown';
        const location = element.querySelector('.location, .job-location')?.textContent?.trim() || 'Unknown';
        const type = element.querySelector('.job-type, .type')?.textContent?.trim() || 'Full-Time';
        const applyUrl = element.querySelector('a[href*="apply"], a[href*="jobs"]')?.href || '';
        const description = element.querySelector('.description, .job-description')?.textContent?.trim() || '';
        const tagElements = element.querySelectorAll('.tag, .skill, .technology');
        const tags = Array.from(tagElements).map(tag => tag.textContent?.trim()).filter(Boolean);
        if (title && title.length > 3) {
          jobs.push({ title, company, location, type, applyUrl, description, tags });
        }
      });
             return jobs;
     });
   } catch (error) {
     return [];
   }
}

// Scrape Workday job board
async function scrapeWorkdayJobs(page) {
     try {
     await page.waitForSelector('[data-automation-id*="job"], .job, .position', { timeout: 20000 }).catch(() => {});
     return await page.evaluate(() => {
      const jobs = [];
      const jobElements = document.querySelectorAll('[data-automation-id*="job"], .job, .position');
      jobElements.forEach((element) => {
        const title = element.querySelector('[data-automation-id="job-title"], .job-title, h3, h4')?.textContent?.trim() || '';
        const company = element.querySelector('[data-automation-id="company"], .company-name, .company')?.textContent?.trim() ||
                       document.querySelector('meta[name="application-name"]')?.content?.trim() || 'Unknown';
        const location = element.querySelector('[data-automation-id="location"], .location, .job-location')?.textContent?.trim() || 'Unknown';
        const type = element.querySelector('[data-automation-id="job-type"], .job-type, .type')?.textContent?.trim() || 'Full-Time';
        const applyUrl = element.querySelector('a[data-automation-id="apply"], a[href*="apply"]')?.href || '';
        const description = element.querySelector('[data-automation-id="description"], .description, .job-description')?.textContent?.trim() || '';
        const tagElements = element.querySelectorAll('[data-automation-id="tags"], .tag, .skill, .technology');
        const tags = Array.from(tagElements).map(tag => tag.textContent?.trim()).filter(Boolean);
        if (title && title.length > 3) {
          jobs.push({ title, company, location, type, applyUrl, description, tags });
        }
      });
             return jobs;
     });
   } catch (error) {
     return [];
   }
}

// Generic scraping for other sites
async function scrapeGenericJobs(page) {
  try {
    const selectors = [
      '.job-listing', '.career-item', '.position-item', '.opening-item', '.vacancy-item', '.role-item',
      '.posting', '.job-posting', 'article', '.card', '.item', '.listing',
      '[class*="job"]', '[class*="career"]', '[class*="position"]', '[class*="opening"]', '[class*="vacancy"]', '[class*="role"]'
    ];
         let jobElements = [];
     for (const selector of selectors) {
       await page.waitForSelector(selector, { timeout: 10000 }).catch(() => {});
       jobElements = await page.$$(selector);
       if (jobElements.length > 0) {
         break;
       }
     }
    return await page.evaluate((selectors) => {
      const jobs = [];
      let jobElements = [];
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          jobElements = elements;
          break;
        }
      }
      jobElements.forEach((element) => {
        const title = element.querySelector('h1, h2, h3, h4, .title, .job-title, .position-title, [class*="title"]')?.textContent?.trim() || '';
        const company = element.querySelector('.company, .company-name, .employer, [class*="company"]')?.textContent?.trim() ||
                       document.querySelector('meta[name="application-name"]')?.content?.trim() || 'Unknown';
        const location = element.querySelector('.location, .job-location, .place, [class*="location"]')?.textContent?.trim() || 'Unknown';
        const type = element.querySelector('.type, .job-type, .employment-type, [class*="type"]')?.textContent?.trim() || 'Full-Time';
        const applyUrl = element.querySelector('a[href*="apply"], a[href*="jobs"], a[href*="careers"], a[class*="apply"]')?.href || '';
        const description = element.querySelector('.description, .job-description, .summary, [class*="description"]')?.textContent?.trim() || '';
        const tagElements = element.querySelectorAll('.tag, .skill, .technology, .keyword, [class*="tag"], [class*="skill"]');
        const tags = Array.from(tagElements).map(tag => tag.textContent?.trim()).filter(Boolean);
        if (title && title.length > 3) {
          jobs.push({ title, company, location, type, applyUrl, description, tags });
        }
      });
             return jobs;
     }, selectors);
   } catch (error) {
     return [];
   }
}

// Manual job entry
router.post('/manual', async (req, res) => {
  try {
    const jobData = req.body;
    
    if (!Job) {
      return res.status(503).json({ 
        message: 'Database not available - job cannot be saved',
        jobData 
      });
    }
    
    // Check if job already exists with same title, company, and URL
    const existingJob = await Job.findOne({
      title: jobData.title,
      company: jobData.company,
      applyUrl: jobData.applyUrl
    });

    if (existingJob) {
      return res.status(409).json({ 
        message: 'Job already exists with the same title, company, and URL',
        isDuplicate: true,
        existingJob: {
          id: existingJob._id,
          title: existingJob.title,
          company: existingJob.company,
          applyUrl: existingJob.applyUrl,
          location: existingJob.location,
          type: existingJob.type,
          postedDate: existingJob.postedDate
        }
      });
    }
    
    const job = new Job(jobData);
    const savedJob = await job.save();
    res.status(201).json(savedJob);
     } catch (error) {
     res.status(400).json({ message: `Failed to save job: ${error.message}` });
   }
});

// Bulk job import
router.post('/bulk', async (req, res) => {
  try {
    const { jobs } = req.body;
    if (!Array.isArray(jobs)) {
      return res.status(400).json({ message: 'Jobs must be an array' });
    }
    
    if (!Job) {
      return res.status(503).json({ 
        message: 'Database not available - jobs cannot be saved',
        jobs 
      });
    }
    
    const savedJobs = [];
    const errors = [];
    const duplicates = [];
    
    for (const jobData of jobs) {
      try {
        // Check if job already exists with same title, company, and URL
        const existingJob = await Job.findOne({
          title: jobData.title,
          company: jobData.company,
          applyUrl: jobData.applyUrl
        });
        
        if (existingJob) {
          duplicates.push({
            job: jobData,
            existingJob: {
              id: existingJob._id,
              title: existingJob.title,
              company: existingJob.company,
              applyUrl: existingJob.applyUrl,
              location: existingJob.location,
              type: existingJob.type,
              postedDate: existingJob.postedDate
            }
          });
        } else {
          const job = new Job(jobData);
          const savedJob = await job.save();
          savedJobs.push(savedJob);
        }
             } catch (error) {
         errors.push({ job: jobData, error: error.message });
       }
     }
     
     const response = {
       message: `Successfully imported ${savedJobs.length} jobs`,
       imported: savedJobs.length,
       errors: errors.length,
       duplicates: duplicates.length,
       errorDetails: errors,
       duplicateDetails: duplicates
     };
     
     // If there are duplicates, return a 207 status (Multi-Status)
     if (duplicates.length > 0) {
       response.message += `, ${duplicates.length} duplicates found`;
       res.status(207).json(response);
     } else {
       res.json(response);
     }
   } catch (error) {
     res.status(500).json({ message: `Failed to import jobs: ${error.message}` });
   }
});

// Get scraping status
router.get('/status', async (req, res) => {
  try {
    let totalJobs = 0;
    let recentJobs = 0;
    
    if (Job) {
      totalJobs = await Job.countDocuments();
      recentJobs = await Job.countDocuments({
        postedDate: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });
    }

    const response = {
      totalJobs,
      jobsAddedToday: recentJobs,
      lastScrape: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('GET /status error:', error);
    res.status(500).json({ message: `Failed to fetch status: ${error.message}` });
  }
});

module.exports = router;