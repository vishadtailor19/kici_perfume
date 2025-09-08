import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useApp } from '../App';

// Load Stripe
let stripePromise;

const CheckoutForm = ({ clientSecret, orderSummary, shippingAddress, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, apiCall } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingAddress.address_line_1,
              line2: shippingAddress.address_line_2 || null,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postal_code: shippingAddress.postal_code,
              country: 'IN'
            }
          }
        }
      });

      if (error) {
        setPaymentError(error.message);
        setIsProcessing(false);
        onError(error.message);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment with backend
        const response = await fetch('http://localhost:5000/api/payment/confirm-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            payment_intent_id: paymentIntent.id,
            shipping_address: shippingAddress,
            billing_address: shippingAddress // Using same address for billing
          })
        });

        if (response.ok) {
          const orderData = await response.json();
          onSuccess(orderData.order);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create order');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(error.message);
      onError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true // We collect this separately
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>
      
      {/* Order Summary */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal ({orderSummary.items} items)</span>
            <span>₹{orderSummary.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{orderSummary.shipping_cost === 0 ? 'Free' : `₹${orderSummary.shipping_cost.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (18%)</span>
            <span>₹{orderSummary.tax_amount.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{orderSummary.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Card Element */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-xl p-4 bg-white">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {/* Error Display */}
        {paymentError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-800 text-sm">{paymentError}</p>
          </div>
        )}

        {/* Security Notice */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-blue-800 text-sm">
              Your payment information is secure and encrypted. Powered by Stripe.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
            isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105'
          } text-white shadow-lg`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing Payment...
            </div>
          ) : (
            `Pay ₹${orderSummary.total_amount.toFixed(2)}`
          )}
        </button>
      </form>

      {/* Accepted Cards */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-2">We accept</p>
        <div className="flex justify-center space-x-4">
          <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded">Visa</div>
          <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded">Mastercard</div>
          <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded">RuPay</div>
          <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded">UPI</div>
        </div>
      </div>
    </div>
  );
};

const StripeCheckout = ({ shippingAddress, onSuccess, onError, onCancel }) => {
  const { apiCall } = useApp();
  const [clientSecret, setClientSecret] = useState('');
  const [orderSummary, setOrderSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        // Get Stripe publishable key
        const configResponse = await fetch('http://localhost:5000/api/payment/config');
        const config = await configResponse.json();
        
        // Check if Stripe is configured
        if (!configResponse.ok || config.setup_required) {
          throw new Error(config.error || 'Stripe not configured');
        }
        
        stripePromise = loadStripe(config.publishable_key);

        // Create payment intent
        const response = await fetch('http://localhost:5000/api/payment/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            shipping_address: shippingAddress,
            billing_address: shippingAddress
          })
        });

        if (response.ok) {
          const data = await response.json();
          setClientSecret(data.client_secret);
          setOrderSummary(data.order_summary);
        } else {
          const errorData = await response.json();
          
          // Handle Stripe configuration error specifically
          if (errorData.setup_required) {
            throw new Error('Payment service not configured. Please set up Stripe API keys.');
          }
          
          throw new Error(errorData.message || 'Failed to initialize payment');
        }
      } catch (error) {
        console.error('Stripe initialization error:', error);
        setError(error.message);
        onError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (shippingAddress) {
      initializeStripe();
    }
  }, [shippingAddress, onError]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
          <span className="text-gray-600">Initializing secure payment...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Initialization Failed</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onCancel}
            className="bg-gray-600 text-white px-6 py-2 rounded-xl hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        clientSecret={clientSecret}
        orderSummary={orderSummary}
        shippingAddress={shippingAddress}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default StripeCheckout;
