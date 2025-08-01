import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, ExternalLink, Clock, Building, MapPin } from 'lucide-react';
import { Job } from '@/types/job';
import { jobsAPI } from '@/lib/api';

interface RecentJobsProps {
  onJobSelect?: (job: Job) => void;
}

export const JobAlerts = ({ onJobSelect }: RecentJobsProps) => {
  const { toast } = useToast();
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getJobs({ limit: 10 }); // Get more jobs to ensure we have enough recent ones
      const jobs = response.jobs || [];
      
      // Sort by creation date to get the most recent jobs
      const sortedJobs = jobs.sort((a: Job, b: Job) => {
        const dateA = new Date(a.createdAt || a.postedDate || 0);
        const dateB = new Date(b.createdAt || b.postedDate || 0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setRecentJobs(sortedJobs.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch recent jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load recent jobs. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentJobs();
    
    // Set up polling to check for new jobs every 30 seconds
    const interval = setInterval(fetchRecentJobs, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleJobClick = (job: Job) => {
    if (onJobSelect) {
      onJobSelect(job);
    }
  };

  const formatDate = (date: string | Date) => {
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (date: string | Date) => {
    try {
      const now = new Date();
      const jobDate = new Date(date);
      
      // Check if the date is valid
      if (isNaN(jobDate.getTime())) {
        return 'Recently';
      }
      
      const diffInHours = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 48) return '1 day ago';
      return formatDate(date);
    } catch (error) {
      return 'Recently';
    }
  };

  return (
    <Card className="p-6 bg-gradient-subtle border-0 shadow-elegant">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Recent Job Alerts</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          Live Updates
        </Badge>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : recentJobs.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent jobs available</p>
            <p className="text-sm">New jobs will appear here automatically</p>
          </div>
        ) : (
          recentJobs.map((job) => (
            <div 
              key={job.id || job._id} 
              className="p-3 bg-background rounded-lg border hover:border-primary/50 transition-colors cursor-pointer group"
              onClick={() => handleJobClick(job)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                      {job.title}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {job.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Building className="h-3 w-3" />
                    <span className="truncate">{job.company}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{job.location}</span>
                    <span className="text-primary">•</span>
                    <Clock className="h-3 w-3" />
                    <span>{formatTimeAgo(job.postedDate)}</span>
                  </div>
                </div>
                
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
              </div>
            </div>
          ))
        )}
      </div>

      {recentJobs.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Updates every 30 seconds • Click to view details
          </p>
        </div>
      )}
    </Card>
  );
};