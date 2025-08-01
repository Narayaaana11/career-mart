import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompanyLogoProps {
  name: string;
  logo: string;
}

function CompanyLogo({ name, logo }: CompanyLogoProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 min-w-[180px]">
      <div className="h-16 w-16 rounded-full bg-background shadow-soft flex items-center justify-center mb-2">
        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
          {logo}
        </div>
      </div>
      <p className="text-sm font-medium">{name}</p>
    </div>
  );
}

export function FeaturedCompaniesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth / 2;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 500);
    }
  };

  const companies = [
    { name: "Google", logo: "G" },
    { name: "Microsoft", logo: "M" },
    { name: "Amazon", logo: "A" },
    { name: "Apple", logo: "A" },
    { name: "Meta", logo: "M" },
    { name: "Netflix", logo: "N" },
    { name: "Tesla", logo: "T" },
    { name: "Spotify", logo: "S" },
    { name: "Airbnb", logo: "A" },
    { name: "Uber", logo: "U" }
  ];
  


  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Companies</h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of professionals who've found their dream jobs at these leading companies.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto mb-16">
          <div 
            className="flex overflow-x-auto scrollbar-hide py-8 px-4 -mx-4 scroll-smooth" 
            ref={scrollRef}
            onScroll={checkScrollButtons}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex space-x-6">
              {companies.map((company, index) => (
                <CompanyLogo key={index} name={company.name} logo={company.logo} />
              ))}
            </div>
          </div>

          {/* Scroll buttons */}
          <Button
            variant="outline"
            size="icon"
            className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-full shadow-medium ${!canScrollLeft ? 'opacity-0' : 'opacity-100'}`}
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className={`absolute right-0 top-1/2 -translate-y-1/2 rounded-full shadow-medium ${!canScrollRight ? 'opacity-0' : 'opacity-100'}`}
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

// Add this to your global CSS or as a style tag
// .scrollbar-hide::-webkit-scrollbar {
//   display: none;
// }