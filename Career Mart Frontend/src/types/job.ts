export interface Job {
  _id?: string;
  id?: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: 'Remote' | 'Full-Time' | 'Internship' | 'Part-Time' | 'Contract' | 'Freelance' | 'Temporary';
  postedDate: string | Date;
  applyUrl: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  } | string;
  description?: string;
  tags?: string[];
  skills?: string[];
  benefits?: string[];
  experience?: {
    min?: number;
    max?: number;
    unit?: string;
  };
  sourceUrl?: string;
  scrapedAt?: string | Date;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface JobFilters {
  keyword: string;
  type: string[];
  location: string;
  postedWithin: string;
  company: string;
  salaryMin?: number;
  salaryMax?: number;
}