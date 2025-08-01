import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchFilters } from "@/components/SearchFilters";
import { JobCard } from "@/components/JobCard";
import { SkeletonJobCard } from "@/components/SkeletonJobCard";
import JobScraper from "@/components/JobScraper";
import { JobAlerts } from "@/components/JobAlerts";
import { JobComparison } from "@/components/JobComparison";
import { JobDetailsModal } from "@/components/JobDetailsModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFilteredJobs } from "@/utils/mockJobs";
import { JobFilters, Job } from "@/types/job";
import { useToast } from "@/hooks/use-toast";
import { saveJob, unsaveJob, isJobSaved } from "@/utils/savedJobs";
import { jobsAPI } from "@/lib/api";

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);
  const [filters, setFilters] = useState<JobFilters>({
    keyword: '',
    type: [],
    location: '',
    postedWithin: 'all',
    company: ''
  });
  
  const { toast } = useToast();

  // Load saved job IDs on component mount
  useEffect(() => {
    const loadSavedJobIds = () => {
      const savedJobs = jobs.filter(job => 
        isJobSaved(job.id || job._id || '')
      );
      setSavedJobIds(savedJobs.map(job => job.id || job._id || ''));
    };

    loadSavedJobIds();
  }, [jobs]);

  // Handle shared job links
  useEffect(() => {
    const jobIdFromUrl = searchParams.get('job');
    if (jobIdFromUrl && jobs.length > 0) {
      const sharedJob = jobs.find(job => (job.id || job._id) === jobIdFromUrl);
      if (sharedJob) {
        setSelectedJob(sharedJob);
        setIsModalOpen(true);
        // Clear the URL parameter after opening the modal
        setSearchParams({});
        toast({
          title: "Shared Job",
          description: "Opening the job you shared",
          duration: 3000,
        });
      } else {
        // Job not found in current list
        toast({
          title: "Job Not Found",
          description: "The shared job is no longer available or has been removed.",
          variant: "destructive",
          duration: 5000,
        });
        setSearchParams({});
      }
    }
  }, [jobs, searchParams, setSearchParams, toast]);

  // Fetch jobs from API on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await jobsAPI.getJobs();
        setJobs(response.jobs || []);
        setFilteredJobs(response.jobs || []);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        toast({
          title: "Error",
          description: "Failed to load jobs. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Real-time filtering based on search and job type
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...jobs];

      // Keyword search (real-time)
      if (filters.keyword.trim()) {
        const keyword = filters.keyword.toLowerCase();
        filtered = filtered.filter(job => {
          const searchableText = `${job.title} ${job.company} ${job.description || ''} ${job.tags?.join(' ') || ''} ${job.skills?.join(' ') || ''}`.toLowerCase();
          return searchableText.includes(keyword);
        });
      }

      // Job type filter
      if (filters.type.length > 0) {
        filtered = filtered.filter(job => filters.type.includes(job.type));
      }

      // Posted within filter
      if (filters.postedWithin !== 'all') {
        filtered = filtered.filter(job => {
          const jobDate = new Date(job.postedDate);
          const now = new Date();
          const daysDiff = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24));
          
          switch (filters.postedWithin) {
            case '24h':
              return daysDiff <= 1;
            case '7d':
              return daysDiff <= 7;
            case '30d':
              return daysDiff <= 30;
            default:
              return true;
          }
        });
      }

      setFilteredJobs(filtered);
      setCurrentPage(1); // Reset to first page when filters change
    };

    applyFilters();
  }, [jobs, filters]);

  const handleSaveJob = (jobId: string) => {
    const job = jobs.find(j => (j.id || j._id) === jobId);
    if (!job) return;

    const isAlreadySaved = savedJobIds.includes(jobId);
    
    if (isAlreadySaved) {
      unsaveJob(jobId);
      setSavedJobIds(prev => prev.filter(id => id !== jobId));
      toast({
        title: "Job removed from saved",
        description: "The job has been removed from your saved list.",
      });
    } else {
      saveJob(job);
      setSavedJobIds(prev => [...prev, jobId]);
      toast({
        title: "Job saved",
        description: "The job has been added to your saved list.",
      });
    }
  };

  const handleJobsScraped = async (scrapedJobs: Job[]) => {
    try {
      // Refresh the jobs list from the API
      const response = await jobsAPI.getJobs();
      setJobs(response.jobs || []);
      setFilteredJobs(response.jobs || []);
      
      toast({
        title: "Jobs Added Successfully",
        description: `${scrapedJobs.length} new jobs have been added to the listing`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Failed to refresh jobs after scraping:', error);
      toast({
        title: "Jobs Added",
        description: `${scrapedJobs.length} jobs were scraped, but there was an issue refreshing the list.`,
        duration: 5000,
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      type: [],
      location: '',
      postedWithin: 'all',
      company: ''
    });
  };

  const addToCompare = (job: Job) => {
    if (compareList.find(j => j.id === job.id)) return;
    if (compareList.length >= 3) {
      toast({
        title: "Comparison Limit",
        description: "You can compare up to 3 jobs at a time",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    setCompareList(prev => [...prev, job]);
  };

  const removeFromCompare = (jobId: string) => {
    setCompareList(prev => prev.filter(j => j.id !== jobId));
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = filters.keyword || filters.type.length > 0 || filters.postedWithin !== 'all';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <SearchFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
              className="sticky top-24"
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                  Find Your Dream Job
                </h1>
                <p className="text-muted-foreground mt-2">
                  Discover opportunities from top companies worldwide
                </p>
              </div>

              {/* Results Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {loading ? 'Loading...' : `${filteredJobs.length} jobs found`}
                  </span>
                  {hasActiveFilters && (
                    <Badge variant="secondary">
                      Filtered
                    </Badge>
                  )}
                  {!loading && filteredJobs.length > 0 && (
                    <Badge variant="outline">
                      Page {currentPage} of {totalPages}
                    </Badge>
                  )}
                </div>
                
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="self-start sm:self-auto">
                    Clear filters
                  </Button>
                )}
              </div>
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
              {loading ? (
                // Skeleton loading
                Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonJobCard key={index} />
                ))
              ) : filteredJobs.length > 0 ? (
                // Job cards
                currentJobs.map((job) => (
                  <JobCard
                    key={job._id || job.id || `job-${job.title}-${job.company}`}
                    job={job}
                    onSave={handleSaveJob}
                    saved={savedJobIds.includes(job._id || job.id || '')}
                    onAddToCompare={addToCompare}
                    isInCompareList={compareList.some(j => (j._id || j.id) === (job._id || job.id))}
                    onRemoveFromCompare={removeFromCompare}
                  />
                ))
              ) : (
                // No results
                <div className="text-center py-12">
                  <div className="bg-gradient-subtle rounded-lg p-6 lg:p-8">
                    <h3 className="text-lg font-semibold mb-2">
                      {jobs.length === 0 ? 'No jobs available' : 'No jobs found'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {jobs.length === 0 
                        ? 'Use the job scraper to add jobs from company websites, or check back later for new opportunities.'
                        : 'Try adjusting your filters or search terms'
                      }
                    </p>
                    {jobs.length > 0 && (
                      <Button onClick={clearFilters}>
                        Clear all filters
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Pagination Controls */}
              {!loading && filteredJobs.length > 0 && totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1 flex-wrap justify-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 order-3">
            <div className="sticky top-24 space-y-6">
              <JobScraper onJobsScraped={handleJobsScraped} />
              <JobAlerts onJobSelect={handleJobSelect} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveJob}
        saved={selectedJob ? savedJobIds.includes(selectedJob.id || selectedJob._id || '') : false}
      />
    </div>
  );
}