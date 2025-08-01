import React, { useState, useEffect } from 'react';
import { scrapingAPI } from '../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Loader2, Globe, AlertCircle, CheckCircle, XCircle, Info, CheckCircle2 } from 'lucide-react';
import { Job } from '../types/job';
import { useToast } from '../hooks/use-toast';

interface ScrapingResult {
  url: string;
  status: 'success' | 'failed' | 'skipped';
  jobsFound?: number;
  jobsSaved?: number;
  company?: string;
  error?: string;
}

interface JobScraperProps {
  onJobsScraped?: (jobs: Job[]) => void;
}

const JobScraper: React.FC<JobScraperProps> = ({ onJobsScraped }) => {
  const [activeTab, setActiveTab] = useState('single');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [results, setResults] = useState<ScrapingResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Single URL scraping
  const [singleUrl, setSingleUrl] = useState('');
  const [singleKeywords, setSingleKeywords] = useState('');
  const [singleLocation, setSingleLocation] = useState('');
  const [singleType, setSingleType] = useState('any');
  const [singleLimit, setSingleLimit] = useState(50);



  // Manual job entry
  const [manualJob, setManualJob] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-Time',
    applyUrl: '',
    description: '',
    tags: ''
  });



  const handleSingleUrlScrape = async () => {
    if (!singleUrl.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setError(null);
    setResults([]);

    try {
      const response = await scrapingAPI.scrapeSingleUrl({
        url: singleUrl.trim(),
        keywords: singleKeywords.trim() || undefined,
        location: singleLocation.trim() || undefined,
        type: singleType === 'any' ? undefined : singleType,
        limit: singleLimit
      });

      setResults([{
        url: singleUrl,
        status: 'success',
        jobsFound: response.totalScraped,
        jobsSaved: response.newJobs,
        company: response.company
      }]);

      // Call the callback to notify parent component about the new jobs
      if (onJobsScraped && response.jobs && response.jobs.length > 0) {
        onJobsScraped(response.jobs);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to scrape jobs');
      setResults([{
        url: singleUrl,
        status: 'failed',
        error: error.response?.data?.message || 'Unknown error'
      }]);
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };



  const handleManualJobSubmit = async () => {
    if (!manualJob.title || !manualJob.company || !manualJob.applyUrl) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const jobData = {
        ...manualJob,
        tags: manualJob.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const savedJob = await scrapingAPI.addManualJob(jobData);
      
      // Reset form
      setManualJob({
        title: '',
        company: '',
        location: '',
        type: 'Full-Time',
        applyUrl: '',
        description: '',
        tags: ''
      });

      // Show success toast
      toast({
        title: "Job Added Successfully! 🎉",
        description: `"${jobData.title}" at ${jobData.company} has been added to the database.`,
        variant: "default",
      });

      // Call the callback to notify parent component about the new job
      if (onJobsScraped && savedJob) {
        onJobsScraped([savedJob]);
      }
    } catch (error: any) {
      // Check if it's a duplicate error
      if (error.response?.status === 409 && error.response?.data?.isDuplicate) {
        const existingJob = error.response.data.existingJob;
        
        // Show duplicate notification toast
        toast({
          title: "Job Already Exists! 📋",
          description: (
            <div className="space-y-2">
              <p>A job with the same title, company, and URL already exists in the database.</p>
              <div className="text-sm bg-muted p-2 rounded">
                <p><strong>Existing Job:</strong></p>
                <p>• Title: {existingJob.title}</p>
                <p>• Company: {existingJob.company}</p>
                <p>• Location: {existingJob.location || 'Not specified'}</p>
                <p>• Type: {existingJob.type}</p>
                <p>• Posted: {new Date(existingJob.postedDate).toLocaleDateString()}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Thanks for your hard work! The system is working correctly by preventing duplicates. 💪
              </p>
            </div>
          ),
          variant: "default",
          duration: 8000, // Show for 8 seconds to give time to read
        });
        
        setError(null); // Clear any previous errors
      } else {
        setError(error.response?.data?.message || 'Failed to add job');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'skipped':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'skipped':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Scraper</h1>
          <p className="text-muted-foreground">
            Scrape job listings from company career pages
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Single URL</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scrape Single URL</CardTitle>
              <CardDescription>
                Scrape jobs from a single company career page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Career Page URL *</Label>
                <Input
                  id="url"
                  placeholder="https://company.com/careers"
                  value={singleUrl}
                  onChange={(e) => setSingleUrl(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords (optional)</Label>
                  <Input
                    id="keywords"
                    placeholder="Software Engineer, React"
                    value={singleKeywords}
                    onChange={(e) => setSingleKeywords(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location (optional)</Label>
                  <Input
                    id="location"
                    placeholder="New York, Remote"
                    value={singleLocation}
                    onChange={(e) => setSingleLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Job Type</Label>
                  <Select value={singleType} onValueChange={setSingleType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Type</SelectItem>
                      <SelectItem value="Full-Time">Full-Time</SelectItem>
                      <SelectItem value="Part-Time">Part-Time</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="limit">Max Jobs</Label>
                  <Input
                    id="limit"
                    type="number"
                    min="1"
                    max="100"
                    value={singleLimit}
                    onChange={(e) => setSingleLimit(Number(e.target.value))}
                  />
                </div>
              </div>

              <Button 
                onClick={handleSingleUrlScrape} 
                disabled={true}
                className="w-full opacity-50 cursor-not-allowed"
              >
                <Globe className="mr-2 h-4 w-4" />
                Job Scraper
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">Coming Soon</p>
            </CardContent>
          </Card>
        </TabsContent>



        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Job Entry</CardTitle>
              <CardDescription>
                Add a job listing manually to the database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="Software Engineer"
                    value={manualJob.title}
                    onChange={(e) => setManualJob({...manualJob, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    placeholder="Tech Corp"
                    value={manualJob.company}
                    onChange={(e) => setManualJob({...manualJob, company: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="New York, NY"
                    value={manualJob.location}
                    onChange={(e) => setManualJob({...manualJob, location: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Job Type</Label>
                  <Select value={manualJob.type} onValueChange={(value) => setManualJob({...manualJob, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-Time">Full-Time</SelectItem>
                      <SelectItem value="Part-Time">Part-Time</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apply-url">Apply URL *</Label>
                <Input
                  id="apply-url"
                  placeholder="https://company.com/apply/job-id"
                  value={manualJob.applyUrl}
                  onChange={(e) => setManualJob({...manualJob, applyUrl: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Job description..."
                  rows={3}
                  value={manualJob.description}
                  onChange={(e) => setManualJob({...manualJob, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="React, JavaScript, Node.js"
                  value={manualJob.tags}
                  onChange={(e) => setManualJob({...manualJob, tags: e.target.value})}
                />
              </div>

              <Button 
                onClick={handleManualJobSubmit} 
                disabled={isLoading || !manualJob.title || !manualJob.company || !manualJob.applyUrl}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    Add Job
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Progress Bar */}
      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Scraping Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results Display */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scraping Results</CardTitle>
            <CardDescription>
              Summary of the scraping operation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <div className="font-medium">{result.company || 'Unknown Company'}</div>
                      <div className="text-sm text-muted-foreground">{result.url}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                    {result.jobsFound !== undefined && (
                      <span className="text-sm text-muted-foreground">
                        {result.jobsFound} found, {result.jobsSaved} saved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobScraper;