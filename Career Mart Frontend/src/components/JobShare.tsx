import { useState } from 'react';
import { Job } from '@/types/job';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Share2, Copy, Mail, MessageCircle, Linkedin, Twitter } from 'lucide-react';

interface JobShareProps {
  job: Job;
  children: React.ReactNode;
}

export const JobShare = ({ job, children }: JobShareProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const jobId = job.id || job._id || '';
  const shareUrl = `${window.location.origin}/jobs?job=${jobId}`;
  const shareText = `Check out this job opportunity: ${job.title} at ${job.company}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "Job link has been copied to clipboard",
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: "Failed to Copy",
        description: "Could not copy link to clipboard",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Job Opportunity: ${job.title}`);
    
    // Format salary for email
    let salaryText = '';
    if (job.salary) {
      if (typeof job.salary === 'string') {
        salaryText = `Salary: ${job.salary}`;
      } else if (typeof job.salary === 'object') {
        const { min, max, currency = '$' } = job.salary;
        if (min && max) {
          salaryText = `Salary: ${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
        } else if (min) {
          salaryText = `Salary: ${currency}${min.toLocaleString()}+`;
        } else if (max) {
          salaryText = `Salary: Up to ${currency}${max.toLocaleString()}`;
        }
      }
    }
    
    const body = encodeURIComponent(`Hi,

I found this job opportunity that might interest you:

${job.title} at ${job.company}
Location: ${job.location}
Type: ${job.type}
${salaryText ? `${salaryText}\n` : ''}
${job.description ? `Description: ${job.description.slice(0, 200)}...\n` : ''}
View and apply here: ${shareUrl}

Best regards`);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaLinkedIn = () => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(shareText);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const shareViaTwitter = () => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(`${shareText} #jobs #career`);
    window.open(`https://x.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Job
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Job Summary */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold text-sm mb-1">{job.title}</h4>
            <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
          </div>

          {/* Share Options */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={copyToClipboard}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
            
            <Button
              variant="outline"
              onClick={shareViaEmail}
              className="gap-2"
            >
              <Mail className="h-4 w-4" />
              Email
            </Button>
            
            <Button
              variant="outline"
              onClick={shareViaLinkedIn}
              className="gap-2"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
            
            <Button
              variant="outline"
              onClick={shareViaTwitter}
              className="gap-2"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            
            <Button
              variant="outline"
              onClick={shareViaWhatsApp}
              className="gap-2 col-span-2"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};