import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Job } from "@/types/job";
import { getSavedJobs, unsaveJob } from "@/utils/savedJobs";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const { toast } = useToast();

  // Load saved jobs from localStorage on component mount
  useEffect(() => {
    const loadSavedJobs = () => {
      try {
        const jobs = getSavedJobs();
        setSavedJobs(jobs);
      } catch (error) {
        console.error('Error loading saved jobs:', error);
        toast({
          title: "Error",
          description: "Failed to load saved jobs.",
          variant: "destructive",
        });
      }
    };

    loadSavedJobs();
  }, [toast]);

  const handleUnsaveJob = (jobId: string) => {
    unsaveJob(jobId);
    setSavedJobs(prev => prev.filter(job => job.id !== jobId && job._id !== jobId));
    
    toast({
      title: "Job removed from saved",
      description: "The job has been removed from your saved list.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Bookmark className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">Saved Jobs</h1>
            </div>
          </div>

          {/* Saved Jobs List */}
          {savedJobs.length > 0 ? (
            <div className="space-y-4">
              <p className="text-muted-foreground mb-6 text-center">
                You have {savedJobs.length} saved job{savedJobs.length !== 1 ? 's' : ''}
              </p>
              
              {savedJobs.map((job) => (
                <JobCard
                  key={job.id || job._id}
                  job={job}
                  onSave={handleUnsaveJob}
                  saved={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gradient-subtle rounded-lg p-12 max-w-md mx-auto">
                <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No saved jobs yet</h2>
                <p className="text-muted-foreground mb-6">
                  Start saving jobs you're interested in to view them here
                </p>
                <Button asChild>
                  <Link to="/">
                    Browse Jobs
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}