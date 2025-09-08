import { useState } from 'react';
import { useApp } from '../App';
import StripeCheckout from '../components/StripeCheckout';

const CartPage = () => {
  const { cart, removeFromCart, updateCartQuantity, setCurrentPage, user, apiCall, clearCart } = useApp();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    full_name: user?.name || '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    phone: user?.phone || ''
  });

  // Indian States List
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  // Mobile number validation
  const validateMobileNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 99;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (productId, newQuantity) => {
    updateCartQuantity(productId, newQuantity);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    if (!user) {
      alert('Please login to checkout');
      setCurrentPage('auth');
      return;
    }

    // Check if address is filled
    if (!shippingAddress.full_name || !shippingAddress.address_line_1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postal_code) {
      setShowAddressForm(true);
      return;
    }

    // Show payment method selection
    setShowPaymentMethod(true);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    
    // Validate mobile number
    if (!validateMobileNumber(shippingAddress.phone)) {
      alert('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9');
      return;
    }

    // Validate PIN code (6 digits)
    if (!/^\d{6}$/.test(shippingAddress.postal_code)) {
      alert('Please enter a valid 6-digit PIN code');
      return;
    }

    setShowAddressForm(false);
    setShowPaymentMethod(true);
  };

  const handlePaymentSuccess = (order) => {
    setOrderSuccess(order);
    clearCart();
    setShowStripeCheckout(false);
    setShowAddressForm(false);
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    alert(`Payment failed: ${error}`);
  };

  const handlePaymentCancel = () => {
    setShowStripeCheckout(false);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setShowPaymentMethod(false);
    
    if (method === 'stripe') {
      setShowStripeCheckout(true);
    } else if (method === 'cash_on_delivery') {
      handleCashOnDeliveryOrder();
    }
  };

  const handleCashOnDeliveryOrder = async () => {
    try {
      setIsCheckingOut(true);
      
      console.log('Creating COD order with address:', shippingAddress);
      
      // Create address first - send full_name which backend will split
      const addressData = {
        ...shippingAddress,
        full_name: shippingAddress.full_name // Backend will handle splitting this
      };
      
      console.log('Sending address data:', addressData);
      
      const addressResponse = await apiCall('/addresses', {
        method: 'POST',
        body: JSON.stringify(addressData)
      });

      console.log('Address created:', addressResponse);

      // Create order with cash on delivery
      const orderData = {
        payment_method: 'cash_on_delivery',
        shipping_address_id: addressResponse.address.id,
        billing_address_id: addressResponse.address.id,
        notes: 'Cash on Delivery order'
      };

      console.log('Creating order with data:', orderData);

      const orderResponse = await apiCall('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });

      console.log('Order created:', orderResponse);
      handlePaymentSuccess(orderResponse.order);
    } catch (error) {
      console.error('Cash on delivery order error:', error);
      console.error('Error details:', error.message);
      
      // More specific error messages based on HTTP status
      if (error.message.includes('401')) {
        alert('Please log in again to place your order.');
        setCurrentPage('auth');
      } else if (error.message.includes('400')) {
        alert('Please check your address details and try again.');
      } else if (error.message.includes('500')) {
        alert('Server error. Please try again in a moment.');
      } else if (error.message.includes('address')) {
        alert('Failed to save address. Please check your address details and try again.');
      } else if (error.message.includes('order')) {
        alert('Failed to create order. Please try again.');
      } else {
        alert(`Failed to place order: ${error.message}`);
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Order success screen
  if (orderSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Order Number:</span>
                <p className="font-semibold">{orderSuccess.order_number}</p>
              </div>
              <div>
                <span className="text-gray-600">Total Amount:</span>
                <p className="font-semibold">₹{orderSuccess.total_amount}</p>
              </div>
              <div>
                <span className="text-gray-600">Payment Status:</span>
                <p className="font-semibold text-green-600 capitalize">{orderSuccess.payment_status}</p>
              </div>
              <div>
                <span className="text-gray-600">Order Status:</span>
                <p className="font-semibold text-blue-600 capitalize">{orderSuccess.status}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setCurrentPage('home')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Stripe checkout screen
  if (showStripeCheckout) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={handlePaymentCancel}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Cart
          </button>
        </div>
        <StripeCheckout
          shippingAddress={shippingAddress}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onCancel={handlePaymentCancel}
        />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-gray-400 mb-6">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Discover our amazing fragrances and add them to your cart</p>
          <button
            onClick={() => setCurrentPage('products')}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Shopping Cart
        </h1>
        <p className="text-gray-600">Review your items and proceed to checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {cart.map((item) => (
              <div key={item.id} className="p-6 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex-shrink-0 shadow-md">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop'}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.brand} • {item.category}
                    </p>
                    <p className="text-lg font-bold text-purple-600">
                      Rs.{item.price}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white flex items-center justify-center hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold w-8 text-center bg-purple-50 rounded-lg py-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= (item.stock_quantity || item.stock || 99)}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white flex items-center justify-center hover:from-purple-600 hover:to-purple-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all mt-1 px-3 py-1 rounded-full font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="mt-6">
            <button
              onClick={() => setCurrentPage('products')}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg border border-purple-100 p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({cart.length} items)</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">GST (18%)</span>
                <span className="font-medium">₹{tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-purple-600">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Notice */}
            {subtotal < 2000 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-yellow-800">
                  Add ₹{(2000 - subtotal).toFixed(2)} more for free shipping!
                </p>
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all mb-4 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center shadow-lg transform hover:scale-105"
            >
              {isCheckingOut ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Proceed to Checkout'
              )}
            </button>

            {/* Payment Methods */}
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">We accept</p>
              <div className="flex justify-center space-x-2">
                <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  VISA
                </div>
                <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  MC
                </div>
                <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
                  AMEX
                </div>
                <div className="w-8 h-5 bg-yellow-500 rounded text-white text-xs flex items-center justify-center font-bold">
                  PP
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure checkout guaranteed
            </div>
          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
              <button
                type="button"
                onClick={() => setShowAddressForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddressSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.full_name}
                    onChange={(e) => setShippingAddress({...shippingAddress, full_name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.address_line_1}
                    onChange={(e) => setShippingAddress({...shippingAddress, address_line_1: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="House/Flat No., Building, Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address_line_2}
                    onChange={(e) => setShippingAddress({...shippingAddress, address_line_2: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Area, Landmark (Optional)"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    >
                      <option value="">Select State</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength="6"
                      pattern="\d{6}"
                      value={shippingAddress.postal_code}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setShippingAddress({...shippingAddress, postal_code: value});
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="6-digit PIN"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength="10"
                      pattern="[6-9]\d{9}"
                      value={shippingAddress.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setShippingAddress({...shippingAddress, phone: value});
                      }}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${
                        shippingAddress.phone && !validateMobileNumber(shippingAddress.phone)
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-purple-500'
                      }`}
                      placeholder="10-digit mobile"
                    />
                    {shippingAddress.phone && !validateMobileNumber(shippingAddress.phone) && (
                      <p className="text-red-500 text-xs mt-1">
                        Enter valid 10-digit number starting with 6, 7, 8, or 9
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Method Selection Modal */}
      {showPaymentMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose Payment Method</h2>
            
            <div className="space-y-4">
              {/* Cash on Delivery */}
              <button
                onClick={() => handlePaymentMethodSelect('cash_on_delivery')}
                disabled={isCheckingOut}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">💵</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Cash on Delivery</h3>
                    <p className="text-sm text-gray-600">Pay when your order arrives</p>
                    <p className="text-xs text-green-600 font-medium">✓ No online payment required</p>
                    {isCheckingOut && (
                      <p className="text-xs text-blue-600 font-medium mt-1">Processing order...</p>
                    )}
                  </div>
                </div>
              </button>

              {/* Credit/Debit Card */}
              <button
                onClick={() => handlePaymentMethodSelect('stripe')}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-left"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">💳</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Credit/Debit Card</h3>
                    <p className="text-sm text-gray-600">Secure online payment</p>
                    <p className="text-xs text-blue-600 font-medium">✓ Instant confirmation</p>
                  </div>
                </div>
              </button>

              {/* UPI */}
              <button
                onClick={() => handlePaymentMethodSelect('stripe')}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-left"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">UPI Payment</h3>
                    <p className="text-sm text-gray-600">Pay using UPI apps</p>
                    <p className="text-xs text-orange-600 font-medium">✓ Quick & secure</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-6 pt-4 border-t">
              <button
                onClick={() => setShowPaymentMethod(false)}
                className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;