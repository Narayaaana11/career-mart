const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

// Add delay to be respectful to websites
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced scraping with better error handling and modern site support
router.post('/', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ message: 'URL is required' });

  try {
    // Validate URL format
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return res.status(400).json({ message: 'URL must use HTTP or HTTPS protocol' });
      }
    } catch (e) {
      return res.status(400).json({ message: 'Invalid URL format' });
    }

    // Check if it's a known problematic site
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

    // Enhanced headers to avoid detection
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0',
      'DNT': '1'
    };

    // Add delay to be respectful
    await delay(1000);

    const { data } = await axios.get(url, {
      headers,
      timeout: 20000,
      maxRedirects: 5,
      validateStatus: function (status) {
        return status < 500; // Accept all status codes less than 500
      }
    });

    const $ = cheerio.load(data);
    const jobs = [];
    const companyName = extractCompanyName(url);

    // Remove script and style elements to clean the content
    $('script, style, noscript, iframe, embed, object').remove();

    // Enhanced job detection for modern sites
    const jobsFound = await enhancedJobDetection($, url, companyName);
    
    if (jobsFound.length === 0) {
      // Try alternative methods
      const alternativeJobs = await tryAlternativeScraping($, url, companyName);
      
      if (alternativeJobs.length === 0) {
        return res.json({
          jobs: [],
          totalFound: 0,
          company: companyName,
          method: 'no-jobs-found',
          message: 'No job listings found on this page. This could be because:',
          reasons: [
            'The page requires JavaScript to load content',
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
      
      return res.json({
        jobs: alternativeJobs.slice(0, 20),
        totalFound: alternativeJobs.length,
        company: companyName,
        method: 'alternative-scraping'
      });
    }

    // Remove duplicates and limit results
    const uniqueJobs = jobsFound.filter((job, index, self) => 
      index === self.findIndex(j => 
        j.title.toLowerCase() === job.title.toLowerCase() && 
        j.company.toLowerCase() === job.company.toLowerCase()
      )
    );

    res.json({ 
      jobs: uniqueJobs.slice(0, 50),
      totalFound: uniqueJobs.length,
      company: companyName,
      method: 'enhanced-scraping'
    });

  } catch (err) {
    console.error('Scraping error:', err.message);
    
    let errorMessage = 'Failed to scrape jobs. The website might be blocking automated access or the structure is not supported.';
    
    if (err.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. The website might be slow or blocking access.';
    } else if (err.code === 'ENOTFOUND') {
      errorMessage = 'Could not connect to the website. Please check the URL.';
    } else if (err.response?.status === 403) {
      errorMessage = 'Access denied. The website is blocking automated access.';
    } else if (err.response?.status === 404) {
      errorMessage = 'Page not found. Please check if the URL is correct.';
    } else if (err.response?.status === 429) {
      errorMessage = 'Too many requests. Please try again later.';
    } else if (err.response?.status === 503) {
      errorMessage = 'Service temporarily unavailable. The site might be under maintenance.';
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: err.message,
      suggestions: [
        'Try using a different URL from the same company',
        'Check if the site requires authentication',
        'Consider using the company\'s official career portal'
      ]
    });
  }
});

// Check if the site is known to use dynamic content
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

// Enhanced job detection with better patterns
async function enhancedJobDetection($, baseUrl, companyName) {
  const jobs = [];
  
  // Comprehensive list of modern job listing selectors
  const jobSelectors = [
    // Modern job platforms
    '[data-testid*="job"]',
    '[data-cy*="job"]',
    '[data-automation*="job"]',
    '[class*="job-card"]',
    '[class*="job-listing"]',
    '[class*="career-item"]',
    '[class*="position-item"]',
    '[class*="opening-item"]',
    '[class*="vacancy-item"]',
    '[class*="role-item"]',
    // Generic containers
    'article',
    '.card',
    '.item',
    '.listing',
    '.posting',
    // Specific patterns
    '[class*="job"]',
    '[class*="career"]',
    '[class*="position"]',
    '[class*="opening"]',
    '[class*="vacancy"]',
    '[class*="role"]',
    // List items
    'li',
    '.entry',
    '.box',
    '.panel',
    '.tile'
  ];

  // Try each selector
  for (const selector of jobSelectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      elements.each((i, el) => {
        const $el = $(el);
        const jobData = extractJobData($el, $, baseUrl, companyName);
        
        if (jobData.title && jobData.title.length > 3 && jobData.title.length < 200) {
          jobs.push(jobData);
        }
      });
      
      if (jobs.length > 0) break; // Found jobs, stop trying other selectors
    }
  }

  return jobs;
}

