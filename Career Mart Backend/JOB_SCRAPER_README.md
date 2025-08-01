# Job Scraper System

A comprehensive job scraping system for Career Mart that can extract job listings from company career pages using both static and dynamic content scraping techniques.

## 🚀 Features

### Core Functionality
- **Single URL Scraping**: Scrape jobs from individual company career pages
- **Bulk URL Scraping**: Process multiple URLs simultaneously with progress tracking
- **Manual Job Entry**: Add jobs manually to the database
- **Smart Content Detection**: Automatically detects and handles different page structures
- **Anti-Bot Protection Handling**: Bypasses common anti-bot measures
- **Cookie/Popup Management**: Automatically handles cookie consent and popups

### Supported Job Boards
- **Lever.co**: Specialized scraper for Lever-powered career pages
- **Greenhouse.io**: Optimized for Greenhouse job boards
- **Workday**: Handles Workday-powered career sites
- **Infosys**: Custom scraper for Infosys career pages
- **Generic Scraping**: Fallback for other career page structures

### Data Extraction
- **Job Title**: Extracted from various HTML selectors
- **Company Name**: Auto-detected from page content or URL
- **Location**: Job location information
- **Job Type**: Full-time, Part-time, Remote, Contract, Internship
- **Description**: Job description preview
- **Apply URL**: Direct link to job application
- **Tags/Skills**: Extracted from job listings
- **Posted Date**: Automatically set to current date
- **Source URL**: Tracks where the job was scraped from

## 🛠 API Endpoints

### Base URL
```
http://localhost:5000/api/scrape
```

### Endpoints

#### 1. GET `/` - Get API Information
Returns scraping API information and statistics.

