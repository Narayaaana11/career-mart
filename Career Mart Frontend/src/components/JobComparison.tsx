import { useState } from 'react';
import { Job } from '@/types/job';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GitCompare, X, ExternalLink, MapPin, Clock, Building, DollarSign, Eye } from 'lucide-react';

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

interface JobComparisonProps {
  jobs: Job[];
}

export const JobComparison = ({ jobs }: JobComparisonProps) => {
  const [compareList, setCompareList] = useState<Job[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCompare = (job: Job) => {
    if (compareList.find(j => j.id === job.id)) return;
    if (compareList.length >= 3) return;
    setCompareList(prev => [...prev, job]);
  };

  const removeFromCompare = (jobId: string) => {
    setCompareList(prev => prev.filter(j => j.id !== jobId));
  };

  const clearCompare = () => {
    setCompareList([]);
    setIsOpen(false);
  };

  return (
    <>
      {/* Compare Bar - Fixed at bottom when jobs are selected */}
      {compareList.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="p-4 bg-background border shadow-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <GitCompare className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {compareList.length} job{compareList.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" disabled={compareList.length < 2}>
                    Compare Jobs
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Job Comparison</DialogTitle>
                  </DialogHeader>
                  <JobComparisonTable jobs={compareList} onRemove={removeFromCompare} />
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={clearCompare}>
                Clear All
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Add to Compare Button Component */}
      <CompareButton 
        jobs={jobs} 
        compareList={compareList} 
        onAddToCompare={addToCompare} 
        onRemoveFromCompare={removeFromCompare}
      />
    </>
  );
};

interface CompareButtonProps {
  jobs: Job[];
  compareList: Job[];
  onAddToCompare: (job: Job) => void;
  onRemoveFromCompare: (jobId: string) => void;
}

export const CompareButton = ({ jobs, compareList, onAddToCompare, onRemoveFromCompare }: CompareButtonProps) => {
  return null; // This will be used in JobCard component
};

interface JobComparisonTableProps {
  jobs: Job[];
  onRemove: (jobId: string) => void;
}

const JobComparisonTable = ({ jobs, onRemove }: JobComparisonTableProps) => {
  const comparisonFields = [
    { key: 'title', label: 'Job Title', icon: Building },
    { key: 'company', label: 'Company', icon: Building },
    { key: 'location', label: 'Location', icon: MapPin },
    { key: 'type', label: 'Job Type', icon: Clock },
    { key: 'salary', label: 'Salary', icon: DollarSign },
    { key: 'postedDate', label: 'Posted', icon: Clock },
    { key: 'description', label: 'Description', icon: null },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <td className="p-3 font-medium border-b w-32">Criteria</td>
            {jobs.map((job) => (
              <td key={job.id} className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{job.title}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(job.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonFields.map((field) => (
            <tr key={field.key} className="border-b">
              <td className="p-3 font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  {field.icon && <field.icon className="h-4 w-4" />}
                  {field.label}
                </div>
              </td>
              {jobs.map((job) => (
                <td key={`${job.id}-${field.key}`} className="p-3">
                  <ComparisonCell job={job} field={field.key} />
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td className="p-3 font-medium text-muted-foreground">Actions</td>
            {jobs.map((job) => (
              <td key={`${job.id}-actions`} className="p-3">
                <Button 
                  size="sm" 
                  onClick={() => window.open(job.applyUrl, '_blank')}
                  className="gap-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  Apply
                </Button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const ComparisonCell = ({ job, field }: { job: Job; field: string }) => {
  const getValue = () => {
    switch (field) {
      case 'title':
        return job.title;
      case 'company':
        return job.company;
      case 'location':
        return job.location;
      case 'type':
        return <Badge variant="outline">{job.type}</Badge>;
      case 'salary':
        return job.salary || 'Not specified';
      case 'postedDate':
        return formatDate(job.postedDate);
      case 'description':
        return (
          <div className="max-w-xs">
            <p className="text-sm line-clamp-3">
              {job.description || 'No description available'}
            </p>
          </div>
        );
      default:
        return '-';
    }
  };

  return <div className="text-sm">{getValue()}</div>;
};