function tryAlternativeScraping($, baseUrl, companyName) {
  const jobs = [];
  
  // Look for any text that might be job titles
  const textNodes = $('body').text().split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const jobTitlePatterns = [
    /^([A-Z][A-Za-z\s,&-]+(?:Engineer|Developer|Manager|Designer|Analyst|Specialist|Coordinator|Director|Lead|Senior|Junior|Intern|Architect|Consultant|Advisor|Coordinator|Assistant|Officer|Representative|Associate|Executive|Administrator|Technician|Operator|Supervisor|Coordinator|Planner|Strategist|Consultant|Advisor|Specialist|Expert|Professional|Practitioner|Consultant|Advisor|Specialist|Expert|Professional|Practitioner))/i,
    /(?:Job Title|Position|Role|Opening):\s*([^\n]+)/i,
    /(?:We are looking for|We're hiring|Join us as|Become our|Seeking|Looking for)\s+([^.!?]+)/i
  ];
  
  textNodes.forEach(line => {
    for (const pattern of jobTitlePatterns) {
      const match = line.match(pattern);
      if (match && match[1]) {
        const title = match[1].trim();
        if (title.length > 5 && title.length < 100) {
          jobs.push({
            title,
            company: companyName,
            location: 'Location not specified',
            type: 'Full-Time',
            applyUrl: baseUrl,
            description: line.substring(0, 200),
            tags: [],
            postedDate: new Date().toISOString()
          });
          break;
        }
      }
    }
  });
  
  return jobs;
}

function extractJobData($el, $, baseUrl, companyName) {
  const text = $el.text();
  
  // Extract job title
  const title = extractJobTitle($el, $, text);
  
  // Extract company name
  const company = extractCompanyNameFromElement($el, $, companyName);
  
  // Extract location
  const location = extractLocation($el, $, text);
  
  // Extract job type
  const type = extractJobType($el, $, text);
  
  // Extract apply URL
  const applyUrl = extractApplyUrl($el, $, baseUrl);
  
  // Extract description
  const description = extractDescription($el, $, text);
  
  // Extract tags/skills
  const tags = extractTags($el, $, text);

  return {
    title,
    company,
    location,
    type,
    applyUrl,
    description,
    tags,
    postedDate: new Date().toISOString()
  };
}

function extractJobTitle($el, $, text) {
  // Try to find title in common selectors
  const titleSelectors = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    '[class*="title"]',
    '[class*="position"]',
    '[class*="role"]',
    '[class*="job-title"]',
    '[class*="position-title"]',
    '[class*="role-title"]',
    '[class*="opening-title"]',
    '[class*="vacancy-title"]'
  ];

  for (const selector of titleSelectors) {
    const title = $el.find(selector).first().text().trim();
    if (title && title.length > 3 && title.length < 100) {
      return title;
    }
  }

  // If no specific title found, try to extract from text
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  for (const line of lines) {
    if (line.length > 5 && line.length < 100 && 
        /(engineer|developer|manager|designer|analyst|specialist|coordinator|director|lead|senior|junior|intern|architect|consultant|advisor|assistant|officer|representative|associate|executive|administrator|technician|operator|supervisor|planner|strategist|expert|professional|practitioner)/i.test(line)) {
      return line;
    }
  }

  return '';
}

function extractCompanyNameFromElement($el, $, fallbackCompany) {
  const companySelectors = [
    '[class*="company"]',
    '[class*="organization"]',
    '[class*="employer"]',
    '[class*="brand"]'
  ];

  for (const selector of companySelectors) {
    const company = $el.find(selector).text().trim();
    if (company) return company;
  }

  return fallbackCompany;
}

