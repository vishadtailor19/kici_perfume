import { useState, createContext, useContext, useEffect } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AuthPage from './pages/AuthPage';
import AdminPanel from './pages/AdminPanel';
// import './animations.css'; // Temporarily disabled

// Context for global state management
const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageTransition, setPageTransition] = useState(false);

  // Enhanced page navigation with transitions
  const navigateToPage = (page) => {
    setPageTransition(true);
    setTimeout(() => {
      setCurrentPage(page);
      setPageTransition(false);
    }, 150);
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      alert('Please login to add items to cart');
      setCurrentPage('auth');
      return;
    }

    try {
      await apiCall('/cart/add', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          product_id: product.id,
          quantity: quantity
        })
      });

      // Update local cart state
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === product.id);
        if (existingItem) {
          return prevCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevCart, { 
          ...product, 
          quantity,
          image: product.images?.[0]?.url || product.image || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
          brand: product.brand?.name || product.brand || 'Unknown',
          category: product.category?.name || product.category || 'Unknown'
        }];
      });

      // Show success message
      alert(`Added ${quantity} x ${product.name} to cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;

    try {
      // Find the cart item to get the cart item ID
      const cartItem = cart.find(item => item.id === productId);
      if (!cartItem) return;

      await apiCall(`/cart/remove/${cartItem.cartItemId || productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setCart(prevCart => prevCart.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      alert('Failed to remove item from cart. Please try again.');
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (!user) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    try {
      const cartItem = cart.find(item => item.id === productId);
      if (!cartItem) return;

      await apiCall(`/cart/update/${cartItem.cartItemId || productId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ quantity })
      });

      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
      alert('Failed to update quantity. Please try again.');
    }
  };

  // API helper function
  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`http://localhost:5000/api${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError('');

        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userData = await apiCall('/auth/me', {
              headers: { Authorization: `Bearer ${token}` }
            });
            setUser(userData.user);

            // Fetch user's cart
            try {
              const cartData = await apiCall('/cart', {
                headers: { Authorization: `Bearer ${token}` }
              });
              
              // Transform cart data to match local state structure
              const transformedCart = cartData.items?.map(item => ({
                id: item.product.id,
                cartItemId: item.id,
                name: item.product.name,
                price: parseFloat(item.product.price),
                quantity: item.quantity,
                image: item.product.images?.[0]?.url || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
                brand: item.product.brand?.name || 'Unknown',
                category: item.product.category?.name || 'Unknown',
                stock_quantity: item.product.stock_quantity
              })) || [];
              
              setCart(transformedCart);
            } catch (cartError) {
              console.error('Failed to fetch cart:', cartError);
            }
          } catch (error) {
            localStorage.removeItem('token');
          }
        }

        // Fetch products, categories, and brands in parallel
        const [productsData, categoriesData, brandsData] = await Promise.all([
          apiCall('/products?limit=50'),
          apiCall('/categories'),
          apiCall('/brands')
        ]);

        setProducts(productsData.products || []);
        setCategories(categoriesData || []);
        setBrands(brandsData || []);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        setError('Failed to load data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const contextValue = {
    currentPage,
    setCurrentPage,
    selectedProduct,
    setSelectedProduct,
    user,
    setUser,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    products,
    categories,
    brands,
    loading,
    error,
    apiCall,
    setCart,
    navigateToPage
  };

  const renderPage = () => {
    const pageClass = `transition-all duration-300 ${
      pageTransition ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
    }`;

    const PageComponent = () => {
      switch (currentPage) {
        case 'home':
          return <HomePage />;
        case 'products':
          return <ProductsPage />;
        case 'product-detail':
          return <ProductDetailPage />;
        case 'cart':
          return <CartPage />;
        case 'auth':
          return <AuthPage />;
        case 'admin':
          return <AdminPanel />;
        default:
          return <HomePage />;
      }
    };

    return (
      <div className={pageClass}>
        <PageComponent />
      </div>
    );
  };

  // Show loading screen while app initializes
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl animate-pulse">
            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Kici Perfume</h2>
          <p className="text-purple-200">Loading your fragrance experience...</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-50">
        <Layout>
          {renderPage()}
        </Layout>
      </div>
    </AppContext.Provider>
  );
}

export default App;