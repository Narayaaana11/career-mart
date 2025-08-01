import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store email in localStorage for demo purposes
      const existingEmails = JSON.parse(localStorage.getItem('newsletter_emails') || '[]');
      existingEmails.push(email);
      localStorage.setItem('newsletter_emails', JSON.stringify(existingEmails));
      
      setIsSuccess(true);
      setEmail("");
      toast.success("Subscribed successfully! You'll receive job alerts soon.");
      
      // Reset success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      setError("Failed to subscribe. Please try again.");
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="newsletter" className="py-20 bg-gradient-primary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block p-3 bg-white/10 rounded-full mb-6">
            <Bell className="h-6 w-6" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Never Miss a Job Opportunity
          </h2>
          
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Get personalized job alerts delivered straight to your inbox. Be the first to know about new openings matching your skills and preferences.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white"
                disabled={isSubmitting || isSuccess}
                aria-describedby={error ? "newsletter-error" : undefined}
              />
              {error && <p id="newsletter-error" className="text-red-200 text-sm mt-1 text-left">{error}</p>}
            </div>
            
            <Button 
              type="submit" 
              className="h-12 px-6 bg-white text-primary hover:bg-white/90 transition-colors"
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting ? "Subscribing..." : isSuccess ? "Subscribed!" : "Subscribe"}
            </Button>
          </form>
          
          <p className="text-white/60 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}