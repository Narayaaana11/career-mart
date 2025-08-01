import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { JobFilters } from "@/types/job";

interface SearchFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  onClearFilters: () => void;
  className?: string;
}

const jobTypes = ['Remote', 'Full-Time', 'Internship', 'Part-Time', 'Contract'];
const postedWithinOptions = [
  { value: 'all', label: 'All time' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
];

export function SearchFilters({ filters, onFiltersChange, onClearFilters, className }: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (key: keyof JobFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleJobType = (type: string) => {
    const newTypes = filters.type.includes(type)
      ? filters.type.filter(t => t !== type)
      : [...filters.type, type];
    updateFilters('type', newTypes);
  };

  const hasActiveFilters = filters.keyword || filters.type.length > 0 || filters.postedWithin !== 'all';

  return (
    <div className={className}>
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between"
        >
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                Active
              </Badge>
            )}
          </div>
        </Button>
      </div>

      {/* Filters Panel */}
      <Card className={`${!isExpanded ? 'hidden md:block' : ''} shadow-soft`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter Jobs</span>
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 lg:space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Job title, skills, company..."
                value={filters.keyword}
                onChange={(e) => updateFilters('keyword', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Job Type */}
          <div className="space-y-3">
            <Label>Job Type</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {jobTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={filters.type.includes(type)}
                    onCheckedChange={() => toggleJobType(type)}
                  />
                  <Label htmlFor={type} className="text-sm font-normal">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Posted Within */}
          <div className="space-y-2">
            <Label>Posted Within</Label>
            <Select value={filters.postedWithin} onValueChange={(value) => updateFilters('postedWithin', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {postedWithinOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}