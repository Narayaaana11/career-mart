import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

export function HeroSection() {
  // Use static company data instead of API call
  const companies = ["Google", "Microsoft", "Amazon", "Meta", "Apple"];

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
      
      {/* Abstract shapes */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary-light/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Find Your Dream Job, Faster
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Connect with top companies and discover opportunities that match your skills and aspirations. Your career journey starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="transition-transform duration-200 hover:scale-105">
              <Link to="/jobs" aria-label="Browse Jobs">
                Browse Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" asChild className="transition-transform duration-200 hover:scale-105">
              <ScrollLink 
                to="newsletter" 
                smooth={true} 
                duration={500} 
                offset={-20}
                className="cursor-pointer"
                aria-label="Join Job Alerts"
              >
                Join Job Alerts
              </ScrollLink>
            </Button>
          </div>
          
          <div className="mt-12 text-sm text-muted-foreground">
            <p>Trusted by professionals from leading companies</p>
            <div className="flex justify-center items-center gap-8 mt-4 opacity-70 grayscale">
              {companies.map((company, idx) => (
                <div className="h-6" key={company + idx}>{company}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}