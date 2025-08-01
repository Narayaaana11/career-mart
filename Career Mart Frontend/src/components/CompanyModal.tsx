import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Building2, ExternalLink, Globe, Users, TrendingUp, Calendar, DollarSign, Award, Phone, Mail, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';
import { Company } from '@/types/company';

interface CompanyModalProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({ company, isOpen, onClose }) => {
  if (!company) return null;

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

  const handleVisitCareers = () => {
    window.open(company.careerUrl, '_blank', 'noopener,noreferrer');
  };

  const handleVisitWebsite = () => {
    if (company.website) {
      window.open(company.website, '_blank', 'noopener,noreferrer');
    } else {
      // Extract domain from career URL for main website
      const domain = company.careerUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
      const websiteUrl = `https://${domain}`;
      window.open(websiteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSocialMediaClick = (url: string | undefined) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
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
              <h2 className="text-2xl font-bold">{company.name}</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-3 w-3" />
                <span>{company.location}</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Overview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company Overview</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {company.description}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-sm">
                  {company.industry}
                </Badge>
              </div>
              <div className="flex items-center space-x-1">
                {renderStars(company.rating)}
                <span className="text-sm text-gray-500">({company.rating})</span>
              </div>
              {company.founded && (
                <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>Founded {company.founded}</span>
                </div>
              )}
              {company.featured && (
                <div className="flex items-center space-x-1 text-sm text-blue-600">
                  <Award className="h-4 w-4" />
                  <span>Featured</span>
                </div>
              )}
            </div>
          </div>

          {/* Company Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {company.openPositions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Open Positions
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {company.rating}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Company Rating
              </div>
            </div>
            
            {company.companySize && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {company.companySize}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Company Size
                </div>
              </div>
            )}
            
            {company.revenue && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {company.revenue}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Revenue
                </div>
              </div>
            )}
          </div>

          {/* Additional Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Technologies */}
            {company.technologies && company.technologies.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {company.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {company.benefits && company.benefits.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Benefits</h3>
                <div className="flex flex-wrap gap-2">
                  {company.benefits.map((benefit, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Information */}
          {company.contact && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.contact.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{company.contact.email}</span>
                  </div>
                )}
                {company.contact.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{company.contact.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Social Media */}
          {company.socialMedia && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Social Media</h3>
              <div className="flex space-x-4">
                {company.socialMedia.linkedin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSocialMediaClick(company.socialMedia?.linkedin)}
                    className="flex items-center space-x-2"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span>LinkedIn</span>
                  </Button>
                )}
                {company.socialMedia.twitter && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSocialMediaClick(company.socialMedia?.twitter)}
                    className="flex items-center space-x-2"
                  >
                    <Twitter className="h-4 w-4" />
                    <span>Twitter</span>
                  </Button>
                )}
                {company.socialMedia.facebook && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSocialMediaClick(company.socialMedia?.facebook)}
                    className="flex items-center space-x-2"
                  >
                    <Facebook className="h-4 w-4" />
                    <span>Facebook</span>
                  </Button>
                )}
                {company.socialMedia.instagram && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSocialMediaClick(company.socialMedia?.instagram)}
                    className="flex items-center space-x-2"
                  >
                    <Instagram className="h-4 w-4" />
                    <span>Instagram</span>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Related Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Related Links</h3>
            <div className="space-y-3">
              <Button 
                onClick={handleVisitCareers}
                className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Careers Page
              </Button>
              
              <Button 
                onClick={handleVisitWebsite}
                variant="outline"
                className="w-full justify-start"
              >
                <Globe className="h-4 w-4 mr-2" />
                Visit Company Website
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button 
              onClick={handleVisitCareers}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Apply Now
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 