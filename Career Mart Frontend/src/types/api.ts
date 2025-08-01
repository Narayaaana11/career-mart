// User related types
export interface User {
  _id: string;
  email: string;
  savedJobs: string[];
  recentlyViewed: string[];
  compareJobs: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
}

// Job related types
export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: 'entry' | 'mid' | 'senior' | 'lead';
  remote: boolean;
  postedDate: string;
  applicationDeadline?: string;
  benefits: string[];
  skills: string[];
  source: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  title?: string;
  company?: string;
  location?: string;
  type?: string;
  experience?: string;
  remote?: boolean;
  minSalary?: number;
  maxSalary?: number;
  skills?: string[];
  page?: number;
  limit?: number;
}

// Alert related types
export interface JobAlert {
  _id: string;
  userId: string;
  title: string;
  keywords: string[];
  location?: string;
  type?: string;
  experience?: string;
  remote?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlertRequest {
  title: string;
  keywords: string[];
  location?: string;
  type?: string;
  experience?: string;
  remote?: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
} 