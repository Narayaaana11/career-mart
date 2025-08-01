import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobShare } from "@/components/JobShare";
import { JobDetailsModal } from "@/components/JobDetailsModal";
import { Job } from "@/types/job";
import { MapPin, Clock, ExternalLink, Bookmark, Share2, Eye } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from 'react';

interface JobCardProps {
  job: Job;
  onSave: (jobId: string) => void;
  saved: boolean;
  onAddToCompare?: (job: Job) => void;
  isInCompareList?: boolean;
  onRemoveFromCompare?: (jobId: string) => void;
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

export const JobCard = ({ job, onSave, saved, onAddToCompare, isInCompareList, onRemoveFromCompare }: JobCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleViewJob = () => {
    // Add to recently viewed
    if ((window as unknown as { addToRecentlyViewed?: (job: Job) => void }).addToRecentlyViewed) {
      (window as unknown as { addToRecentlyViewed: (job: Job) => void }).addToRecentlyViewed(job);
    }
  };

  const handleCompareToggle = () => {
    if (isInCompareList) {
      onRemoveFromCompare?.(job.id || job._id || '');
    } else {
      onAddToCompare?.(job);
    }
  };

  return (
    <Card className="p-4 lg:p-6 hover:shadow-elegant transition-all duration-300 bg-gradient-subtle border-0">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-2 line-clamp-2">
                {job.title}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm truncate">{job.company}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm truncate">{job.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">
                    {formatDate(job.postedDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{job.type}</Badge>
            {job.salary && (
              <Badge variant="outline" className="text-primary">
                {typeof job.salary === 'string' 
                  ? job.salary 
                  : job.salary.min && job.salary.max
                    ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`
                    : job.salary.min
                      ? `$${job.salary.min.toLocaleString()}+`
                      : job.salary.max
                        ? `Up to $${job.salary.max.toLocaleString()}`
                        : 'Salary not specified'
                }
              </Badge>
            )}
            {job.tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Description */}
          {job.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {job.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-row lg:flex-col gap-2 lg:items-end">
          <Button
            onClick={() => {
              handleViewJob();
              window.open(job.applyUrl, '_blank');
            }}
            className="bg-gradient-primary hover:opacity-90 text-white gap-2 flex-1 lg:flex-none text-sm lg:text-base"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">View & Apply</span>
            <span className="sm:hidden">Apply</span>
          </Button>
          
          <div className="flex gap-1 lg:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSave(job.id || job._id || '')}
              className={`${saved ? 'text-primary' : 'text-muted-foreground'} h-8 w-8 lg:h-9 lg:w-9 p-0`}
            >
              <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsModalOpen(true)}
                    className="text-muted-foreground hover:text-primary h-8 w-8 lg:h-9 lg:w-9 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View job details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <JobShare job={job}>
              <Button variant="ghost" size="sm" className="text-muted-foreground h-8 w-8 lg:h-9 lg:w-9 p-0">
                <Share2 className="h-4 w-4" />
              </Button>
            </JobShare>
          </div>
        </div>
      </div>
      
      {/* Job Details Modal */}
      <JobDetailsModal
        job={job}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSave}
        saved={saved}
      />
    </Card>
  );
};