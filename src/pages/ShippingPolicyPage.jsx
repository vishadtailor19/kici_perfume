import React from 'react';

const ShippingPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Shipping Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Methods & Timeframes</h2>
              <div className="prose text-gray-600">
                <p className="mb-4">We offer several shipping options to meet your needs:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Standard Shipping (3-5 business days):</strong> FREE on orders over 500, Rs.9.99 for orders under 500</li>
                  <li><strong>Express Shipping (1-2 business days):</strong> Rs.19.99</li>
                  <li><strong>Same Day Delivery:</strong> Rs.29.99 (available in select metropolitan areas)</li>    
                  <li><strong>International Shipping (7-14 business days):</strong> Starting at Rs.24.99</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Time</h2>
              <p className="text-gray-600 mb-4">
                All orders are processed within 1-2 business days (Monday through Friday, excluding holidays). 
                Orders placed on weekends or holidays will be processed the next business day.
              </p>
              <p className="text-gray-600">
                You will receive an email confirmation with tracking information once your order has shipped.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Restrictions</h2>
              <div className="prose text-gray-600">
                <p className="mb-4">Please note the following shipping restrictions:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We currently ship to all 50 US states and internationally to most countries</li>
                  <li>Some remote areas may have extended delivery times</li>
                  <li>Certain products may have shipping restrictions due to local regulations</li>
                  <li>International orders may be subject to customs duties and taxes</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Packaging & Handling</h2>
              <p className="text-gray-600 mb-4">
                All fragrances are carefully packaged in protective materials to ensure they arrive in perfect condition. 
                We use eco-friendly packaging materials whenever possible.
              </p>
              <p className="text-gray-600">
                Each order includes a complimentary gift box and tissue paper, making it perfect for gifting.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Issues</h2>
              <div className="prose text-gray-600">
                <p className="mb-4">If you experience any delivery issues:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Check the tracking information provided in your shipping confirmation email</li>
                  <li>Contact the shipping carrier directly for delivery updates</li>
                  <li>If your package is lost or damaged, contact our customer service team immediately</li>
                  <li>We will work with you to resolve any shipping issues promptly</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Address Changes</h2>
              <p className="text-gray-600 mb-4">
                If you need to change your shipping address, please contact us immediately at 
                <a href="mailto:shipping@kiciperfume.com" className="text-purple-600 hover:underline ml-1">shipping@kiciperfume.com</a>.
              </p>
              <p className="text-gray-600">
                Address changes can only be made before your order has been processed and shipped.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600 mb-4">
                For any shipping-related questions or concerns, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">Email: <a href="mailto:shipping@kiciperfume.com" className="text-purple-600 hover:underline">shipping@kiciperfume.com</a></p>
                <p className="text-gray-600">Phone: <a href="tel:+919876543210" className="text-purple-600 hover:underline">+91 98765 43210</a></p>
                <p className="text-gray-600">Hours: Monday - Saturday, 10:00 AM - 8:00 PM IST</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;
