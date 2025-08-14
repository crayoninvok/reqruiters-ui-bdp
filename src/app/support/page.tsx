// app/support/page.tsx
import Footer from "@/components/Footer";
import Link from "next/link";

interface SupportCardProps {
  title: string;
  description: string;
  action: string;
  href: string;
}

interface FAQItemProps {
  question: string;
  answer: string;
}

function SupportCard({ title, description, action, href }: SupportCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
      <h3 className="text-xl font-medium text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 mb-4 leading-relaxed">{description}</p>
      <Link
        href={href}
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200"
      >
        {action}
      </Link>
    </div>
  );
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div className="border-b border-slate-200 pb-6">
      <h3 className="text-lg font-medium text-slate-900 mb-2">{question}</h3>
      <p className="text-slate-600 leading-relaxed">{answer}</p>
    </div>
  );
}

export default function Support() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-light text-slate-900 mb-4">Support Center</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get the help you need with our HR Management platform. We're here to support you 24/7.
          </p>
        </div>
      </section>

      {/* Support Options Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-slate-900 mb-4">How Can We Help?</h2>
            <p className="text-lg text-slate-600">Choose the best way to get support</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <SupportCard
              title="Technical Support"
              description="Get help with platform issues, account access, or technical difficulties."
              action="Contact Support"
              href="mailto:support@bataramining.com"
            />
            <SupportCard
              title="Training & Onboarding"
              description="Learn how to use the platform effectively with our comprehensive training resources."
              action="View Resources"
              href="https://www.bataramining.com/training"
            />
            <SupportCard
              title="Account Management"
              description="Need help with billing, user permissions, or account settings? We're here to help."
              action="Manage Account"
              href="mailto:accounts@bataramining.com"
            />
          </div>

          {/* Contact Information */}
          <div className="bg-blue-50 rounded-xl p-8 mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-medium text-slate-900 mb-2">24/7 Support Available</h3>
              <p className="text-slate-600">Our support team is always ready to help you</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-blue-600 font-semibold mb-2">Email Support</div>
                <a href="mailto:support@bataramining.com" className="text-slate-700 hover:text-blue-600">
                  support@bataramining.com
                </a>
              </div>
              <div>
                <div className="text-blue-600 font-semibold mb-2">Phone Support</div>
                <a href="tel:+62-21-1234-5678" className="text-slate-700 hover:text-blue-600">
                  +62-21-1234-5678
                </a>
              </div>
              <div>
                <div className="text-blue-600 font-semibold mb-2">Response Time</div>
                <span className="text-slate-700">Within 2 hours</span>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-light text-slate-900 mb-4">Frequently Asked Questions</h3>
              <p className="text-lg text-slate-600">Find quick answers to common questions</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              <FAQItem
                question="How do I reset my password?"
                answer="Click on the 'Forgot Password' link on the login page, enter your email address, and follow the instructions sent to your email to create a new password."
              />
              <FAQItem
                question="How can I add new employees to the system?"
                answer="Navigate to the Employee Management section, click 'Add New Employee', and fill in the required information. You'll need administrator privileges to add new users."
              />
              <FAQItem
                question="What file formats are supported for document uploads?"
                answer="We support PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, and other common document formats. Maximum file size is 10MB per document."
              />
              <FAQItem
                question="How is my data secured?"
                answer="We use 256-bit SSL encryption, regular security audits, and ISO 27001 certified data centers. All data is backed up daily and stored in secure, geographically distributed locations."
              />
              <FAQItem
                question="Can I export employee data?"
                answer="Yes, you can export employee data in various formats including CSV, Excel, and PDF. This feature is available to users with appropriate permissions."
              />
              <FAQItem
                question="How do I manage user permissions?"
                answer="Go to System Settings > User Management to assign roles and permissions. You can create custom roles or use our predefined permission sets for different user types."
              />
              <FAQItem
                question="Is there a mobile app available?"
                answer="Currently, our platform is optimized for web browsers on all devices. A dedicated mobile app is in development and will be available in the coming months."
              />
              <FAQItem
                question="What should I do if I encounter a system error?"
                answer="Take a screenshot of the error message and contact our support team immediately. Include details about what you were doing when the error occurred for faster resolution."
              />
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mt-16 bg-slate-50 rounded-xl p-8">
            <div className="text-center">
              <h3 className="text-2xl font-medium text-slate-900 mb-4">Additional Resources</h3>
              <p className="text-slate-600 mb-6">
                Still need help? Visit our main website for more information and resources.
              </p>
              <Link
                href="https://www.bataramining.com/"
                className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Visit Batara Homepage
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}