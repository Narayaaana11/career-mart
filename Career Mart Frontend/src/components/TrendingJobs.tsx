import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Building2 } from "lucide-react";

interface TrendingJob {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  openings: number;
  trending: boolean;
}

const trendingJobs: TrendingJob[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    openings: 12,
    trending: true
  },
  {
    id: '2',
    title: 'Data Scientist',
    company: 'DataFlow',
    openings: 8,
    trending: true
  },
  {
    id: '3',
    title: 'Product Manager',
    company: 'InnovateLab',
    openings: 5,
    trending: true
  },
  {
    id: '4',
    title: 'UX Designer',
    company: 'DesignHub',
    openings: 15,
    trending: true
  }
];

export function TrendingJobs() {
  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>Trending Jobs</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {trendingJobs.map((job) => (
          <div
            key={job.id}
            className="flex items-center justify-between p-3 rounded-lg bg-gradient-subtle hover:bg-secondary/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                {job.companyLogo ? (
                  <img 
                    src={job.companyLogo} 
                    alt={`${job.company} logo`}
                    className="h-6 w-6 rounded object-cover"
                  />
                ) : (
                  <Building2 className="h-4 w-4 text-white" />
                )}
              </div>
              <div>
                <p className="font-medium text-sm">{job.title}</p>
                <p className="text-xs text-muted-foreground">{job.company}</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {job.openings} open
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}