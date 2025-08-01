import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Scraping API functions
export const scrapingAPI = {
  // Get scraping information and available endpoints
  getInfo: async () => {
    console.log('🔍 Calling getInfo API...');
    try {
      const response = await api.get('/api/scrape-jobs');
      console.log('✅ getInfo API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ getInfo API error:', error);
      throw error;
    }
  },

  // Scrape jobs from a single URL
  scrapeSingleUrl: async (params: {
    url: string;
    keywords?: string;
    location?: string;
    type?: string;
    limit?: number;
  }) => {
    console.log('🔍 Calling scrapeSingleUrl API with params:', params);
    try {
      const response = await api.post('/api/scrape-jobs', params);
      console.log('✅ scrapeSingleUrl API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ scrapeSingleUrl API error:', error);
      throw error;
    }
  },

  // Scrape jobs from multiple URLs
  scrapeBulkUrls: async (params: {
    urls: string[];
    keywords?: string;
    location?: string;
    type?: string;
    limit?: number;
  }) => {
    console.log('🔍 Calling scrapeBulkUrls API with params:', params);
    try {
      const response = await api.post('/api/scrape-jobs/bulk-urls', params);
      console.log('✅ scrapeBulkUrls API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ scrapeBulkUrls API error:', error);
      throw error;
    }
  },

  // Get scraping status
  getStatus: async () => {
    console.log('🔍 Calling getStatus API...');
    try {
      const response = await api.get('/api/scrape-jobs/status');
      console.log('✅ getStatus API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ getStatus API error:', error);
      throw error;
    }
  },

  // Manually add a single job
  addManualJob: async (jobData: any) => {
    console.log('🔍 Calling addManualJob API with data:', jobData);
    try {
      const response = await api.post('/scrape-jobs/manual', jobData);
      console.log('✅ addManualJob API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ addManualJob API error:', error);
      throw error;
    }
  },

  // Bulk import multiple jobs
  bulkImportJobs: async (jobs: any[]) => {
    console.log('🔍 Calling bulkImportJobs API with jobs:', jobs);
    try {
      const response = await api.post('/scrape-jobs/bulk', { jobs });
      console.log('✅ bulkImportJobs API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ bulkImportJobs API error:', error);
      throw error;
    }
  }
};

// Company API functions
export const companyAPI = {
  // Get all companies with optional filters
  getCompanies: async (params?: {
    search?: string;
    industry?: string;
    featured?: boolean;
    location?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await api.get('/api/companies', { params });
    return response.data;
  },

  // Get company by ID
  getCompany: async (id: string) => {
    const response = await api.get(`/api/companies/${id}`);
    return response.data;
  },

  // Get companies by industry
  getCompaniesByIndustry: async (industry: string) => {
    const response = await api.get(`/api/companies/industry/${industry}`);
    return response.data;
  },

  // Get featured companies
  getFeaturedCompanies: async () => {
    const response = await api.get('/api/companies/featured/all');
    return response.data;
  },

  // Get company statistics
  getCompanyStats: async () => {
    const response = await api.get('/api/companies/stats/overview');
    return response.data;
  },

  // Create new company (admin only)
  createCompany: async (companyData: any) => {
    const response = await api.post('/api/companies', companyData);
    return response.data;
  },

  // Update company (admin only)
  updateCompany: async (id: string, companyData: any) => {
    const response = await api.put(`/api/companies/${id}`, companyData);
    return response.data;
  },

  // Delete company (admin only)
  deleteCompany: async (id: string) => {
    const response = await api.delete(`/api/companies/${id}`);
    return response.data;
  }
};

// Jobs API functions
export const jobsAPI = {
  // Get all jobs with optional filters
  getJobs: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    type?: string;
  }) => {
    console.log('🔍 Calling getJobs API with params:', params);
    try {
      const response = await api.get('/api/jobs', { params });
      console.log('✅ getJobs API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ getJobs API error:', error);
      throw error;
    }
  },

  // Get a single job by ID
  getJob: async (id: string) => {
    console.log('🔍 Calling getJob API with id:', id);
    try {
      const response = await api.get(`/api/jobs/${id}`);
      console.log('✅ getJob API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ getJob API error:', error);
      throw error;
    }
  },

  // Create a new job
  createJob: async (jobData: any) => {
    console.log('🔍 Calling createJob API with data:', jobData);
    try {
      const response = await api.post('/api/jobs', jobData);
      console.log('✅ createJob API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ createJob API error:', error);
      throw error;
    }
  },

  // Update a job
  updateJob: async (id: string, jobData: any) => {
    console.log('🔍 Calling updateJob API with id:', id, 'data:', jobData);
    try {
      const response = await api.put(`/api/jobs/${id}`, jobData);
      console.log('✅ updateJob API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ updateJob API error:', error);
      throw error;
    }
  },

  // Delete a job
  deleteJob: async (id: string) => {
    console.log('🔍 Calling deleteJob API with id:', id);
    try {
      const response = await api.delete(`/api/jobs/${id}`);
      console.log('✅ deleteJob API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ deleteJob API error:', error);
      throw error;
    }
  }
};

export default api; 