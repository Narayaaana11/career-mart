import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Cookies() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
              <p className="text-muted-foreground mb-4">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                analyzing how you use our site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Essential Cookies</h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies are necessary for the website to function properly. They enable basic 
                    functions like page navigation and access to secure areas.
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Authentication and security</li>
                    <li>Session management</li>
                    <li>Load balancing</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Performance Cookies</h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies help us understand how visitors interact with our website by collecting 
                    and reporting information anonymously.
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Website analytics</li>
                    <li>Error tracking</li>
                    <li>Performance monitoring</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Functional Cookies</h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies enable enhanced functionality and personalization, such as remembering 
                    your preferences and settings.
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Language preferences</li>
                    <li>Job search filters</li>
                    <li>User interface customization</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Marketing Cookies</h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies are used to track visitors across websites to display relevant and 
                    engaging advertisements.
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Ad targeting</li>
                    <li>Social media integration</li>
                    <li>Retargeting campaigns</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
              <p className="text-muted-foreground mb-4">
                We may use third-party services that place cookies on your device. These services help us:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Analyze website traffic and user behavior</li>
                <li>Provide social media integration</li>
                <li>Deliver targeted advertising</li>
                <li>Improve website performance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
              <p className="text-muted-foreground mb-4">
                You can control and manage cookies in several ways:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Browser Settings:</strong> Most browsers allow you to refuse cookies or delete them</li>
                <li><strong>Cookie Consent:</strong> Use our cookie consent banner to manage preferences</li>
                <li><strong>Third-Party Opt-Out:</strong> Visit third-party websites to opt out of their cookies</li>
                <li><strong>Mobile Devices:</strong> Adjust settings in your mobile browser or app</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Cookie Retention</h2>
              <p className="text-muted-foreground mb-4">
                Different types of cookies are stored for different periods:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period</li>
                <li><strong>Analytics Cookies:</strong> Typically stored for 1-2 years</li>
                <li><strong>Marketing Cookies:</strong> Usually stored for 90 days to 2 years</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
              <p className="text-muted-foreground mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices 
                or for other operational, legal, or regulatory reasons. We will notify you of any 
                material changes by posting the new policy on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about our use of cookies, please contact us at:
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