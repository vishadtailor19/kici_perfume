import { useState, createContext, useContext, useEffect } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AuthPage from './pages/AuthPage';
import AdminPanel from './pages/AdminPanel';

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

  // Simple add to cart function
  const addToCart = (product, quantity = 1) => {
    if (!user) {
      alert('Please login to add items to cart');
      setCurrentPage('auth');
      return;
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
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
          } catch (error) {
            localStorage.removeItem('token');
          }
        }

        // Fetch products, categories, and brands
        try {
          const [productsData, categoriesData, brandsData] = await Promise.all([
            apiCall('/products?limit=50'),
            apiCall('/categories'),
            apiCall('/brands')
          ]);

          setProducts(productsData.products || []);
          setCategories(categoriesData || []);
          setBrands(brandsData || []);
        } catch (error) {
          console.error('Failed to fetch data:', error);
          // Set some default data to prevent blank page
          setProducts([]);
          setCategories([]);
          setBrands([]);
        }
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
    setCart
  };

  const renderPage = () => {
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
