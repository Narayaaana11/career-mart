import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, Bookmark, Building2, Menu } from "lucide-react";
import { useState } from "react";

export function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Career Mart
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Button
            variant={isActive("/jobs") ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/jobs">
              <Briefcase className="h-4 w-4 mr-2" />
              Jobs
            </Link>
          </Button>
          <Button
            variant={isActive("/companies") ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/companies">
              <Building2 className="h-4 w-4 mr-2" />
              Companies
            </Link>
          </Button>
          <Button
            variant={isActive("/saved") ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/saved">
              <Bookmark className="h-4 w-4 mr-2" />
              Saved
            </Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-2 space-y-1">
            <Button
              variant={isActive("/jobs") ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link to="/jobs" onClick={() => setIsMobileMenuOpen(false)}>
                <Briefcase className="h-4 w-4 mr-2" />
                Jobs
              </Link>
            </Button>
            <Button
              variant={isActive("/companies") ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link to="/companies" onClick={() => setIsMobileMenuOpen(false)}>
                <Building2 className="h-4 w-4 mr-2" />
                Companies
              </Link>
            </Button>
            <Button
              variant={isActive("/saved") ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link to="/saved" onClick={() => setIsMobileMenuOpen(false)}>
                <Bookmark className="h-4 w-4 mr-2" />
                Saved
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}