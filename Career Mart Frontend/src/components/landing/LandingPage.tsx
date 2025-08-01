import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "./HeroSection";
import { SearchBarSection } from "./SearchBarSection";
import { ValuePropositionSection } from "./ValuePropositionSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { FeaturedCompaniesSection } from "./FeaturedCompaniesSection";
import { NewsletterSection } from "./NewsletterSection";

export function LandingPage() {

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        <SearchBarSection />
        
        {/* ATS Resume Builder Section */}
        <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Build Your Professional Resume
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Create an ATS-friendly resume that stands out to recruiters and hiring managers.
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Comming Soon!
              </h2>
            </div>
            
          </div>
        </section>
        
        <FeaturedCompaniesSection />
        <ValuePropositionSection />
        <HowItWorksSection />
        <NewsletterSection />
      </main>
      
      <Footer />
    </div>
  );
}