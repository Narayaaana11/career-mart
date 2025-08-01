interface ScrapedJob {
  title: string;
  company: string;
  location: string;
  type: string;
  description?: string;
  applyUrl: string;
}

interface CrawlResponse {
  success: boolean;
  data?: any[];
  error?: string;
}

export class FirecrawlService {
  private static async callEdgeFunction(url: string): Promise<CrawlResponse> {
    try {
      const response = await fetch('/api/scrape-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling edge function:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to scrape jobs'
      };
    }
  }

  static async scrapeJobsFromCompany(url: string): Promise<{ success: boolean; jobs?: ScrapedJob[]; error?: string }> {
    try {
      const response = await this.callEdgeFunction(url);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to scrape jobs'
        };
      }

      // Parse the scraped data to extract job information
      const jobs = this.parseJobsFromCrawlData(response.data || [], url);
      
      return {
        success: true,
        jobs
      };
    } catch (error) {
      console.error('Error scraping jobs:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to scrape jobs'
      };
    }
  }

  private static parseJobsFromCrawlData(crawlData: any[], companyUrl: string): ScrapedJob[] {
    const jobs: ScrapedJob[] = [];
    
    crawlData.forEach((page) => {
      if (page.markdown || page.html) {
        const content = page.markdown || page.html;
        const pageJobs = this.extractJobsFromContent(content, page.metadata?.sourceURL || companyUrl);
        jobs.push(...pageJobs);
      }
    });

    return jobs;
  }

  private static extractJobsFromContent(content: string, sourceUrl: string): ScrapedJob[] {
    const jobs: ScrapedJob[] = [];
    
    // Extract company name from URL
    const companyName = this.extractCompanyName(sourceUrl);
    
    // Simple job extraction patterns - this can be enhanced
    const jobPatterns = [
      // Common job title patterns
      /(?:^|\n)([A-Z][A-Za-z\s,&-]+(?:Engineer|Developer|Manager|Designer|Analyst|Specialist|Coordinator|Director|Lead|Senior|Junior|Intern))/gm,
      // Job posting section patterns
      /(?:Job Title|Position|Role):\s*([^\n]+)/gi,
      // Heading patterns that might be job titles
      /^#{1,3}\s+([A-Z][A-Za-z\s,&-]+(?:Engineer|Developer|Manager|Designer|Analyst|Specialist|Coordinator|Director|Lead|Senior|Junior|Intern))/gm
    ];

    jobPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const title = match[1].trim();
        if (title && title.length > 5 && title.length < 100) {
          // Extract job details around this title
          const jobDetails = this.extractJobDetails(content, match.index, title);
          
          jobs.push({
            title,
            company: companyName,
            location: jobDetails.location || 'Not specified',
            type: jobDetails.type || 'Full-Time',
            description: jobDetails.description,
            applyUrl: sourceUrl
          });
        }
      }
    });

    // Remove duplicates based on title
    const uniqueJobs = jobs.filter((job, index, self) => 
      index === self.findIndex(j => j.title.toLowerCase() === job.title.toLowerCase())
    );

    return uniqueJobs.slice(0, 20); // Limit to 20 jobs per scrape
  }

  private static extractJobDetails(content: string, titleIndex: number, title: string) {
    // Extract a section around the job title (500 chars before and after)
    const start = Math.max(0, titleIndex - 500);
    const end = Math.min(content.length, titleIndex + 500);
    const section = content.slice(start, end);

    // Extract location
    const locationPatterns = [
      /(?:Location|Based in|Office):\s*([^\n]+)/i,
      /\b(Remote|San Francisco|New York|London|Berlin|Toronto|Austin|Seattle|Los Angeles|Chicago|Boston|Denver|Miami|Portland|Nashville|Salt Lake City|Phoenix|Atlanta|Dallas|Houston|Philadelphia|Washington DC|Washington, DC)\b/i
    ];

    let location = 'Not specified';
    for (const pattern of locationPatterns) {
      const match = section.match(pattern);
      if (match) {
        location = match[1] || match[0];
        break;
      }
    }

    // Extract job type
    const typePatterns = [
      /\b(Full-Time|Part-Time|Contract|Internship|Remote)\b/i,
      /(?:Employment Type|Job Type):\s*([^\n]+)/i
    ];

    let type = 'Full-Time';
    for (const pattern of typePatterns) {
      const match = section.match(pattern);
      if (match) {
        const extractedType = match[1] || match[0];
        if (['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote'].includes(extractedType)) {
          type = extractedType;
        }
        break;
      }
    }

    // Extract description (first paragraph or sentence)
    const descPatterns = [
      /(?:Description|Summary|About):\s*([^\n]+(?:\n[^\n]+)*?)(?:\n\n|\n(?=[A-Z][a-z]+:))/i,
      new RegExp(`${title}[^\n]*\n([^\n]+(?:\n[^\n]+){0,2})`, 'i')
    ];

    let description = '';
    for (const pattern of descPatterns) {
      const match = section.match(pattern);
      if (match && match[1]) {
        description = match[1].trim().slice(0, 200);
        break;
      }
    }

    return { location, type, description };
  }

  private static extractCompanyName(url: string): string {
    try {
      const domain = new URL(url).hostname;
      const parts = domain.split('.');
      const mainDomain = parts.length > 2 ? parts[parts.length - 2] : parts[0];
      return mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);
    } catch {
      return 'Unknown Company';
    }
  }
}