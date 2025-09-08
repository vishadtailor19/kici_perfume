import { useApp } from '../App';

const Layout = ({ children }) => {
  const { currentPage, setCurrentPage, user, setUser, cart } = useApp();

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer group"
              onClick={() => setCurrentPage('home')}
            >
            <img 
              src="/kici.jpeg" 
              alt="Kici Perfume Logo" 
              className="w-12 h-12 mr-3 group-hover:scale-110 transition-transform duration-300 rounded-lg"
            />
            <div className="flex flex-col">
              <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent group-hover:from-yellow-700 group-hover:to-yellow-500 transition-all duration-300">
                Kici
              </div>
              <div className="text-xs text-gray-600 -mt-1">A perfume studio</div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-2">
              <button
                onClick={() => setCurrentPage('home')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  currentPage === 'home' 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-yellow-50 hover:text-yellow-600'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage('for-her')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  currentPage === 'for-her' 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-yellow-50 hover:text-yellow-600'
                }`}
              >
                For Her
              </button>
              <button
                onClick={() => setCurrentPage('for-him')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  currentPage === 'for-him' 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-yellow-50 hover:text-yellow-600'
                }`}
              >
                For Him
              </button>
              <button
                onClick={() => setCurrentPage('products')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  currentPage === 'products' 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-yellow-50 hover:text-yellow-600'
                }`}
              >
                All Products
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={() => setCurrentPage('admin')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                    currentPage === 'admin' 
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-yellow-50 hover:text-yellow-600'
                  }`}
                >
                  Admin Panel
                </button>
              )}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Cart - Only show if user is logged in */}
              {user && (
              <button
                onClick={() => setCurrentPage('cart')}
                  className="relative p-3 text-gray-700 hover:text-yellow-600 transition-all duration-300 hover:bg-yellow-50 rounded-xl transform hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
                </svg>
                {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold animate-pulse shadow-lg">
                    {cartItemCount}
                  </span>
                )}
              </button>
              )}

              {/* User menu */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setCurrentPage('dashboard')}
                    className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-xl hover:bg-purple-100 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">{user.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Hello, {user.name}</span>
                  </button>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => setCurrentPage('admin')}
                      className="text-sm bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-2 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105"
                    >
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-red-600 transition-all duration-300 px-3 py-2 rounded-xl hover:bg-red-50 transform hover:scale-105"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCurrentPage('auth')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden border-t bg-white/95 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex space-x-2 justify-center">
              <button
                onClick={() => setCurrentPage('home')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  currentPage === 'home' 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-yellow-50 hover:text-yellow-600'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage('products')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  currentPage === 'products' 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-yellow-50 hover:text-yellow-600'
                }`}
              >
                Products
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={() => setCurrentPage('admin')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    currentPage === 'admin' 
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-yellow-50 hover:text-yellow-600'
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
      <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <img 
                  src="/kici.jpeg" 
                  alt="Kici Perfume Logo" 
                  className="w-14 h-14 mr-4 rounded-lg"
                />
                <div className="flex flex-col">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">Kici</h3>
                  <p className="text-gray-400 text-sm -mt-1">A perfume studio</p>
                </div>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Premium fragrances for every occasion. Discover your signature scent and express your unique personality.
              </p>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </button>
                <button className="w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </button>
                <button className="w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.056 0C5.378 0 0 5.378 0 12.056s5.378 12.056 12.056 12.056 12.056-5.378 12.056-12.056S18.734 0 12.056 0zm5.568 8.382h-1.897c-.518 0-.621.246-.621.607v.796h2.487l-.324 2.512h-2.163v6.44h-2.594v-6.44H10.35v-2.512h1.652v-.918c0-1.638.999-2.529 2.463-2.529.7 0 1.302.052 1.477.075v1.711l-.013.001z"/>
                  </svg>
                </button>
                <button className="w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </button>
            </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-purple-300">Quick Links</h4>
              <ul className="space-y-3 text-gray-300">
                <li><button onClick={() => setCurrentPage('for-her')} className="hover:text-purple-400 transition-colors cursor-pointer">For Her</button></li>
                <li><button onClick={() => setCurrentPage('for-him')} className="hover:text-purple-400 transition-colors cursor-pointer">For Him</button></li>
                <li><button onClick={() => setCurrentPage('contact')} className="hover:text-purple-400 transition-colors cursor-pointer">Contact Us</button></li>
                <li><button onClick={() => setCurrentPage('about')} className="hover:text-purple-400 transition-colors cursor-pointer">About Us</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-purple-300">Support</h4>
              <ul className="space-y-3 text-gray-300">
                <li><button onClick={() => setCurrentPage('shipping-info')} className="hover:text-purple-400 transition-colors cursor-pointer">Shipping Info</button></li>
                <li><button onClick={() => setCurrentPage('return-policy')} className="hover:text-purple-400 transition-colors cursor-pointer">Returns</button></li>
                <li><button onClick={() => setCurrentPage('privacy-policy')} className="hover:text-purple-400 transition-colors cursor-pointer">Privacy Policy</button></li>
                <li><button onClick={() => setCurrentPage('shipping-policy')} className="hover:text-purple-400 transition-colors cursor-pointer">Shipping Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 Kici Perfume. All rights reserved. Made with ❤️ for fragrance lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;