# Job Scraper Documentation

## Overview

The Job Scraper is a feature that allows users to extract job listings from company career pages and add them to their job collection. It uses web scraping techniques to parse HTML content and extract job information.

## How It Works

1. **URL Input**: Users enter a company's career page URL
2. **Content Fetching**: The scraper fetches the webpage content
3. **Job Detection**: Parses the HTML to find job listings using various selectors
4. **Data Extraction**: Extracts job details (title, company, location, type, etc.)
5. **Data Processing**: Cleans and formats the extracted data
6. **Storage**: Adds the jobs to the user's job collection

## Supported Sites

### ✅ Works Well With:
- **Company Career Pages**: Direct career pages from companies
- **Static HTML Sites**: Traditional websites with server-rendered content
- **Simple Job Boards**: Basic job listing sites

### ❌ Does NOT Work With:
- **Google Careers**: Uses dynamic JavaScript loading
- **LinkedIn Jobs**: Requires authentication and uses dynamic content
- **Indeed**: Uses anti-bot protection and dynamic loading
- **Glassdoor**: Requires authentication and uses dynamic content
- **Monster**: Uses dynamic content loading
- **CareerBuilder**: Uses dynamic content loading
- **ZipRecruiter**: Uses dynamic content loading
- **SimplyHired**: Uses dynamic content loading
- **Dice**: Uses dynamic content loading
- **Angel.co Jobs**: Uses dynamic content loading
- **Stack Overflow Jobs**: Uses dynamic content loading
- **GitHub Jobs**: Uses dynamic content loading
- **Remote.co**: Uses dynamic content loading
- **WeWorkRemotely**: Uses dynamic content loading
- **FlexJobs**: Uses dynamic content loading

## Technical Limitations

### 1. JavaScript-Rendered Content
Many modern job sites use JavaScript to load content dynamically. Our scraper can only access the initial HTML content, not content loaded via JavaScript.

### 2. Anti-Bot Protection
Sites like Google, LinkedIn, and Indeed have sophisticated bot detection systems that block automated access.

### 3. Rate Limiting
Many sites implement rate limiting to prevent excessive requests from the same source.

### 4. Authentication Requirements
Some sites require user authentication or session cookies to access job listings.

### 5. CAPTCHA Challenges
Automated access can trigger CAPTCHA challenges that require human interaction.

## Error Handling

The scraper provides detailed error messages and suggestions:

### Common Error Types:
- **403 Forbidden**: Site is blocking automated access
- **404 Not Found**: URL is incorrect or page doesn't exist
- **429 Too Many Requests**: Rate limiting in effect
- **503 Service Unavailable**: Site is under maintenance
- **Timeout**: Site is slow or blocking access

### Suggestions Provided:
- Try using the company's direct career page
- Check if the site requires authentication
- Consider using job search APIs instead
- Try again in a few minutes
- Check your internet connection

## Best Practices

### For Users:
1. **Use Direct Career Pages**: Instead of job aggregators, use the company's own career page
2. **Check URL Format**: Ensure the URL points to a job listings page
3. **Try Alternative URLs**: If one URL doesn't work, try other pages from the same company
4. **Be Patient**: Some sites may be slow or temporarily unavailable

### For Developers:
1. **Respect Robots.txt**: Always check and respect robots.txt files
2. **Add Delays**: Include delays between requests to be respectful
3. **Use Proper Headers**: Include realistic browser headers
4. **Handle Errors Gracefully**: Provide clear error messages and suggestions
5. **Rate Limiting**: Implement rate limiting to avoid overwhelming sites

## Alternative Solutions

### For Dynamic Sites:
1. **Official APIs**: Use LinkedIn API, Indeed API, or Google Jobs API
2. **RSS Feeds**: Some sites provide RSS feeds for job listings
3. **Email Alerts**: Subscribe to job alert emails
4. **Manual Entry**: Manually add jobs you're interested in

### For Developers:
1. **Puppeteer/Playwright**: Use headless browsers for JavaScript rendering
2. **Proxy Rotation**: Use multiple IP addresses to avoid rate limiting
3. **Session Management**: Maintain cookies and sessions for authenticated sites
4. **CAPTCHA Solving**: Integrate CAPTCHA solving services (not recommended for ethical reasons)

## API Endpoints

### POST /api/scrape-jobs
Scrapes jobs from a given URL.

**Request Body:**
```json
{
  "url": "https://company.com/careers"
}
```

**Response:**
```json
{
  "jobs": [
    {
      "title": "Software Engineer",
      "company": "Company Name",
      "location": "San Francisco, CA",
      "type": "Full-Time",
      "applyUrl": "https://company.com/apply",
      "description": "Job description...",
      "tags": ["JavaScript", "React", "Node.js"]
    }
  ],
  "totalFound": 10,
  "company": "Company Name",
  "method": "enhanced-scraping"
}
```

### Response Methods:
- `enhanced-scraping`: Standard scraping method
- `alternative-scraping`: Used when standard method fails
- `dynamic-site-detected`: Site uses dynamic content (cannot scrape)
- `no-jobs-found`: No job listings found on the page

## Future Improvements

### Planned Enhancements:
1. **Puppeteer Integration**: Add support for JavaScript-rendered content
2. **API Integration**: Integrate with job search APIs
3. **Machine Learning**: Use ML to improve job detection accuracy
4. **Caching**: Implement caching to reduce repeated requests
5. **Proxy Support**: Add proxy rotation for better success rates

### Ethical Considerations:
1. **Respect Rate Limits**: Always respect site rate limits
2. **Follow Robots.txt**: Check and respect robots.txt files
3. **User Consent**: Ensure users understand scraping limitations
4. **Data Privacy**: Handle scraped data responsibly
5. **Site Policies**: Respect site terms of service

## Troubleshooting

### Common Issues:

1. **"No jobs found"**
   - Check if the URL points to a job listings page
   - Try using the company's direct career page
   - The site might use dynamic content loading

2. **"Access denied"**
   - The site is blocking automated access
   - Try using a different URL from the same company
   - Consider using the company's official API

3. **"Request timed out"**
   - The site might be slow or under heavy load
   - Try again in a few minutes
   - Check your internet connection

4. **"Dynamic site detected"**
   - The site uses JavaScript to load content
   - Use the company's direct career page instead
   - Consider using job search APIs

## Support

If you encounter issues with the job scraper:

1. **Check the URL**: Ensure it's a valid career page URL
2. **Try Alternative URLs**: Use different pages from the same company
3. **Check Error Messages**: Read the detailed error messages and suggestions
4. **Use Direct Career Pages**: Avoid job aggregators and use company career pages
5. **Manual Entry**: For important jobs, consider adding them manually

## Legal and Ethical Considerations

### Important Notes:
1. **Terms of Service**: Always respect website terms of service
2. **Rate Limiting**: Don't overwhelm sites with requests
3. **Data Usage**: Use scraped data responsibly and ethically
4. **Attribution**: Give credit to original sources when appropriate
5. **User Privacy**: Protect user data and privacy

### Recommended Approach:
- Use official APIs when available
- Respect site policies and rate limits
- Provide clear information about scraping limitations
- Offer alternative methods for accessing job data
- Focus on ethical and sustainable data collection practices 