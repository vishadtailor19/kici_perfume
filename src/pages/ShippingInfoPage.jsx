import React from 'react';

const ShippingInfoPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
          <p className="text-lg text-gray-600">Everything you need to know about our shipping options and policies</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* Shipping Options */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Standard Shipping</h3>
                    <p className="text-sm text-gray-600">3-5 business days</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">Perfect for regular orders with no rush.</p>
                <div className="text-lg font-bold text-gray-900">
                  FREE on orders over ₹2000
                  <span className="block text-sm font-normal text-gray-600">₹99 for orders under ₹2000</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Express Shipping</h3>
                    <p className="text-sm text-gray-600">1-2 business days</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">Fast delivery for urgent orders.</p>
                <div className="text-lg font-bold text-gray-900">₹199</div>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Same Day Delivery</h3>
                    <p className="text-sm text-gray-600">Within 24 hours</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">Available in select metropolitan areas.</p>
                <div className="text-lg font-bold text-gray-900">₹299</div>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">International Shipping</h3>
                    <p className="text-sm text-gray-600">7-14 business days</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">Worldwide delivery available.</p>
                <div className="text-lg font-bold text-gray-900">₹50 COD charges</div>
              </div>
            </div>
          </section>

          {/* Processing Time */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Processing Time</h2>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Processing</h3>
                  <p className="text-gray-600">All orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed the next business day.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Shipping Zones */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Zones</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 rounded-xl">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Zone</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Countries/Regions</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Delivery Time</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">Shipping Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3 font-medium">All India</td>
                    <td className="border border-gray-200 px-4 py-3">Pan India Delivery</td>
                    <td className="border border-gray-200 px-4 py-3">1-7 business days</td>
                    <td className="border border-gray-200 px-4 py-3">Free over ₹2000</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3 font-medium">Metro Cities</td>
                    <td className="border border-gray-200 px-4 py-3">Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Pune</td>
                    <td className="border border-gray-200 px-4 py-3">1-2 business days</td>
                    <td className="border border-gray-200 px-4 py-3">₹199</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3 font-medium">Tier 1 Cities</td>
                    <td className="border border-gray-200 px-4 py-3">Ahmedabad, Kolkata, Surat, Jaipur, Lucknow, Kanpur</td>
                    <td className="border border-gray-200 px-4 py-3">2-4 business days</td>
                    <td className="border border-gray-200 px-4 py-3">₹149</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3 font-medium">Other Cities</td>
                    <td className="border border-gray-200 px-4 py-3">All other locations across India</td>
                    <td className="border border-gray-200 px-4 py-3">3-7 business days</td>
                    <td className="border border-gray-200 px-4 py-3">₹99</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Important Notes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Important Notes</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-600">All orders are carefully packaged to ensure your fragrances arrive in perfect condition.</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-600">Tracking information will be provided via email once your order ships.</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-600">International orders may be subject to customs duties and taxes.</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-600">We ship Monday through Friday, excluding holidays.</p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white text-center">
              <h2 className="text-xl font-bold mb-2">Need Help with Shipping?</h2>
              <p className="mb-4">Our customer service team is here to assist you with any shipping questions.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:shipping@kiciperfume.com" className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
                  Email Support
                </a>
                <a href="tel:+15551234567" className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
                  Call Us
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfoPage;
