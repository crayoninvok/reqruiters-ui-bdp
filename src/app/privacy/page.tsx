// app/privacy/page.tsx
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-light text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-slate-600">
            Last updated: January 2025
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto prose prose-slate prose-lg">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Introduction</h2>
              <p className="text-slate-700 leading-relaxed">
                Batara Dharma Persada ("we," "our," or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you use our HR Management platform.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-slate-800 mb-2">Personal Information</h3>
                  <p className="text-slate-700 leading-relaxed">
                    We collect personal information you provide directly to us, including but not limited to:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-700">
                    <li>Name, email address, and contact information</li>
                    <li>Employment history and professional qualifications</li>
                    <li>Identity documents and certifications</li>
                    <li>Performance records and evaluations</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-slate-800 mb-2">Technical Information</h3>
                  <p className="text-slate-700 leading-relaxed">
                    We automatically collect certain technical information when you access our platform, 
                    including IP addresses, browser type, device information, and usage patterns.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">How We Use Your Information</h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Managing employee records and HR operations</li>
                <li>Processing recruitment applications</li>
                <li>Ensuring platform security and preventing unauthorized access</li>
                <li>Improving our services and user experience</li>
                <li>Complying with legal and regulatory requirements</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Data Security</h2>
              <p className="text-slate-700 leading-relaxed">
                We implement industry-standard security measures to protect your information, including 
                256-bit encryption, secure data centers, and regular security audits. Our platform is 
                ISO 27001 certified to ensure the highest standards of information security management.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Information Sharing</h2>
              <p className="text-slate-700 leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share 
                information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1 text-slate-700">
                <li>With authorized personnel within your organization</li>
                <li>When required by law or legal process</li>
                <li>To protect our rights, property, or safety</li>
                <li>With service providers who assist in our operations (under strict confidentiality agreements)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Your Rights</h2>
              <p className="text-slate-700 leading-relaxed">
                You have the right to access, update, correct, or delete your personal information. 
                You may also request data portability or object to certain processing activities. 
                To exercise these rights, please contact our support team.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Data Retention</h2>
              <p className="text-slate-700 leading-relaxed">
                We retain your information for as long as necessary to fulfill the purposes outlined 
                in this policy, comply with legal obligations, resolve disputes, and enforce our agreements.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Contact Us</h2>
              <p className="text-slate-700 leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, 
                please contact us through our support channels or visit our main website at 
                <a href="https://www.bataramining.com/" className="text-blue-600 hover:text-blue-800 ml-1">
                  bataramining.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}