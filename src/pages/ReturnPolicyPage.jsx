import React from 'react';

const ReturnPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Return Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15-Day Return Policy</h2>
              <p className="text-gray-600 mb-4">
                We want you to be completely satisfied with your purchase. If you're not happy with your order, 
                you may return it within 15 days of delivery for a full refund or exchange.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-semibold">✓ 15-day return window</p>
                <p className="text-green-800 font-semibold">✓ Full refund or exchange</p>
                <p className="text-green-800 font-semibold">✓ Free return shipping on defective items</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Conditions</h2>
              <div className="prose text-gray-600">
                <p className="mb-4">To be eligible for a return, items must meet the following conditions:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Items must be unopened and in original packaging</li>
                  <li>Items must be in the same condition as received</li>
                  <li>Original receipt or proof of purchase required</li>
                  <li>Items must be returned within 15 days of delivery</li>
                  <li>Custom or personalized items cannot be returned</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Return an Item</h2>
              <div className="prose text-gray-600">
                <p className="mb-4">Follow these simple steps to return your item:</p>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>Contact Us:</strong> Email us at 
                    <a href="mailto:returns@kiciperfume.com" className="text-purple-600 hover:underline ml-1">returns@kiciperfume.com</a> 
                    with your order number and reason for return
                  </li>
                  <li><strong>Receive Return Authorization:</strong> We'll provide you with a return authorization number and shipping label</li>
                  <li><strong>Package Your Item:</strong> Securely package the item in its original packaging</li>
                  <li><strong>Ship the Item:</strong> Use the provided shipping label to send the item back to us</li>
                  <li><strong>Receive Your Refund:</strong> Once we receive and inspect your return, we'll process your refund</li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Processing</h2>
              <p className="text-gray-600 mb-4">
                Once your return is received and inspected, we will send you an email to notify you that we have 
                received your returned item. We will also notify you of the approval or rejection of your refund.
              </p>
              <p className="text-gray-600 mb-4">
                If your refund is approved, it will be processed and a credit will automatically be applied to 
                your original method of payment within 5-7 business days.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800"><strong>Refund Timeline:</strong></p>
                <p className="text-blue-800">• Credit/Debit cards: 5-7 business days</p>
                <p className="text-blue-800">• UPI/Net Banking: 3-5 business days</p>
                <p className="text-blue-800">• Bank transfers: 7-10 business days</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Exchanges</h2>
              <p className="text-gray-600 mb-4">
                We only replace items if they are defective or damaged. If you need to exchange an item for the 
                same product, send us an email at 
                <a href="mailto:returns@kiciperfume.com" className="text-purple-600 hover:underline">returns@kiciperfume.com</a>.
              </p>
              <p className="text-gray-600">
                For size or fragrance exchanges, we recommend processing a return for a refund and placing a new order.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Damaged or Defective Items</h2>
              <p className="text-gray-600 mb-4">
                If you received a damaged or defective item, please contact us immediately at 
                <a href="mailto:support@kiciperfume.com" className="text-purple-600 hover:underline ml-1">support@kiciperfume.com</a> 
                with photos of the damaged item.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold">For damaged/defective items:</p>
                <p className="text-red-800">• Free return shipping</p>
                <p className="text-red-800">• Immediate replacement or full refund</p>
                <p className="text-red-800">• Priority processing</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Non-Returnable Items</h2>
              <div className="prose text-gray-600">
                <p className="mb-4">The following items cannot be returned:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Opened or used fragrance bottles</li>
                  <li>Custom or personalized items</li>
                  <li>Gift cards</li>
                  <li>Items damaged by misuse</li>
                  <li>Items returned after 30 days</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Shipping</h2>
              <p className="text-gray-600 mb-4">
                You will be responsible for paying for your own shipping costs for returning your item, unless 
                the item was damaged or defective. Shipping costs are non-refundable.
              </p>
              <p className="text-gray-600">
                We recommend using a trackable shipping service or purchasing shipping insurance for items over ₹3000.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about our return policy, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">Returns Email: <a href="mailto:returns@herbytots.com" className="text-purple-600 hover:underline">returns@herbytots.com</a></p>
                <p className="text-gray-600">Customer Service: <a href="mailto:support@herbytots.com" className="text-purple-600 hover:underline">support@herbytots.com</a></p>
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

export default ReturnPolicyPage;
