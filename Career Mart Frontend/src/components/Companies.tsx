import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, MapPin, Building2, ExternalLink, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { CompanyModal } from './CompanyModal';
import { companyAPI } from '@/lib/api';
import { Company, CompanyFilters } from '@/types/company';
import { useToast } from '@/hooks/use-toast';

export const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CompanyFilters>({
    search: '',
    industry: 'all',
    featured: false,
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCompanies: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [industries, setIndustries] = useState<string[]>(['all']);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const { toast } = useToast();

  // Fetch companies from API
  const fetchCompanies = async (filters: CompanyFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await companyAPI.getCompanies(filters);
      setCompanies(response.companies);
      setPagination(response.pagination);
      
      // Extract unique industries for filter dropdown
      const uniqueIndustries = ['all', ...Array.from(new Set(response.companies.map(company => company.industry)))];
      setIndustries(uniqueIndustries);
      
      // Reset page transition state after data loads
      setTimeout(() => {
        setIsPageTransitioning(false);
      }, 100);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to load companies. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load companies. Please try again.",
        variant: "destructive",
      });
      setIsPageTransitioning(false);
    } finally {
      setLoading(false);
    }
  };

  // Load companies on component mount
  useEffect(() => {
    fetchCompanies(filters);
  }, [filters]);

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleIndustryChange = (value: string) => {
    setFilters(prev => ({ ...prev, industry: value, page: 1 }));
  };

  const handleFeaturedToggle = () => {
    setFilters(prev => ({ ...prev, featured: !prev.featured, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setIsPageTransitioning(true);
    setTimeout(() => {
      setFilters(prev => ({ ...prev, page }));
    }, 150);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading && companies.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-16">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Companies Hiring
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover opportunities at leading companies across various industries. 
          Click on any company to view details and explore open positions.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search companies..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={filters.industry || 'all'} onValueChange={handleIndustryChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry === 'all' ? 'All Industries' : industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant={filters.featured ? "default" : "outline"}
            onClick={handleFeaturedToggle}
            className="w-full sm:w-auto"
          >
            {filters.featured ? 'Show All' : 'Featured Only'}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Button 
            onClick={() => fetchCompanies(filters)} 
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Companies Grid */}
      {!error && (
        <div 
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 ease-in-out ${
            isPageTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {companies.map((company) => (
                         <Card 
               key={company._id || company.id} 
               className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 border-transparent hover:border-blue-300 transform hover:scale-105"
              onClick={() => handleCompanyClick(company)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCompanyClick(company);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Click to view ${company.name} details`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      {company.logo ? (
                        <img 
                          src={company.logo} 
                          alt={`${company.name} logo`}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <Building2 className={`h-6 w-6 text-gray-600 dark:text-gray-400 ${company.logo ? 'hidden' : ''}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                        {company.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-3 w-3" />
                        <span>{company.location}</span>
                      </div>
                    </div>
                  </div>
                  {company.featured && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Featured
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {company.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {company.industry}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {renderStars(company.rating)}
                    <span className="text-xs text-gray-500 ml-1">({company.rating})</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {company.openPositions} open positions
                  </span>
                  <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                    <span className="text-xs font-medium">Click to View Details</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!error && !loading && companies.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No companies found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}

             {/* Pagination */}
       {!error && !loading && companies.length > 0 && pagination.totalPages > 1 && (
         <div className="mt-8 flex items-center justify-center space-x-2 transition-opacity duration-300">
                     <Button
             variant="outline"
             size="sm"
             onClick={() => handlePageChange(pagination.currentPage - 1)}
             disabled={!pagination.hasPrevPage || isPageTransitioning}
             className="flex items-center space-x-1 transition-all duration-200 hover:scale-105"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.currentPage <= 3) {
                pageNum = i + 1;
              } else if (pagination.currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.currentPage - 2 + i;
              }
              
              return (
                                 <Button
                   key={pageNum}
                   variant={pagination.currentPage === pageNum ? "default" : "outline"}
                   size="sm"
                   onClick={() => handlePageChange(pageNum)}
                   disabled={isPageTransitioning}
                   className="w-10 h-10 transition-all duration-200 hover:scale-105"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
                     <Button
             variant="outline"
             size="sm"
             onClick={() => handlePageChange(pagination.currentPage + 1)}
             disabled={!pagination.hasNextPage || isPageTransitioning}
             className="flex items-center space-x-1 transition-all duration-200 hover:scale-105"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}



      {/* Company Modal */}
      <CompanyModal
        company={selectedCompany}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}; 