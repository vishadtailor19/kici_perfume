import { useState, useEffect } from 'react';
import { useApp } from '../App';
import InvoicePDF from '../components/InvoicePDF';

const UserDashboard = () => {
  const { user, setCurrentPage } = useApp();
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State for user data
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    date_of_birth: user?.date_of_birth || ''
  });
  
  // Modal states
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  
  // Address form state
  const [addressForm, setAddressForm] = useState({
    first_name: '',
    last_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    phone: '',
    is_default: false
  });

  // API helper function
  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  };

  // Fetch user orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/orders');
      setOrders(data.orders || []);
    } catch (error) {
      setError('Failed to load orders');
      console.error('Orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user addresses
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/addresses');
      setAddresses(data.addresses || []);
    } catch (error) {
      setError('Failed to load addresses');
      console.error('Addresses error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch wishlist
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/wishlist');
      setWishlist(data.wishlist || []);
    } catch (error) {
      setError('Failed to load wishlist');
      console.error('Wishlist error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Address CRUD functions
  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await apiCall('/addresses', {
        method: 'POST',
        body: JSON.stringify(addressForm)
      });
      setShowAddAddress(false);
      resetAddressForm();
      fetchAddresses();
      setError('');
    } catch (error) {
      setError('Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await apiCall(`/addresses/${selectedAddress.id}`, {
        method: 'PUT',
        body: JSON.stringify(addressForm)
      });
      setShowEditAddress(false);
      resetAddressForm();
      fetchAddresses();
      setError('');
    } catch (error) {
      setError('Failed to update address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await apiCall(`/addresses/${addressId}`, {
          method: 'DELETE'
        });
        fetchAddresses();
      } catch (error) {
        setError('Failed to delete address');
      }
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await apiCall(`/addresses/${addressId}`, {
        method: 'PUT',
        body: JSON.stringify({ is_default: true })
      });
      fetchAddresses();
    } catch (error) {
      setError('Failed to set default address');
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      first_name: '',
      last_name: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      phone: '',
      is_default: false
    });
    setSelectedAddress(null);
  };

  const openEditAddress = (address) => {
    setSelectedAddress(address);
    setAddressForm({
      first_name: address.first_name || '',
      last_name: address.last_name || '',
      address_line_1: address.address_line_1 || '',
      address_line_2: address.address_line_2 || '',
      city: address.city || '',
      state: address.state || '',
      postal_code: address.postal_code || '',
      phone: address.phone || '',
      is_default: address.is_default || false
    });
    setShowEditAddress(true);
  };

  // Load data when tab changes
  useEffect(() => {
    switch (activeTab) {
      case 'orders':
        fetchOrders();
        break;
      case 'addresses':
        fetchAddresses();
        break;
      case 'wishlist':
        fetchWishlist();
        break;
    }
  }, [activeTab]);

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await apiCall('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profile)
      });
      setEditingProfile(false);
      setError('');
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Cancel order with reason
  const handleCancelOrder = async (orderId, reason = '') => {
    const userReason = reason || prompt('Please provide a reason for cancellation (optional):') || '';
    
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await apiCall(`/orders/${orderId}/cancel`, {
        method: 'PATCH',
        body: JSON.stringify({ reason: userReason })
      });
      
      setError('');
      alert('Order cancelled successfully!');
      fetchOrders();
    } catch (error) {
      console.error('Cancel order error:', error);
      if (error.message && error.message.includes('Cannot cancel order')) {
        setError(error.message);
      } else {
        setError('Failed to cancel order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get order status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  );

  // Error component
  const ErrorMessage = ({ message }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-center">
        <div className="text-red-600 mr-3">⚠️</div>
        <p className="text-red-800 font-medium">{message}</p>
      </div>
    </div>
  );

  // Order Details Modal
  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Order Details</h2>
                <p className="text-purple-100">#{order.order_number}</p>
              </div>
              <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl font-bold">×</button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Status</h3>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status?.toUpperCase()}
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Total</h3>
                <p className="text-2xl font-bold text-purple-600">₹{order.total_amount}</p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-4">Items ({order.items?.length || 0})</h3>
              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{item.product?.name || item.product_snapshot?.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-purple-600">₹{item.total_price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{order.subtotal_amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{order.tax_amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{order.shipping_cost}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{order.total_amount}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex space-x-3">
                {(order.status === 'pending' || order.status === 'confirmed') && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    disabled={loading}
                  >
                    <span className="mr-2">❌</span>
                    {loading ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
                <button
                  onClick={() => InvoicePDF.downloadInvoice(order)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <span className="mr-2">📄</span>
                  Download Invoice
                </button>
                <button
                  onClick={() => InvoicePDF.viewInvoice(order)}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <span className="mr-2">👁️</span>
                  View Invoice
                </button>
              </div>
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Orders Tab
  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
      </div>
      
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      
      {!loading && orders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Yet</h3>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
          <button
            onClick={() => setCurrentPage('products')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      )}
      
      {!loading && orders.length > 0 && (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">#{order.order_number}</h3>
                  <p className="text-sm text-gray-600">
                    Ordered on {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </p>
                  <p className="text-sm text-gray-600">
                    Payment: {order.payment_method?.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status?.toUpperCase()}
                  </span>
                  <p className="text-lg font-bold text-purple-600 mt-2">₹{order.total_amount}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">{order.items?.length || 0} items</p>
                <div className="space-x-3">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowOrderDetails(true);
                    }}
                    className="text-purple-600 hover:text-purple-800 font-semibold"
                  >
                    View Details
                  </button>
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render Profile Tab
  // Render Addresses Tab
  const renderAddresses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
        <button
          onClick={() => setShowAddAddress(true)}
          className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
        >
          <span className="mr-2">➕</span>
          Add New Address
        </button>
      </div>
      
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      
      {!loading && addresses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Addresses Yet</h3>
          <p className="text-gray-500 mb-6">Add your first address to make checkout faster!</p>
          <button
            onClick={() => setShowAddAddress(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add Address
          </button>
        </div>
      )}
      
      {!loading && addresses.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {addresses.map((address) => (
            <div key={address.id} className={`bg-white border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${
              address.is_default ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
            }`}>
              {address.is_default && (
                <div className="flex items-center mb-3">
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    ⭐ DEFAULT
                  </span>
                </div>
              )}
              
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900">
                  {address.first_name} {address.last_name}
                </h3>
                <p className="text-gray-700">{address.address_line_1}</p>
                {address.address_line_2 && (
                  <p className="text-gray-700">{address.address_line_2}</p>
                )}
                <p className="text-gray-700">
                  {address.city}, {address.state} {address.postal_code}
                </p>
                <p className="text-gray-600">{address.country}</p>
                {address.phone && (
                  <p className="text-gray-600">📞 {address.phone}</p>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditAddress(address)}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                  >
                    ✏️ Edit
                  </button>
                  {!address.is_default && (
                    <button
                      onClick={() => handleSetDefaultAddress(address.id)}
                      className="text-purple-600 hover:text-purple-800 font-semibold text-sm"
                    >
                      ⭐ Set Default
                    </button>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="text-red-600 hover:text-red-800 font-semibold text-sm"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        <button
          onClick={() => setEditingProfile(!editingProfile)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          {editingProfile ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {editingProfile ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => {
                  const phoneValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setProfile({...profile, phone: phoneValue});
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter a valid Indian mobile number (10 digits starting with 6, 7, 8, or 9)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={profile.date_of_birth}
                onChange={(e) => setProfile({...profile, date_of_birth: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Name</h3>
              <p className="mt-1 text-lg text-gray-900">{user?.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</h3>
              <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Phone</h3>
              <p className="mt-1 text-lg text-gray-900">{user?.phone || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Member Since</h3>
              <p className="mt-1 text-lg text-gray-900">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN') : 'N/A'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
        <p className="text-gray-600 mb-8">You need to be logged in to access your dashboard.</p>
        <button
          onClick={() => setCurrentPage('auth')}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          My Dashboard
        </h1>
        <p className="text-gray-600 text-lg">Welcome back, {user.name}!</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
        <nav className="flex space-x-1 p-2">
          {[
            { id: 'orders', name: 'My Orders', icon: '📦' },
            { id: 'profile', name: 'Profile', icon: '👤' },
            { id: 'addresses', name: 'Addresses', icon: '📍' },
            { id: 'wishlist', name: 'Wishlist', icon: '❤️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2 text-lg">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'addresses' && renderAddresses()}
        {activeTab === 'wishlist' && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600">Wishlist</h3>
            <p className="text-gray-500 mt-2">Coming soon - Save your favorite products</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderDetails(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {/* Add Address Modal */}
      {showAddAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Address</h2>
            <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={addressForm.first_name}
                    onChange={(e) => setAddressForm({...addressForm, first_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={addressForm.last_name}
                    onChange={(e) => setAddressForm({...addressForm, last_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                <input
                  type="text"
                  value={addressForm.address_line_1}
                  onChange={(e) => setAddressForm({...addressForm, address_line_1: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  value={addressForm.address_line_2}
                  onChange={(e) => setAddressForm({...addressForm, address_line_2: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select State</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={addressForm.postal_code}
                    onChange={(e) => setAddressForm({...addressForm, postal_code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    pattern="[0-9]{6}"
                    maxLength="6"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    pattern="[6-9][0-9]{9}"
                    maxLength="10"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_default_add"
                  checked={addressForm.is_default}
                  onChange={(e) => setAddressForm({...addressForm, is_default: e.target.checked})}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="is_default_add" className="ml-2 block text-sm text-gray-900">
                  Set as default address
                </label>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-semibold disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Address'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddAddress(false);
                    resetAddressForm();
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Address Modal */}
      {showEditAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Address</h2>
            <form onSubmit={handleEditAddress} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={addressForm.first_name}
                    onChange={(e) => setAddressForm({...addressForm, first_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={addressForm.last_name}
                    onChange={(e) => setAddressForm({...addressForm, last_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                <input
                  type="text"
                  value={addressForm.address_line_1}
                  onChange={(e) => setAddressForm({...addressForm, address_line_1: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  value={addressForm.address_line_2}
                  onChange={(e) => setAddressForm({...addressForm, address_line_2: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select State</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="West Bengal">West Bengal</option>
                    {/* Add more states as needed */}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={addressForm.postal_code}
                    onChange={(e) => setAddressForm({...addressForm, postal_code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    pattern="[0-9]{6}"
                    maxLength="6"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    pattern="[6-9][0-9]{9}"
                    maxLength="10"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_default_edit"
                  checked={addressForm.is_default}
                  onChange={(e) => setAddressForm({...addressForm, is_default: e.target.checked})}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="is_default_edit" className="ml-2 block text-sm text-gray-900">
                  Set as default address
                </label>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-semibold disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Address'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditAddress(false);
                    resetAddressForm();
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
