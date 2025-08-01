import { Job } from "@/types/job";

const SAVED_JOBS_KEY = 'savedJobs';

export const getSavedJobs = (): Job[] => {
  try {
    const savedJobsData = localStorage.getItem(SAVED_JOBS_KEY);
    if (savedJobsData) {
      return JSON.parse(savedJobsData);
    }
  } catch (error) {
    console.error('Error loading saved jobs:', error);
  }
  return [];
};

export const saveJob = (job: Job): void => {
  try {
    const savedJobs = getSavedJobs();
    const isAlreadySaved = savedJobs.some(savedJob => 
      savedJob.id === job.id || savedJob._id === job._id
    );
    
    if (!isAlreadySaved) {
      const updatedJobs = [...savedJobs, job];
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(updatedJobs));
    }
  } catch (error) {
    console.error('Error saving job:', error);
  }
};

export const unsaveJob = (jobId: string): void => {
  try {
    const savedJobs = getSavedJobs();
    const updatedJobs = savedJobs.filter(job => 
      job.id !== jobId && job._id !== jobId
    );
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(updatedJobs));
  } catch (error) {
    console.error('Error removing saved job:', error);
  }
};

export const isJobSaved = (jobId: string): boolean => {
  try {
    const savedJobs = getSavedJobs();
    return savedJobs.some(job => job.id === jobId || job._id === jobId);
  } catch (error) {
    console.error('Error checking if job is saved:', error);
    return false;
  }
};

export const clearAllSavedJobs = (): void => {
  try {
    localStorage.removeItem(SAVED_JOBS_KEY);
  } catch (error) {
    console.error('Error clearing saved jobs:', error);
  }
}; 