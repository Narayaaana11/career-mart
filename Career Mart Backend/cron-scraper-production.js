const cron = require('node-cron');
const axios = require('axios');
require('dotenv').config();

// Configuration - use environment variables for production
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api/scrape';
const SCRAPING_INTERVAL = process.env.SCRAPING_INTERVAL || '0 */6 * * *'; // Every 6 hours
const LOG_FILE = 'scraping-logs.txt';

// List of company career pages to scrape
const COMPANY_URLS = [
  'https://career.infosys.com/jobs?companyhiringtype=IL&countrycode=IN',
  'https://jobs.lever.co/example',
  'https://boards.greenhouse.io/example',
  // Add more URLs here
];

// Scraping configuration
const SCRAPING_CONFIG = {
  keywords: process.env.SCRAPING_KEYWORDS || 'Software Engineer, Developer, Engineer',
  location: process.env.SCRAPING_LOCATION || 'Remote, New York, San Francisco',
  type: process.env.SCRAPING_TYPE || 'Full-Time',
  limit: parseInt(process.env.SCRAPING_LIMIT) || 50
};

// Logging function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  
  // You can also write to a file
  // require('fs').appendFileSync(LOG_FILE, logMessage + '\n');
}

// Scraping function
async function scrapeJobs() {
  log('🚀 Starting scheduled job scraping...');
  log(`🌐 Using API URL: ${API_BASE_URL}`);
  
  try {
    // Get current status
    const statusResponse = await axios.get(`${API_BASE_URL}/status`);
    const initialJobCount = statusResponse.data.totalJobs;
    log(`📊 Initial job count: ${initialJobCount}`);

    // Perform bulk scraping
    const response = await axios.post(`${API_BASE_URL}/bulk-urls`, {
      urls: COMPANY_URLS,
      ...SCRAPING_CONFIG
    }, {
      timeout: 300000 // 5 minutes timeout
    });

    const result = response.data;
    const summary = result.summary;

    log(`✅ Scraping completed successfully!`);
    log(`📈 Summary:`);
    log(`   - Total URLs processed: ${summary.totalUrls}`);
    log(`   - Successful scrapes: ${summary.successful}`);
    log(`   - Failed scrapes: ${summary.failed}`);
    log(`   - Total jobs found: ${summary.totalJobsFound}`);
    log(`   - New jobs saved: ${summary.totalJobsSaved}`);

    // Log detailed results
    if (summary.results && summary.results.length > 0) {
      log(`📋 Detailed Results:`);
      summary.results.forEach((result, index) => {
        log(`   ${index + 1}. ${result.company || 'Unknown'} (${result.url})`);
        log(`      Status: ${result.status}`);
        if (result.jobsFound !== undefined) {
          log(`      Jobs found: ${result.jobsFound}, saved: ${result.jobsSaved}`);
        }
        if (result.error) {
          log(`      Error: ${result.error}`);
        }
      });
    }

    // Get updated status
    const updatedStatusResponse = await axios.get(`${API_BASE_URL}/status`);
    const finalJobCount = updatedStatusResponse.data.totalJobs;
    const jobsAdded = finalJobCount - initialJobCount;

    log(`📊 Final job count: ${finalJobCount} (+${jobsAdded})`);
    log(`🎉 Scheduled scraping completed successfully!`);

  } catch (error) {
    log(`❌ Scheduled scraping failed: ${error.message}`);
    if (error.response?.data) {
      log(`   Error details: ${JSON.stringify(error.response.data)}`);
    }
  }
}

// Error handling for the cron job
function handleCronError(error) {
  log(`💥 Cron job error: ${error.message}`);
  // You can add notification logic here (email, Slack, etc.)
}

// Setup cron job
function setupCronJob() {
  log(`⏰ Setting up cron job with interval: ${SCRAPING_INTERVAL}`);
  
  const job = cron.schedule(SCRAPING_INTERVAL, scrapeJobs, {
    scheduled: false,
    timezone: "UTC"
  });

  job.on('error', handleCronError);
  
  // Start the job
  job.start();
  log('✅ Cron job started successfully');
  
  return job;
}

// Manual trigger function
async function triggerManualScraping() {
  log('🔧 Triggering manual scraping...');
  await scrapeJobs();
}

// Health check function
async function healthCheck() {
  try {
    const response = await axios.get(`${API_BASE_URL}/status`);
    log(`💚 Health check passed: ${response.data.totalJobs} jobs in database`);
    return true;
  } catch (error) {
    log(`💔 Health check failed: ${error.message}`);
    return false;
  }
}

// Main execution
if (require.main === module) {
  log('🚀 Starting Career Mart Cron Scraper...');
  log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  log(`🔗 API Base URL: ${API_BASE_URL}`);
  
  // Check if we should run immediately
  if (process.argv.includes('--run-now')) {
    log('⚡ Running scraping immediately...');
    scrapeJobs().then(() => {
      log('✅ Manual scraping completed');
      process.exit(0);
    }).catch((error) => {
      log(`❌ Manual scraping failed: ${error.message}`);
      process.exit(1);
    });
  } else {
    // Start the cron job
    const job = setupCronJob();
    
    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      log('🛑 Received SIGTERM, stopping cron job...');
      job.stop();
      process.exit(0);
    });
    
    process.on('SIGINT', () => {
      log('🛑 Received SIGINT, stopping cron job...');
      job.stop();
      process.exit(0);
    });
  }
}

module.exports = {
  scrapeJobs,
  setupCronJob,
  triggerManualScraping,
  healthCheck
}; 