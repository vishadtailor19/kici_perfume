import { useState, useEffect } from 'react';
import { useApp } from '../App';
import InvoicePDF from '../components/InvoicePDF';

const AdminPanel = () => {
  const { user, setCurrentPage } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State for dynamic data
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  
  // UI state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand_id: 1,
    category_id: 1,
    price: '',
    description: '',
    stock_quantity: '',
    concentration: 'Eau de Parfum',
    size: '50ml',
    sku: '',
    image_url: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/admin/dashboard');
      setDashboardData(data);
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const data = await apiCall(`/admin/users?page=${page}&limit=10&search=${search}`);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      setError('Failed to load users');
      console.error('Users error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products
  const fetchProducts = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const data = await apiCall(`/admin/products?page=${page}&limit=10&search=${search}`);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      setError('Failed to load products');
      console.error('Products error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders
  const fetchOrders = async (page = 1, status = '') => {
    try {
      setLoading(true);
      const data = await apiCall(`/admin/orders?page=${page}&limit=10&status=${status}`);
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (error) {
      setError('Failed to load orders');
      console.error('Orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      setContactsLoading(true);
      const data = await apiCall('/contact');
      setContacts(data.contacts || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Failed to fetch contacts');
    } finally {
      setContactsLoading(false);
    }
  };

  // Load data when tab changes
  useEffect(() => {
    switch (activeTab) {
      case 'dashboard':
        fetchDashboardData();
        break;
      case 'users':
        fetchUsers(currentPageNum, searchTerm);
        break;
      case 'products':
        fetchProducts(currentPageNum, searchTerm);
        break;
      case 'orders':
        fetchOrders(currentPageNum);
        break;
      case 'contacts':
        fetchContacts();
        break;
    }
    }, [activeTab, currentPageNum, searchTerm]);

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-8">You need admin privileges to access this page.</p>
        <button
          onClick={() => setCurrentPage('home')}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Update user
  const handleUpdateUser = async (userId, userData) => {
    try {
      await apiCall(`/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
      setEditingUser(null);
      fetchUsers(currentPageNum, searchTerm);
    } catch (error) {
      setError('Failed to update user');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiCall(`/admin/users/${userId}`, {
          method: 'DELETE'
        });
        fetchUsers(currentPageNum, searchTerm);
      } catch (error) {
        setError('Failed to delete user');
      }
    }
  };

  // Update product
  const handleUpdateProduct = async (productId, productData) => {
    try {
      await apiCall(`/admin/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      });
      fetchProducts(currentPageNum, searchTerm);
    } catch (error) {
      setError('Failed to update product');
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiCall(`/admin/products/${productId}`, {
          method: 'DELETE'
        });
        fetchProducts(currentPageNum, searchTerm);
      } catch (error) {
        setError('Failed to delete product');
      }
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await apiCall(`/admin/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      fetchOrders(currentPageNum);
      // Update selected order if it's currently being viewed
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({...selectedOrder, status});
      }
    } catch (error) {
      setError('Failed to update order status');
    }
  };

  // View order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await apiCall(`/admin/orders/${orderId}`, {
          method: 'DELETE'
        });
        fetchOrders(currentPageNum);
        if (selectedOrder && selectedOrder.id === orderId) {
          setShowOrderDetails(false);
          setSelectedOrder(null);
        }
      } catch (error) {
        setError('Failed to delete order');
      }
    }
  };

  // Add product
  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Upload image
  const uploadImage = async () => {
    if (!selectedImage) return null;
    
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/upload/product-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
      return result.imageUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      // Upload image first if selected
      let imageUrl = newProduct.image_url;
      if (selectedImage) {
        imageUrl = await uploadImage();
      }
      
      await apiCall('/admin/products', {
        method: 'POST',
        body: JSON.stringify({
          ...newProduct,
          image_url: imageUrl,
          sku: `KICI-${Date.now()}` // Generate unique SKU
        })
      });
      
      setShowAddProduct(false);
      setNewProduct({
        name: '',
        brand_id: 1,
        category_id: 1,
        price: '',
        description: '',
        stock_quantity: '',
        concentration: 'Eau de Parfum',
        size: '50ml',
        sku: '',
        image_url: ''
      });
      setSelectedImage(null);
      setImagePreview(null);
      fetchProducts(currentPageNum, searchTerm);
    } catch (error) {
      console.error('Add product error:', error);
      setError('Failed to add product: ' + error.message);
    } finally {
      setLoading(false);
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
  const ErrorMessage = ({ message, onRetry }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-center">
        <div className="text-red-600 mr-3">⚠️</div>
        <div>
          <p className="text-red-800 font-medium">{message}</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="text-red-600 hover:text-red-800 text-sm mt-1 underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Pagination component
  const Pagination = ({ pagination, onPageChange }) => {
    if (!pagination || pagination.totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t">
        <div className="text-sm text-gray-700">
          Showing page {pagination.currentPage} of {pagination.totalPages}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={fetchDashboardData} />}
      
      {dashboardData && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Products</p>
                  <p className="text-3xl font-bold">{dashboardData.stats.totalProducts}</p>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold">{dashboardData.stats.totalUsers}</p>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Orders</p>
                  <p className="text-3xl font-bold">{dashboardData.stats.totalOrders}</p>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Revenue</p>
                  <p className="text-3xl font-bold">Rs.{dashboardData.stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Low Stock Alert */}
            {dashboardData.analytics?.lowStockProducts?.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-red-200">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-red-600">⚠️ Low Stock Alert</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {dashboardData.analytics.lowStockProducts.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">₹{product.price}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">
                            {product.stock_quantity} left
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Top Selling Products */}
            <div className="bg-white rounded-xl shadow-lg border border-green-200">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-green-600">🏆 Top Selling Products</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {dashboardData.analytics?.topSellingProducts?.map((product, index) => (
                    <div key={product.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-green-600 text-white text-xs font-bold rounded-full flex items-center justify-center mr-3">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">₹{product.price}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">
                          {product.sales_count} sold
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods & Order Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">💳 Payment Methods (Last 30 Days)</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {dashboardData.analytics?.paymentMethodStats?.map((method) => (
                    <div key={method.payment_method} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900 capitalize">
                          {method.payment_method.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-gray-600">{method.count} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">₹{parseFloat(method.total_amount || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">📊 Order Status Overview</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {dashboardData.analytics?.ordersByStatus?.map((status) => (
                    <div key={status.status} className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900 capitalize">{status.status}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex px-3 py-1 text-sm font-bold rounded-full bg-purple-100 text-purple-800">
                          {status.count} orders
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dashboardData.recentOrders?.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">#{order.order_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.user?.name}</div>
                        <div className="text-xs text-gray-500">{order.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        Rs.{order.total_amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Product Management</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={() => setShowAddProduct(true)}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Add New Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Stock Quantity"
                  value={newProduct.stock_quantity}
                  onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={newProduct.concentration}
                  onChange={(e) => setNewProduct({...newProduct, concentration: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Eau de Parfum">Eau de Parfum</option>
                  <option value="Eau de Toilette">Eau de Toilette</option>
                  <option value="Eau de Cologne">Eau de Cologne</option>
                  <option value="Parfum">Parfum</option>
                </select>
                <input
                  type="text"
                  placeholder="Size (e.g., 50ml)"
                  value={newProduct.size}
                  onChange={(e) => setNewProduct({...newProduct, size: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <textarea
                placeholder="Product Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
                required
              />
              {/* Image Upload Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Product Image</label>
                
                {/* File Input */}
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border border-gray-300 transition-colors">
                    <span className="text-sm text-gray-700">Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                  {selectedImage && (
                    <span className="text-sm text-green-600">✓ {selectedImage.name}</span>
                  )}
                </div>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}
                
                {/* Alternative URL Input */}
                <div className="text-center text-sm text-gray-500">or</div>
                <input
                  type="url"
                  placeholder="Or enter image URL"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={uploadingImage || loading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingImage ? 'Uploading Image...' : loading ? 'Adding Product...' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={() => fetchProducts(currentPageNum, searchTerm)} />}
      
      {!loading && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                        {product.image_url ? (
                          <img
                            src={`http://localhost:5000${product.image_url}`}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`h-full w-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center ${product.image_url ? 'hidden' : 'flex'}`}
                        >
                          <span className="text-purple-600 font-bold text-lg">
                            {product.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.brand?.name || 'Unknown Brand'}</div>
                        <div className="text-xs text-gray-400">SKU: {product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    Rs.{product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                      product.stock_quantity > 10 ? 'bg-green-100 text-green-800' :
                      product.stock_quantity > 0 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stock_quantity} units
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => {
                        const newPrice = prompt('Enter new price:', product.price);
                        if (newPrice && !isNaN(newPrice)) {
                          handleUpdateProduct(product.id, { price: parseFloat(newPrice) });
                        }
                      }}
                      className="text-purple-600 hover:text-purple-900 mr-3 font-semibold"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-900 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination 
            pagination={pagination} 
            onPageChange={(page) => {
              setCurrentPageNum(page);
              fetchProducts(page, searchTerm);
            }} 
          />
        </div>
      )}
    </div>
  );

  // Order Details Modal Component
  const OrderDetailsModal = ({ order, onClose, onStatusUpdate, onDelete }) => {
    if (!order) return null;

    const getStatusColor = (status) => {
      switch (status) {
        case 'delivered': return 'bg-green-100 text-green-800 border-green-300';
        case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-300';
        case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'confirmed': return 'bg-purple-100 text-purple-800 border-purple-300';
        case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
        default: return 'bg-gray-100 text-gray-800 border-gray-300';
      }
    };

    const getPaymentStatusColor = (status) => {
      switch (status) {
        case 'paid': return 'bg-green-100 text-green-800';
        case 'failed': return 'bg-red-100 text-red-800';
        case 'refunded': return 'bg-orange-100 text-orange-800';
        default: return 'bg-yellow-100 text-yellow-800';
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Order Details</h2>
                <p className="text-purple-100">#{order.order_number}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Order Status</h3>
                <select
                  value={order.status}
                  onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg font-semibold ${getStatusColor(order.status)}`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Payment Status</h3>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                  {order.payment_status?.toUpperCase()}
                </span>
                <p className="text-sm text-gray-600 mt-1">Method: {order.payment_method}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Order Total</h3>
                <p className="text-2xl font-bold text-purple-600">₹{order.total_amount}</p>
                <p className="text-sm text-gray-600">
                  {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN') : 'N/A'}
                </p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{order.user?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{order.user?.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-4">Order Items ({order.items?.length || 0})</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Details</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Qty</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Unit Price</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items?.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="font-semibold text-gray-900">
                            {item.product?.name || item.product_snapshot?.name || 'Unknown Product'}
                          </div>
                          <div className="text-sm text-gray-500">
                            SKU: {item.product_snapshot?.sku || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-600">
                            {item.product_snapshot?.concentration && (
                              <div>Type: {item.product_snapshot.concentration}</div>
                            )}
                            {item.product_snapshot?.size && (
                              <div>Size: {item.product_snapshot.size}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-semibold">
                          ₹{item.unit_price}
                        </td>
                        <td className="px-4 py-4 font-bold text-purple-600">
                          ₹{item.total_price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary Breakdown */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{order.subtotal_amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="font-semibold">₹{order.tax_amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-semibold">₹{order.shipping_cost}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span className="font-semibold">-₹{order.discount_amount}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-lg font-bold text-purple-600">
                  <span>Total:</span>
                  <span>₹{order.total_amount}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Order Notes</h3>
                <p className="text-gray-600">{order.notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 border-t">
              <div className="flex space-x-3">
                <button
                  onClick={() => InvoicePDF.downloadInvoice(order)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center"
                >
                  <span className="mr-2">📄</span>
                  Download Invoice
                </button>
                <button
                  onClick={() => InvoicePDF.viewInvoice(order)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center"
                >
                  <span className="mr-2">👁️</span>
                  View Invoice
                </button>
                <button
                  onClick={() => onDelete(order.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Delete Order
                </button>
              </div>
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
        <div className="flex space-x-4">
          <select
            onChange={(e) => fetchOrders(1, e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={() => fetchOrders(currentPageNum)} />}
      
      {!loading && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">#{order.order_number}</div>
                    <div className="text-xs text-gray-500">{order.items?.length || 0} items</div>
                    {order.items && order.items.length > 0 && (
                      <div className="text-xs text-blue-600 mt-1">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <div key={idx}>
                            {item.product?.name || item.product_snapshot?.name || 'Product'} (×{item.quantity})
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-gray-400">+{order.items.length - 2} more...</div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.user?.name}</div>
                    <div className="text-xs text-gray-500">{order.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    ₹{order.total_amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select 
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className={`text-sm border rounded-lg px-3 py-1 font-semibold ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-300' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                        'bg-gray-100 text-gray-800 border-gray-300'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleViewOrder(order)}
                      className="text-purple-600 hover:text-purple-900 mr-3 font-semibold"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleDeleteOrder(order.id)}
                      className="text-red-600 hover:text-red-900 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination 
            pagination={pagination} 
            onPageChange={(page) => {
              setCurrentPageNum(page);
              fetchOrders(page);
            }} 
          />
        </div>
      )}
    </div>
  );

  const renderContacts = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
        <div className="text-sm text-gray-600">
          Total: {contacts.length} messages
        </div>
      </div>

      {contactsLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}

      {!contactsLoading && contacts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No contact messages found.
        </div>
      )}

      {!contactsLoading && contacts.length > 0 && (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{contact.subject}</h3>
                  <p className="text-sm text-gray-600">
                    From: <span className="font-medium">{contact.name}</span> ({contact.email})
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(contact.created_at).toLocaleString('en-IN', { 
                      timeZone: 'Asia/Kolkata',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })} IST
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    contact.status === 'new' ? 'bg-red-100 text-red-800' :
                    contact.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    contact.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {contact.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded p-3 mb-3">
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{contact.message}</p>
              </div>
              <div className="flex justify-between items-center">
                <a 
                  href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                  Reply via Email
                </a>
                <div className="text-xs text-gray-500">
                  ID: #{contact.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
      
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={() => fetchUsers(currentPageNum, searchTerm)} />}
      
      {!loading && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Role & Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">ID: {user.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                    {!user.is_active && (
                      <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => setEditingUser(user)}
                      className="text-purple-600 hover:text-purple-900 mr-3 font-semibold"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleUpdateUser(user.id, { is_active: !user.is_active })}
                      className={`font-semibold mr-3 ${
                        user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {user.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination 
            pagination={pagination} 
            onPageChange={(page) => {
              setCurrentPageNum(page);
              fetchUsers(page, searchTerm);
            }} 
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-lg">Manage your Kici Perfume e-commerce platform</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Welcome back,</p>
            <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
        <nav className="flex space-x-1 p-2">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: '📊' },
            { id: 'products', name: 'Products', icon: '🛍️' },
            { id: 'orders', name: 'Orders', icon: '📦' },
            { id: 'users', name: 'Users', icon: '👥' },
            { id: 'contacts', name: 'Contact Messages', icon: '📧' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPageNum(1);
                setSearchTerm('');
                setError('');
              }}
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
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'contacts' && renderContacts()}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderDetails(false);
            setSelectedOrder(null);
          }}
          onStatusUpdate={handleUpdateOrderStatus}
          onDelete={handleDeleteOrder}
        />
      )}
    </div>
  );
};

export default AdminPanel;