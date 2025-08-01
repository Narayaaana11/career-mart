import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Accessibility() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Accessibility Statement</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
              <p className="text-muted-foreground mb-4">
                Career Mart is committed to ensuring digital accessibility for people with disabilities. 
                We are continually improving the user experience for everyone and applying the relevant 
                accessibility standards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Conformance Status</h2>
              <p className="text-muted-foreground mb-4">
                The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and 
                developers to improve accessibility for people with disabilities. It defines three levels 
                of conformance: Level A, Level AA, and Level AAA. Career Mart is partially conformant 
                with WCAG 2.1 level AA. Partially conformant means that some parts of the content do 
                not fully conform to the accessibility standard.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Accessibility Features</h2>
              <p className="text-muted-foreground mb-4">
                Our website includes the following accessibility features:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Keyboard navigation support</li>
                <li>Screen reader compatibility</li>
                <li>High contrast mode</li>
                <li>Resizable text and zoom functionality</li>
                <li>Alternative text for images</li>
                <li>Semantic HTML structure</li>
                <li>Focus indicators for interactive elements</li>
                <li>Color contrast compliance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Known Limitations</h2>
              <p className="text-muted-foreground mb-4">
                While we strive to ensure the highest level of accessibility, we acknowledge that some 
                areas may have limitations:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Some third-party content may not be fully accessible</li>
                <li>Complex data visualizations may require additional descriptions</li>
                <li>Some older job postings may lack structured data</li>
                <li>Video content may not always have captions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Assistive Technologies</h2>
              <p className="text-muted-foreground mb-4">
                Our website is designed to work with the following assistive technologies:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Screen readers (JAWS, NVDA, VoiceOver, TalkBack)</li>
                <li>Screen magnification software</li>
                <li>Speech recognition software</li>
                <li>Switch navigation devices</li>
                <li>Voice control software</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Testing and Evaluation</h2>
              <p className="text-muted-foreground mb-4">
                We regularly test our website for accessibility using:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Automated accessibility testing tools</li>
                <li>Manual testing with assistive technologies</li>
                <li>User testing with people with disabilities</li>
                <li>Expert accessibility audits</li>
                <li>Continuous monitoring and improvement</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Feedback and Support</h2>
              <p className="text-muted-foreground mb-4">
                We welcome your feedback on the accessibility of Career Mart. Please let us know if you 
                encounter accessibility barriers:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Email: accessibility@careermart.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Online feedback form</li>
                <li>Support chat (with accessibility features)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Alternative Formats</h2>
              <p className="text-muted-foreground mb-4">
                If you need information in an alternative format, we can provide:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Large print materials</li>
                <li>Audio descriptions</li>
                <li>Braille documents</li>
                <li>Sign language interpretation for meetings</li>
                <li>Alternative communication methods</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Continuous Improvement</h2>
              <p className="text-muted-foreground mb-4">
                We are committed to continuously improving our accessibility by:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Regular accessibility training for our team</li>
                <li>Staying updated with accessibility standards</li>
                <li>Incorporating user feedback</li>
                <li>Testing with new assistive technologies</li>
                <li>Conducting regular accessibility audits</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                For accessibility-related inquiries or support, please contact us at:
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