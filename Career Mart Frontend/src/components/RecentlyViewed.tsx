import { useState, useEffect } from 'react';
import { Job } from '@/types/job';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink, MapPin, Building } from 'lucide-react';

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

interface RecentlyViewedProps {
  onJobSelect?: (job: Job) => void;
}

export const RecentlyViewed = ({ onJobSelect }: RecentlyViewedProps) => {
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewedJobs');
    if (stored) {
      setRecentJobs(JSON.parse(stored));
    }
  }, []);

  const addToRecentlyViewed = (job: Job) => {
    setRecentJobs(prev => {
      const filtered = prev.filter(j => j.id !== job.id);
      const updated = [job, ...filtered].slice(0, 5); // Keep only 5 recent jobs
      localStorage.setItem('recentlyViewedJobs', JSON.stringify(updated));
      return updated;
    });
  };

  // Expose method globally for JobCard to use
  useEffect(() => {
    (window as any).addToRecentlyViewed = addToRecentlyViewed;
    return () => {
      delete (window as any).addToRecentlyViewed;
    };
  }, []);

  if (recentJobs.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-subtle border-0 shadow-elegant">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Recently Viewed</h3>
      </div>
      
      <div className="space-y-3">
        {recentJobs.map((job, index) => (
          <div key={job.id || job._id || `recent-job-${index}`} className="p-3 bg-background rounded-lg border hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-1 mb-1">{job.title}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Building className="h-3 w-3" />
                  <span className="truncate">{job.company}</span>
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{job.type}</Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(job.postedDate)}</span>
                </div>
              </div>
              <div className="flex gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onJobSelect?.(job)}
                  className="h-7 px-2"
                >
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(job.applyUrl, '_blank')}
                  className="h-7 px-2"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};