**Response:**
```json
{
  "message": "Career Mart Job Scraping API",
  "description": "API for scraping and managing job listings",
  "endpoints": {
    "POST /": "Scrape jobs from a single company career page URL",
    "POST /bulk-urls": "Scrape jobs from multiple company career page URLs",
    "GET /status": "Get scraping statistics",
    "POST /manual": "Manually add a single job",
    "POST /bulk": "Bulk import multiple jobs"
  },
  "statistics": {
    "totalJobs": 1250,
    "jobsAddedToday": 45,
    "lastScrape": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 2. POST `/` - Single URL Scraping
Scrape jobs from a single company career page.

**Request Body:**
```json
{
  "url": "https://company.com/careers",
  "keywords": "Software Engineer, React",
  "location": "New York",
  "type": "Full-Time",
  "limit": 50
}
```

**Response:**
```json
{
  "message": "Successfully scraped and saved 15 new jobs",
  "jobs": [...],
  "totalScraped": 20,
  "newJobs": 15,
  "company": "Company Name",
  "method": "enhanced-scraping"
}
```

#### 3. POST `/bulk-urls` - Bulk URL Scraping
Scrape jobs from multiple URLs simultaneously.

**Request Body:**
```json
{
  "urls": [
    "https://company1.com/careers",
    "https://company2.com/jobs",
    "https://company3.com/opportunities"
  ],
  "keywords": "Software Engineer",
  "location": "Remote",
  "type": "Full-Time",
  "limit": 25
}
```

**Response:**
```json
{
  "message": "Bulk scraping completed. Processed 3 URLs",
  "summary": {
    "totalUrls": 3,
    "successful": 2,
    "failed": 1,
    "totalJobsFound": 45,
    "totalJobsSaved": 38,
    "results": [
      {
        "url": "https://company1.com/careers",
        "status": "success",
        "jobsFound": 25,
        "jobsSaved": 22,
        "company": "Company 1"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 4. GET `/status` - Get Scraping Statistics
Returns current database statistics.

**Response:**
```json
{
  "totalJobs": 1250,
  "jobsAddedToday": 45,
  "lastScrape": "2024-01-15T10:30:00.000Z"
}
```

#### 5. POST `/manual` - Manual Job Entry
Add a single job manually to the database.

**Request Body:**
```json
{
  "title": "Senior Software Engineer",
  "company": "Tech Corp",
  "location": "New York, NY",
  "type": "Full-Time",
  "applyUrl": "https://techcorp.com/apply/123",
  "description": "We are looking for a senior software engineer...",
  "tags": ["React", "Node.js", "TypeScript"]
}
```

#### 6. POST `/bulk` - Bulk Job Import
Import multiple jobs at once.

**Request Body:**
```json
{
  "jobs": [
    {
      "title": "Frontend Developer",
      "company": "Startup Inc",
      "location": "San Francisco, CA",
      "type": "Full-Time",
      "applyUrl": "https://startup.com/apply/frontend",
      "description": "Join our team...",
      "tags": ["React", "JavaScript"]
    }
  ]
}
```

## 🔧 Technical Details

### Scraping Strategies

#### 1. Cheerio Scraping (Static Content)
- Used for static HTML pages
- Fast and lightweight
- Extracts data using CSS selectors
- Handles basic job listing structures

#### 2. Puppeteer Scraping (Dynamic Content)
- Used for JavaScript-heavy pages
- Renders full page with JavaScript
- Handles dynamic content loading
- Bypasses anti-bot protection

#### 3. Specialized Scrapers
- **Lever.co**: Uses `[data-qa="posting"]` selectors
- **Greenhouse**: Targets `.opening` and `.job` elements
- **Workday**: Uses `[data-automation-id*="job"]` selectors
- **Infosys**: Custom selectors for Infosys career pages

### Anti-Bot Protection
- **User Agent Spoofing**: Uses realistic browser user agent
- **Header Management**: Sets proper HTTP headers
- **Cookie Handling**: Automatically accepts cookie consent
- **Popup Management**: Closes common popups and overlays
- **Rate Limiting**: Adds delays between requests
- **Stealth Mode**: Disables automation detection

### Error Handling
- **Invalid URLs**: Validates URL format before processing
- **Dynamic Sites**: Detects and skips sites requiring APIs
- **Network Errors**: Handles timeouts and connection issues
- **Content Detection**: Identifies when no jobs are found
- **Duplicate Prevention**: Prevents duplicate job entries

## 📊 Database Schema

### Job Model
```javascript
{
  title: { type: String, required: true, index: true },
  company: { type: String, required: true, index: true },
  location: { type: String, index: true },
  type: { 
    type: String, 
    enum: ['Full-Time', 'Part-Time', 'Remote', 'Contract', 'Internship', 'Freelance', 'Temporary'],
    default: 'Full-Time',
    index: true 
  },
  postedDate: { type: Date, default: Date.now, index: true },
  applyUrl: { type: String, required: true, unique: true },
  description: { type: String, maxlength: 1000 },
  tags: [String],
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' }
  },
  experience: {
    min: Number,
    max: Number,
    unit: { type: String, enum: ['years', 'months'], default: 'years' }
  },
  skills: [String],
  benefits: [String],
  sourceUrl: String,
  scrapedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true, index: true }
}
```

## 🚀 Usage Examples

### Frontend Integration

#### Single URL Scraping
```javascript
import { scrapingAPI } from '../lib/api';

const scrapeJobs = async () => {
  try {
    const result = await scrapingAPI.scrapeSingleUrl({
      url: 'https://company.com/careers',
      keywords: 'Software Engineer',
      location: 'New York',
      type: 'Full-Time',
      limit: 50
    });
    
    console.log(`Found ${result.totalScraped} jobs, saved ${result.newJobs}`);
  } catch (error) {
    console.error('Scraping failed:', error);
  }
};
```

#### Bulk URL Scraping
```javascript
const scrapeMultipleCompanies = async () => {
  try {
    const result = await scrapingAPI.scrapeBulkUrls({
      urls: [
        'https://company1.com/careers',
        'https://company2.com/jobs',
        'https://company3.com/opportunities'
      ],
      keywords: 'React Developer',
      location: 'Remote',
      limit: 25
    });
    
    console.log(`Processed ${result.summary.totalUrls} URLs`);
    console.log(`Successfully scraped ${result.summary.successful} URLs`);
  } catch (error) {
    console.error('Bulk scraping failed:', error);
  }
};
```

### Cron Job Setup

#### Using node-cron
```javascript
const cron = require('node-cron');
const scrapingAPI = require('./scrapingAPI');

// Scrape jobs every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('Running scheduled job scraping...');
  
  const urls = [
    'https://company1.com/careers',
    'https://company2.com/jobs',
    // Add more URLs
  ];
  
  try {
    const result = await scrapingAPI.scrapeBulkUrls({
      urls,
      limit: 50
    });
    
    console.log(`Scheduled scraping completed: ${result.summary.totalJobsSaved} new jobs`);
  } catch (error) {
    console.error('Scheduled scraping failed:', error);
  }
});
```

## 🔒 Security Considerations

### Rate Limiting
- Built-in delays between requests (2 seconds)
- Respects website terms of service
- Prevents overwhelming target servers

### Error Handling
- Graceful failure handling
- Detailed error messages
- Fallback strategies for different page types

### Data Validation
- URL format validation
- Required field checking
- Duplicate prevention
- Content sanitization

## 🐛 Troubleshooting

### Common Issues

#### 1. "No jobs found" Error
**Cause**: Page structure not recognized or content loaded dynamically
**Solutions**:
- Try different career page URLs
- Check if the site uses JavaScript for content loading
- Use the company's direct career portal

#### 2. "Dynamic site detected" Error
**Cause**: Site uses APIs or requires special handling
**Solutions**:
- Use the company's official career page
- Check if the company has a public API
- Consider using job search APIs instead

#### 3. "Connection timeout" Error
**Cause**: Network issues or site blocking
**Solutions**:
- Check internet connection
- Try again in a few minutes
- Verify the URL is accessible

#### 4. "Invalid URL" Error
**Cause**: Malformed URL format
**Solutions**:
- Ensure URL starts with `http://` or `https://`
- Check for typos in the URL
- Verify the URL is complete

### Debug Mode
Enable detailed logging by setting environment variables:
```bash
DEBUG=scraper:*
NODE_ENV=development
```

## 📈 Performance Optimization

### Database Indexes
- Compound index on `{title, company, location}`
- Text index for search functionality
- Indexes on frequently queried fields

### Caching
- Browser instance reuse
- Connection pooling
- Result caching for repeated requests

### Memory Management
- Automatic browser cleanup
- Garbage collection optimization
- Memory leak prevention

## 🔄 Updates and Maintenance

### Regular Maintenance
- Update user agents periodically
- Monitor for new anti-bot measures
- Update selectors for changing page structures
- Review and update blocked sites list

### Monitoring
- Track scraping success rates
- Monitor database growth
- Alert on scraping failures
- Performance metrics tracking

## 📝 License

This scraping system is part of the Career Mart project and follows the same licensing terms.

---

For support or questions, please refer to the main project documentation or create an issue in the repository. 