import React from 'react';
import { useJobs } from '@/hooks/useApi';
import { JobCard } from './JobCard';
import { SkeletonJobCard } from './SkeletonJobCard';
import { Job } from '@/types/api';

interface JobListProps {
  filters?: any;
}

export const JobList: React.FC<JobListProps> = ({ filters }) => {
  const { data: jobs, isLoading, error } = useJobs(filters);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonJobCard key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Error loading jobs
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Please try again later
        </p>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          No jobs found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job: Job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
}; 