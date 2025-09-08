import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                make a purchase, or contact us for support.
              </p>
              <div className="prose text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information:</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Name and contact information (email, phone, address)</li>
                  <li>Payment information (credit card details, billing address)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Purchase history and preferences</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Automatically Collected Information:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, time spent, clicks)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
              <div className="prose text-gray-600">
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Provide customer service and support</li>
                  <li>Send you order confirmations and shipping updates</li>
                  <li>Improve our products and services</li>
                  <li>Personalize your shopping experience</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Prevent fraud and ensure security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties, 
                except in the following circumstances:
              </p>
              <div className="prose text-gray-600">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Service Providers:</strong> We share information with trusted third parties who help us operate our business (payment processors, shipping companies, email services)</li>
                  <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> Information may be transferred in connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> We may share information with your explicit consent</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-semibold">Our security measures include:</p>
                <p className="text-green-800">• SSL encryption for data transmission</p>
                <p className="text-green-800">• Secure payment processing</p>
                <p className="text-green-800">• Regular security audits</p>
                <p className="text-green-800">• Limited access to personal information</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, 
                and personalize content.
              </p>
              <div className="prose text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Types of cookies we use:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                  <li><strong>Performance Cookies:</strong> Help us understand how visitors use our site</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-600 mb-4">
                You have certain rights regarding your personal information:
              </p>
              <div className="prose text-gray-600">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
                </ul>
              </div>
              <p className="text-gray-600 mt-4">
                To exercise these rights, please contact us at 
                <a href="mailto:privacy@herbytots.com" className="text-purple-600 hover:underline ml-1">privacy@herbytots.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
              <p className="text-gray-600 mb-4">
                We retain your personal information for as long as necessary to fulfill the purposes outlined 
                in this privacy policy, unless a longer retention period is required by law.
              </p>
              <p className="text-gray-600">
                When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
              <p className="text-gray-600 mb-4">
                Our services are not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13.
              </p>
              <p className="text-gray-600">
                If we become aware that we have collected personal information from a child under 13, 
                we will take steps to delete such information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">International Transfers</h2>
              <p className="text-gray-600 mb-4">
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place to protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this privacy policy from time to time. We will notify you of any material 
                changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
              <p className="text-gray-600">
                We encourage you to review this policy periodically to stay informed about how we protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this privacy policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">Privacy Officer: <a href="mailto:privacy@herbytots.com" className="text-purple-600 hover:underline">privacy@herbytots.com</a></p>
                <p className="text-gray-600">Customer Service: <a href="mailto:support@herbytots.com" className="text-purple-600 hover:underline">support@herbytots.com</a></p>
                <p className="text-gray-600">Phone: <a href="tel:+919116161630" className="text-purple-600 hover:underline">+91 91161 61630</a></p>
                <p className="text-gray-600">Address: Sahid Park Road, Opp. Nikunj Plaza, Nr. DB Jewellers, Dungarpur, Rajasthan 314001</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
