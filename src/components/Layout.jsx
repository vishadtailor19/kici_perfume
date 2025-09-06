import { useApp } from '../App';

const Layout = ({ children }) => {
  const { currentPage, setCurrentPage, user, setUser, cart } = useApp();

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => setCurrentPage('home')}
            >
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Kici Perfume
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setCurrentPage('home')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'home' 
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage('products')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'products' 
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                Products
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={() => setCurrentPage('admin')}
                  className={`text-sm font-medium transition-colors ${
                    currentPage === 'admin' 
                      ? 'text-purple-600 border-b-2 border-purple-600' 
                      : 'text-gray-700 hover:text-purple-600'
                  }`}
                >
                  Admin Panel
                </button>
              )}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <button
                onClick={() => setCurrentPage('cart')}
                className="relative p-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* User menu */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Hello, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCurrentPage('auth')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden border-t bg-white">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex space-x-6">
              <button
                onClick={() => setCurrentPage('home')}
                className={`text-sm font-medium ${
                  currentPage === 'home' ? 'text-purple-600' : 'text-gray-700'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage('products')}
                className={`text-sm font-medium ${
                  currentPage === 'products' ? 'text-purple-600' : 'text-gray-700'
                }`}
              >
                Products
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={() => setCurrentPage('admin')}
                  className={`text-sm font-medium ${
                    currentPage === 'admin' ? 'text-purple-600' : 'text-gray-700'
                  }`}
                >
                  Admin
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Kici Perfume</h3>
              <p className="text-gray-400 text-sm">
                Premium fragrances for every occasion. Discover your signature scent.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Floral</li>
                <li>Fresh</li>
                <li>Oriental</li>
                <li>Citrus</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Contact Us</li>
                <li>Shipping Info</li>
                <li>Returns</li>
                <li>Size Guide</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Newsletter</li>
                <li>Instagram</li>
                <li>Facebook</li>
                <li>Twitter</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Kici Perfume. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;