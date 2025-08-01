import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing and using Career Mart's website and services, you accept and agree to be bound 
                by the terms and conditions outlined in this agreement. If you do not agree to these terms, 
                please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Service Description</h2>
              <p className="text-muted-foreground mb-4">
                Career Mart provides an online job search and recruitment platform that connects job seekers 
                with potential employers. Our services include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Job posting and search functionality</li>
                <li>Resume upload and management</li>
                <li>Job application submission</li>
                <li>Communication tools between job seekers and employers</li>
                <li>Career resources and tools</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
              <p className="text-muted-foreground mb-4">
                As a user of our platform, you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provide accurate and truthful information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the platform for lawful purposes only</li>
                <li>Respect the rights of other users</li>
                <li>Not engage in spam, harassment, or fraudulent activities</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Prohibited Activities</h2>
              <p className="text-muted-foreground mb-4">
                You may not use our services to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Post false or misleading information</li>
                <li>Harass, threaten, or discriminate against others</li>
                <li>Violate intellectual property rights</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated tools to scrape or collect data</li>
                <li>Engage in any illegal activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                All content on this platform, including but not limited to text, graphics, logos, images, 
                and software, is the property of Career Mart and is protected by copyright and other 
                intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                Career Mart shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages arising out of or relating to your use of our services. Our total 
                liability to you shall not exceed the amount paid by you for our services in the twelve 
                months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Termination</h2>
              <p className="text-muted-foreground mb-4">
                We may terminate or suspend your account and access to our services at any time, with or 
                without notice, for conduct that we believe violates these Terms of Service or is harmful 
                to other users or our business.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground mb-4">
                We reserve the right to modify these terms at any time. We will notify users of any 
                material changes by posting the new terms on our website. Your continued use of our 
                services after such changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Contact Us</strong><br />
                  Email: support@careermart.com<br />
                  Address: India
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 