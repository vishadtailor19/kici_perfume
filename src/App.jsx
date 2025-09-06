import { useState, createContext, useContext } from 'react';
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
  const [products] = useState([
    {
      id: 1,
      name: "Midnight Rose",
      brand: "Kici",
      category: "Floral",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
      description: "A captivating blend of midnight roses with hints of vanilla and musk.",
      stock: 15
    },
    {
      id: 2,
      name: "Ocean Breeze",
      brand: "Kici",
      category: "Fresh",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop",
      description: "Fresh oceanic notes with citrus and marine accords.",
      stock: 22
    },
    {
      id: 3,
      name: "Golden Amber",
      brand: "Kici",
      category: "Oriental",
      price: 99.99,
      image: "/images/Amber.jpg",
      description: "Rich amber with warm spices and exotic woods.",
      stock: 8
    },
    {
      id: 4,
      name: "Citrus Burst",
      brand: "Kici",
      category: "Citrus",
      price: 69.99,
      image: "/images/citrusenergizingcitrus.jpg",
      description: "Energizing citrus blend with bergamot and lemon zest.",
      stock: 30
    }
  ]);

  const addToCart = (product, quantity = 1) => {
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
    products
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