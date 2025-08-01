export interface Company {
  _id?: string;
  id?: string;
  name: string;
  logo?: string;
  description: string;
  industry: string;
  location: string;
  headquarters?: {
    city: string;
    country: string;
    address: string;
  };
  careerUrl: string;
  website?: string;
  openPositions: number;
  rating: number;
  featured: boolean;
  founded?: number;
  companySize?: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1001-5000' | '5001-10000' | '10000+';
  revenue?: 'Under $1M' | '$1M-$10M' | '$10M-$50M' | '$50M-$100M' | '$100M-$500M' | '$500M-$1B' | '$1B+';
  funding?: 'Bootstrapped' | 'Seed' | 'Series A' | 'Series B' | 'Series C' | 'Series D+' | 'Public' | 'Acquired';
  benefits?: string[];
  technologies?: string[];
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
  };
  isActive?: boolean;
  lastUpdated?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CompanyFilters {
  search?: string;
  industry?: string;
  featured?: boolean;
  location?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CompanyStats {
  overview: {
    totalCompanies: number;
    totalOpenPositions: number;
    averageRating: number;
    featuredCompanies: number;
  };
  topIndustries: Array<{
    _id: string;
    count: number;
    totalPositions: number;
  }>;
}

export interface CompanyResponse {
  companies: Company[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCompanies: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
} 