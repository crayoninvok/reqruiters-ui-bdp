// app/terms/page.tsx
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-light text-slate-900 mb-4">Terms of Service</h1>
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
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Agreement to Terms</h2>
              <p className="text-slate-700 leading-relaxed">
                By accessing and using the Batara Dharma Persada HR Management platform, you accept 
                and agree to be bound by the terms and provision of this agreement. If you do not 
                agree to abide by the above, please do not use this service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Use License</h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                Permission is granted to temporarily access and use our HR Management platform for 
                authorized business purposes only. This license includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Access to employee data management features for authorized personnel</li>
                <li>Document upload and management capabilities</li>
                <li>System configuration within your organization's scope</li>
                <li>Recruitment and application processing tools</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                This license shall automatically terminate if you violate any of these restrictions 
                and may be terminated by us at any time.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Prohibited Uses</h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                You may not use our platform:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To attempt to gain unauthorized access to any portion of the platform</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">User Accounts</h2>
              <p className="text-slate-700 leading-relaxed">
                You are responsible for safeguarding your account credentials and for all activities 
                that occur under your account. You must immediately notify us of any unauthorized 
                use of your account or any other breach of security. We cannot and will not be 
                liable for any loss or damage from your failure to comply with this security obligation.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Data Responsibility</h2>
              <p className="text-slate-700 leading-relaxed">
                You are responsible for the accuracy and legality of all data you input into our 
                system. You warrant that you have the necessary rights and permissions to upload 
                and process all employee and organizational data through our platform. You agree 
                to comply with all applicable data protection and privacy laws.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Service Availability</h2>
              <p className="text-slate-700 leading-relaxed">
                While we strive for 99.9% uptime, we do not guarantee that our service will be 
                available at all times. We may experience hardware, software, or other problems 
                or need to perform maintenance that could cause interruptions, delays, or errors.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Limitation of Liability</h2>
              <p className="text-slate-700 leading-relaxed">
                In no event shall Batara Dharma Persada, nor its directors, employees, partners, 
                agents, suppliers, or affiliates, be liable for any indirect, incidental, special, 
                consequential, or punitive damages, including without limitation, loss of profits, 
                data, use, goodwill, or other intangible losses, resulting from your use of the service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Termination</h2>
              <p className="text-slate-700 leading-relaxed">
                We may terminate or suspend your account and bar access to the service immediately, 
                without prior notice or liability, under our sole discretion, for any reason 
                whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Governing Law</h2>
              <p className="text-slate-700 leading-relaxed">
                These Terms shall be interpreted and governed by the laws of the Republic of Indonesia, 
                without regard to its conflict of law provisions. Our failure to enforce any right 
                or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Changes to Terms</h2>
              <p className="text-slate-700 leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision 
                is material, we will provide at least 30 days notice prior to any new terms taking 
                effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-slate-900 mb-4">Contact Information</h2>
              <p className="text-slate-700 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us through 
                our support channels or visit our main website at 
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