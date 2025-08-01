import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/types/job";
import { MapPin, Clock, ExternalLink, Bookmark, Share2, Building, Calendar, DollarSign, Briefcase, Users, Award, Globe } from 'lucide-react';
import { JobShare } from "./JobShare";

interface JobDetailsModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (jobId: string) => void;
  saved: boolean;
}

export const JobDetailsModal = ({ job, isOpen, onClose, onSave, saved }: JobDetailsModalProps) => {
  if (!job) return null;

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

  const formatSalary = (salary: Job['salary']) => {
    if (typeof salary === 'string') {
      return salary;
    }
    if (salary?.min && salary?.max) {
      return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
    }
    if (salary?.min) {
      return `$${salary.min.toLocaleString()}+`;
    }
    if (salary?.max) {
      return `Up to $${salary.max.toLocaleString()}`;
    }
    return 'Salary not specified';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {job.title}
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            {job.company}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Company:</span>
                <span className="font-medium">{job.company}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Location:</span>
                <span className="font-medium">{job.location}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Type:</span>
                <Badge variant="secondary">{job.type}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Posted:</span>
                <span className="font-medium">{formatDate(job.postedDate)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Salary:</span>
                <span className="font-medium">{formatSalary(job.salary)}</span>
              </div>

              {job.experience && (
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Experience:</span>
                  <span className="font-medium">
                    {job.experience.min && job.experience.max
                      ? `${job.experience.min}-${job.experience.max} ${job.experience.unit || 'years'}`
                      : job.experience.min
                        ? `${job.experience.min}+ ${job.experience.unit || 'years'}`
                        : job.experience.max
                          ? `Up to ${job.experience.max} ${job.experience.unit || 'years'}`
                          : 'Not specified'
                    }
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tags and Skills */}
          {((job.tags && job.tags.length > 0) || (job.skills && job.skills.length > 0)) && (
            <div className="space-y-4">
              {job.tags && job.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.filter(tag => tag && tag.trim()).map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {job.skills && job.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.filter(skill => skill && skill.trim()).map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {job.description && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Job Description</h3>
              <div className="prose prose-sm max-w-none">
                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {job.description?.toString() || ''}
                </div>
              </div>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Benefits & Perks</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {job.benefits.filter(benefit => benefit && benefit.trim()).map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="space-y-3">
            {job.sourceUrl && (
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Source:</span>
                <a 
                  href={job.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  View Original Posting
                </a>
              </div>
            )}

            {job.scrapedAt && (
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Scraped:</span>
                <span className="text-sm">{formatDate(job.scrapedAt)}</span>
              </div>
            )}

            {job.createdAt && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Added to Database:</span>
                <span className="text-sm">{formatDate(job.createdAt)}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              onClick={() => {
                window.open(job.applyUrl, '_blank');
              }}
              className="bg-gradient-primary hover:opacity-90 text-white gap-2 flex-1"
            >
              <ExternalLink className="h-4 w-4" />
              Apply Now
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onSave(job.id || job._id || '')}
                className={saved ? 'text-primary border-primary' : ''}
              >
                <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
                {saved ? 'Saved' : 'Save'}
              </Button>

              <JobShare job={job}>
                <Button variant="outline">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </JobShare>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 