function extractLocation($el, $, text) {
  const locationSelectors = [
    '[class*="location"]',
    '[class*="place"]',
    '[class*="address"]',
    '[class*="city"]',
    '[class*="country"]'
  ];

  for (const selector of locationSelectors) {
    const location = $el.find(selector).text().trim();
    if (location) return location;
  }

  // Try to find location in text
  const locationPatterns = [
    /(remote|work from home|wfh|anywhere|worldwide|global)/i,
    /([A-Z][a-z]+,\s*[A-Z]{2})/,
    /([A-Z][a-z]+,\s*[A-Z][a-z]+)/,
    /([A-Z][a-z]+\s+[A-Z][a-z]+)/,
    /(San Francisco|New York|London|Berlin|Paris|Tokyo|Sydney|Toronto|Vancouver|Austin|Seattle|Boston|Chicago|Los Angeles|Miami|Denver|Portland|Atlanta|Dallas|Houston|Phoenix|Las Vegas|Orlando|Nashville|Charlotte|Raleigh|Durham|Austin|San Diego|San Jose|Oakland|Sacramento|Fresno|Bakersfield|Stockton|Modesto|Visalia|Merced|Chico|Redding|Eureka|Arcata|Crescent City|Fort Bragg|Ukiah|Willits|Laytonville|Garberville|Redway|Miranda|Phillipsville|Myers Flat|Scotia|Rio Dell|Fortuna|Loleta|Eureka|Arcata|McKinleyville|Trinidad|Westhaven|Orick|Klamath|Crescent City)/i
  ];

  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) return match[1] || match[0];
  }

  return 'Location not specified';
}

function extractJobType($el, $, text) {
  const textLower = text.toLowerCase();
  
  if (/remote|work from home|wfh|anywhere|worldwide|global/i.test(textLower)) return 'Remote';
  if (/part.?time|parttime/i.test(textLower)) return 'Part-Time';
  if (/contract|freelance|consulting/i.test(textLower)) return 'Contract';
  if (/intern|internship/i.test(textLower)) return 'Internship';
  if (/full.?time|fulltime/i.test(textLower)) return 'Full-Time';
  
  return 'Full-Time'; // Default
}

function extractApplyUrl($el, $, baseUrl) {
  const applySelectors = [
    'a[href*="apply"]',
    'a[href*="application"]',
    'a[href*="career"]',
    'a[href*="job"]',
    'a[href*="position"]',
    'a[href*="role"]',
    'a[href*="opening"]',
    'a[href*="vacancy"]',
    '[class*="apply"] a',
    '[class*="application"] a',
    'a'
  ];

  for (const selector of applySelectors) {
    const link = $el.find(selector).first();
    const href = link.attr('href');
    if (href) {
      try {
        return new URL(href, baseUrl).href;
      } catch (e) {
        // Invalid URL, continue to next selector
      }
    }
  }

  return baseUrl;
}

function extractDescription($el, $, text) {
  const descSelectors = [
    '[class*="description"]',
    '[class*="summary"]',
    '[class*="details"]',
    '[class*="content"]',
    '[class*="about"]',
    'p'
  ];

  for (const selector of descSelectors) {
    const desc = $el.find(selector).text().trim();
    if (desc && desc.length > 20) {
      return desc.substring(0, 500); // Limit description length
    }
  }

  // If no specific description found, use the element's text
  return text.substring(0, 500);
}

function extractTags($el, $, text) {
  const tags = [];
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
    'TypeScript', 'PHP', 'Ruby', 'Go', 'Rust', 'C++', 'C#', '.NET',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL',
    'MySQL', 'Redis', 'GraphQL', 'REST', 'API', 'Git', 'Agile', 'Scrum',
    'Machine Learning', 'AI', 'Data Science', 'DevOps', 'CI/CD', 'Testing',
    'UI/UX', 'Design', 'Product Management', 'Marketing', 'Sales',
    'HTML', 'CSS', 'Sass', 'Less', 'Webpack', 'Babel', 'ESLint', 'Prettier',
    'Jest', 'Mocha', 'Chai', 'Cypress', 'Selenium', 'JUnit', 'PyTest',
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib',
    'Tableau', 'Power BI', 'Looker', 'Snowflake', 'Redshift', 'BigQuery',
    'Elasticsearch', 'Solr', 'Kafka', 'RabbitMQ', 'Redis', 'Memcached',
    'Nginx', 'Apache', 'IIS', 'Linux', 'Unix', 'Windows', 'macOS',
    'Jenkins', 'GitLab CI', 'GitHub Actions', 'CircleCI', 'Travis CI',
    'Terraform', 'Ansible', 'Chef', 'Puppet', 'Salt', 'CloudFormation'
  ];

  const textLower = text.toLowerCase();
  commonSkills.forEach(skill => {
    if (textLower.includes(skill.toLowerCase())) {
      tags.push(skill);
    }
  });

  return tags.slice(0, 10); // Limit to 10 tags
}

function extractCompanyName(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace('www.', '').split('.')[0];
  } catch (e) {
    return 'Company';
  }
}

module.exports = router;