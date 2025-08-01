const cron = require('node-cron');
const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api/scrape';
const SCRAPING_INTERVAL = '0 */6 * * *'; // Every 6 hours
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
  keywords: 'Software Engineer, Developer, Engineer',
  location: 'Remote, New York, San Francisco',
  type: 'Full-Time',
  limit: 50
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

// Set up the cron job
function setupCronJob() {
  log(`⏰ Setting up cron job with schedule: ${SCRAPING_INTERVAL}`);
  
  cron.schedule(SCRAPING_INTERVAL, scrapeJobs, {
    scheduled: true,
    timezone: "America/New_York" // Adjust to your timezone
  });

  log(`✅ Cron job scheduled successfully!`);
  log(`📅 Next run: ${cron.getNextDate(SCRAPING_INTERVAL)}`);
}

// Manual trigger function (for testing)
async function triggerManualScraping() {
  log(`🔧 Manual scraping triggered...`);
  await scrapeJobs();
}

// Health check function
async function healthCheck() {
  try {
    const response = await axios.get(`${API_BASE_URL}/status`);
    log(`💚 Health check passed - ${response.data.totalJobs} jobs in database`);
    return true;
  } catch (error) {
    log(`💔 Health check failed: ${error.message}`);
    return false;
  }
}

// Main execution
if (require.main === module) {
  log(`🚀 Starting Job Scraper Cron Service...`);
  
  // Perform initial health check
  healthCheck().then(isHealthy => {
    if (isHealthy) {
      setupCronJob();
      
      // Log the schedule
      log(`📋 Cron Schedule:`);
      log(`   - Pattern: ${SCRAPING_INTERVAL}`);
      log(`   - Description: Every 6 hours`);
      log(`   - URLs to scrape: ${COMPANY_URLS.length}`);
      
      // Keep the process running
      log(`🔄 Cron service is running. Press Ctrl+C to stop.`);
    } else {
      log(`❌ Health check failed. Exiting...`);
      process.exit(1);
    }
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log(`🛑 Shutting down cron service...`);
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    log(`🛑 Shutting down cron service...`);
    process.exit(0);
  });
}

// Export functions for external use
module.exports = {
  scrapeJobs,
  triggerManualScraping,
  healthCheck,
  setupCronJob,
  COMPANY_URLS,
  SCRAPING_CONFIG
};

// Example usage with different schedules:
/*
// Every hour
const HOURLY_SCHEDULE = '0 * * * *';

// Every day at 2 AM
const DAILY_SCHEDULE = '0 2 * * *';

// Every Monday at 9 AM
const WEEKLY_SCHEDULE = '0 9 * * 1';

// Every 15 minutes
const FREQUENT_SCHEDULE = '*/15 * * * *';

// Usage:
cron.schedule(HOURLY_SCHEDULE, scrapeJobs);
*/ 