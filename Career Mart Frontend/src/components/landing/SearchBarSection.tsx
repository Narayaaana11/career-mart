import { Search, MapPin, Briefcase, GraduationCap, Building2, Clock, ExternalLink, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Job, JobFilters } from "@/types/job";
import { useState, useEffect } from "react";
import axios from "axios";

interface CompactJobCardProps {
  job: Job;
  onSave: (jobId: string) => void;
  saved: boolean;
}

// Function to format date to "Aug 1 25" format
const formatDate = (dateString: string | Date): string => {
  try {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of year
    return `${month} ${day} ${year}`;
  } catch (error) {
    return 'Invalid date';
  }
};

function CompactJobCard({ job, onSave, saved }: CompactJobCardProps) {
  return (
    <Card className="p-4 hover:shadow-elegant transition-all duration-300 bg-gradient-subtle border-0 h-full flex flex-col" role="article" aria-labelledby={`job-${job.id}`}>
      <div className="flex flex-col space-y-3 flex-grow">
        <div className="flex-grow">
          <h3 id={`job-${job.id}`} className="text-base font-semibold text-foreground mb-2 line-clamp-2 leading-tight">
            {job.title}
          </h3>
          <div className="flex items-center space-x-2 text-muted-foreground mb-3">
            <div className="flex items-center space-x-1">
              <Building2 className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
              <span className="text-xs truncate">{job.company}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="secondary" className="text-xs flex-shrink-0">{job.type}</Badge>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground min-w-0">
            <MapPin className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground min-w-0">
            <Clock className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{formatDate(job.postedDate)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <Button
            size="sm"
            onClick={() => window.open(job.applyUrl, '_blank')}
            className="bg-gradient-primary hover:opacity-90 text-white gap-1 text-xs h-8 flex-1 mr-2"
            aria-label={`Apply to ${job.title} at ${job.company}`}
          >
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
            Apply
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSave(job.id)}
            className={`h-8 w-8 p-0 flex-shrink-0 ${saved ? 'text-primary' : 'text-muted-foreground'}`}
            aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}
          >
            <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

interface SkeletonJobCardProps {
  count: number;
}

function SkeletonJobCard({ count }: SkeletonJobCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="p-4 h-full flex flex-col animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-muted rounded w-1/2 mb-3"></div>
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="h-5 bg-muted rounded w-16"></div>
            <div className="h-3 bg-muted rounded w-20"></div>
            <div className="h-3 bg-muted rounded w-24"></div>
          </div>
          <div className="flex justify-between mt-auto">
            <div className="h-8 bg-muted rounded w-20"></div>
            <div className="h-8 bg-muted rounded w-8"></div>
          </div>
        </Card>
      ))}
    </>
  );
}

export function SearchBarSection() {
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [jobType, setJobType] = useState<string>('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]); // Store all jobs for real-time filtering
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const API_URL = 'http://localhost:5000/api'; // Update with your backend URL

  const fetchJobs = async (filters: JobFilters) => {
    setIsLoading(true);
    setError('');
    try {
      // Convert frontend filters to backend API parameters
      const apiParams: any = {};
      
      if (filters.keyword) {
        apiParams.search = filters.keyword;
      }
      
      if (filters.type && filters.type.length > 0) {
        apiParams.type = filters.type[0]; // Backend expects single type, not array
      }
      
      const response = await axios.get(`${API_URL}/jobs`, { params: apiParams });
      
      // Handle the backend response format
      const jobs = response.data.jobs || response.data || [];
      setAllJobs(jobs); // Store all jobs
      setFilteredJobs(jobs.slice(0, 8)); // Limit to 8 jobs
    } catch (err) {
      console.log('No jobs found or API error:', err);
      setError('No jobs found. Try adjusting your search criteria.');
      setFilteredJobs([]);
      setAllJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveJob = async (jobId: string) => {
    // Simulate API call for now; replace with real API call once auth is set up
    setSavedJobs(prev => prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]);
    // TODO: Implement API call to save job to user's profile
    // try {
    //   await axios.post(`${API_URL}/users/saved-jobs`, { jobId }, { headers: { Authorization: `Bearer ${userToken}` } });
    // } catch (err) {
    //   console.error('Failed to save job:', err);
    // }
  };

  const handleSearch = () => {
    const filters: JobFilters = {
      keyword: searchKeyword,
      type: jobType ? [jobType as 'Remote' | 'Full-Time' | 'Internship' | 'Part-Time' | 'Contract'] : [],
      location: '',
      postedWithin: 'all',
      company: ''
    };
    fetchJobs(filters);
  };

  // Real-time search function
  const handleRealTimeSearch = (searchTerm: string) => {
    setSearchKeyword(searchTerm);
    
    // If search term is empty, show all jobs
    if (!searchTerm.trim()) {
      setFilteredJobs(allJobs.slice(0, 8));
      return;
    }

    // Filter jobs locally for real-time search
    const filtered = allJobs.filter(job => {
      const jobTitle = job.title.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      // Check if job title contains the search term
      return jobTitle.includes(searchLower);
    });

    setFilteredJobs(filtered.slice(0, 8));
  };

  useEffect(() => {
    // Fetch recent jobs on mount
    fetchJobs({ keyword: '', type: [], location: '', postedWithin: 'all', company: '' });
  }, []);

  useEffect(() => {
    // Auto-search when job type changes
    if (jobType) {
      // Filter by job type from all jobs
      const typeFiltered = allJobs.filter(job => job.type === jobType);
      setFilteredJobs(typeFiltered.slice(0, 8));
    } else {
      // If no job type selected, show all jobs (respecting current search)
      if (searchKeyword.trim()) {
        handleRealTimeSearch(searchKeyword);
      } else {
        setFilteredJobs(allJobs.slice(0, 8));
      }
    }
  }, [jobType, allJobs]);

  const jobTypes = [
    { value: 'Full-Time', label: 'Full-Time' },
    { value: 'Part-Time', label: 'Part-Time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Remote', label: 'Remote' },
    { value: 'Internship', label: 'Internship' }
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-background rounded-2xl shadow-medium p-6 -mt-16 relative z-20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input 
                  type="text" 
                  placeholder="Job title, keyword, or company" 
                  className="pl-10 bg-background border-input"
                  value={searchKeyword}
                  onChange={(e) => handleRealTimeSearch(e.target.value)}
                  aria-label="Search jobs by title, keyword, or company"
                />
              </div>
            </div>
            
            <div className="flex gap-4 md:w-auto">
              <div className="relative">
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger className="w-full" aria-label="Select job type">
                    <div className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <SelectValue placeholder="Job Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button className="md:w-auto" onClick={handleSearch} aria-label="Search jobs">
              <Search className="mr-2 h-4 w-4" aria-hidden="true" />
              Search
            </Button>
          </div>
        </div>
        
        {/* Job Results Section */}
        <div className="max-w-7xl mx-auto mt-12">
          <div className="relative">
            {error && (
              <div className="col-span-full text-center py-12 text-red-600" role="alert">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading ? (
                <SkeletonJobCard count={8} />
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map(job => (
                  <CompactJobCard 
                    key={job.id || job._id || `job-${job.title}-${job.company}`} 
                    job={job} 
                    onSave={handleSaveJob} 
                    saved={savedJobs.includes(job.id || job._id || '')} 
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground text-lg">No jobs found matching your search criteria.</p>
                  <p className="text-muted-foreground text-sm mt-2">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}