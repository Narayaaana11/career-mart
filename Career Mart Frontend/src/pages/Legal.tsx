import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Legal() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Legal Information</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Legal Notice</h2>
              <p className="text-muted-foreground mb-4">
                This website is operated by Career Mart ("we," "us," or "our"). By accessing and using this website, 
                you accept and agree to be bound by the terms and provision of this agreement.
              </p>
              <p className="text-muted-foreground mb-4">
                The information provided on this website is for general informational purposes only. While we strive 
                to keep the information up to date and correct, we make no representations or warranties of any kind, 
                express or implied, about the completeness, accuracy, reliability, suitability, or availability of 
                the information, products, services, or related graphics contained on the website for any purpose.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                All content on this website, including but not limited to text, graphics, logos, images, and software, 
                is the property of Career Mart and is protected by copyright laws. You may not reproduce, distribute, 
                or create derivative works from this content without our express written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                In no event shall Career Mart be liable for any direct, indirect, incidental, special, or consequential 
                damages arising out of or in any way connected with the use of this website or the information contained herein.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
              <p className="text-muted-foreground mb-4">
                This agreement shall be governed by and construed in accordance with the laws of the United States. 
                Any disputes arising from this agreement shall be subject to the exclusive jurisdiction of the courts 
                in the state of California.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                For any legal inquiries, please contact us at:
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