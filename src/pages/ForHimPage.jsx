import { useState, useEffect } from 'react';
import { useApp } from '../App';

const ForHimPage = () => {
  const { products, setCurrentPage, setSelectedProduct, addToCart, user, apiCall } = useApp();
  const [menProducts, setMenProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchMenProducts = async () => {
      try {
        setLoading(true);
        const response = await apiCall('/products?gender=male&limit=50');
        setMenProducts(response.products || []);
      } catch (error) {
        console.error('Failed to fetch men products:', error);
        // Fallback to filtering from existing products
        const filtered = products.filter(p => 
          p.gender === 'male' || p.gender === 'unisex'
        );
        setMenProducts(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchMenProducts();
  }, [apiCall, products]);

  const categories = [
    { id: 'all', name: 'All Fragrances', count: menProducts.length },
    { id: 'woody', name: 'Woody', count: menProducts.filter(p => p.category?.name === 'Woody').length },
    { id: 'fresh', name: 'Fresh', count: menProducts.filter(p => p.category?.name === 'Fresh').length },
    { id: 'spicy', name: 'Spicy', count: menProducts.filter(p => p.category?.name === 'Spicy').length },
    { id: 'oriental', name: 'Oriental', count: menProducts.filter(p => p.category?.name === 'Oriental').length }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? menProducts 
    : menProducts.filter(p => p.category?.name?.toLowerCase() === selectedCategory);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">For Him</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover masculine fragrances that embody strength, sophistication, and confidence. 
            From fresh and invigorating to deep and mysterious.
          </p>
        </div>

        {/* Hero Section */}
        <section className="mb-16">
          <div className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 rounded-2xl overflow-hidden">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop" 
                alt="Men's fragrances" 
                className="w-full h-full object-cover opacity-30"
              />
            </div>
            <div className="relative z-10 px-8 py-16 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Masculine Elegance</h2>
              <p className="text-xl mb-8 opacity-90">
                Curated collection of premium men's fragrances
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-2">Long-Lasting</h3>
                  <p className="text-sm opacity-80">8-12 hour longevity</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-2">Premium Quality</h3>
                  <p className="text-sm opacity-80">Authentic fragrances</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-2">Expert Curated</h3>
                  <p className="text-sm opacity-80">Hand-picked selection</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-gray-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'all' ? 'All Men\'s Fragrances' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Fragrances`}
            </h2>
            <p className="text-gray-600">{filteredProducts.length} products</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-64 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative">
                    <img
                      src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop'}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    {product.is_bestseller && (
                      <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                        Bestseller
                      </div>
                    )}
                    {product.is_new_arrival && (
                      <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                        New
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.brand?.name || 'Kici'}</p>
                    <p className="text-xs text-gray-500 mb-3">{product.size} • {product.concentration}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        disabled={!user || product.stock_quantity === 0}
                        className="bg-gradient-to-r from-blue-600 to-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try selecting a different category or check back later.</p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="bg-gradient-to-r from-blue-600 to-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300"
              >
                View All Products
              </button>
            </div>
          )}
        </section>

        {/* Fragrance Guide */}
        <section className="mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Men's Fragrance Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fresh & Clean</h3>
                <p className="text-gray-600 text-sm">Perfect for daily wear and office environments. Light, crisp, and energizing.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brown-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brown-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Woody & Warm</h3>
                <p className="text-gray-600 text-sm">Sophisticated and masculine. Ideal for evening wear and special occasions.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Spicy & Bold</h3>
                <p className="text-gray-600 text-sm">Confident and attention-grabbing. Perfect for making a statement.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Oriental & Mysterious</h3>
                <p className="text-gray-600 text-sm">Exotic and intriguing. Best for intimate settings and night out.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ForHimPage;
