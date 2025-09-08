import { useState, useEffect } from 'react';
import { useApp } from '../App';

const ForHerPage = () => {
  const { products, setCurrentPage, setSelectedProduct, addToCart, user, apiCall } = useApp();
  const [womenProducts, setWomenProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchWomenProducts = async () => {
      try {
        setLoading(true);
        const response = await apiCall('/products?gender=female&limit=50');
        setWomenProducts(response.products || []);
      } catch (error) {
        console.error('Failed to fetch women products:', error);
        // Fallback to filtering from existing products
        const filtered = products.filter(p => 
          p.gender === 'female' || p.gender === 'unisex'
        );
        setWomenProducts(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchWomenProducts();
  }, [apiCall, products]);

  const categories = [
    { id: 'all', name: 'All Fragrances', count: womenProducts.length },
    { id: 'floral', name: 'Floral', count: womenProducts.filter(p => p.category?.name === 'Floral').length },
    { id: 'fresh', name: 'Fresh', count: womenProducts.filter(p => p.category?.name === 'Fresh').length },
    { id: 'oriental', name: 'Oriental', count: womenProducts.filter(p => p.category?.name === 'Oriental').length },
    { id: 'citrus', name: 'Citrus', count: womenProducts.filter(p => p.category?.name === 'Citrus').length }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? womenProducts 
    : womenProducts.filter(p => p.category?.name?.toLowerCase() === selectedCategory);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">For Her</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Embrace your femininity with our exquisite collection of women's fragrances. 
            From delicate florals to bold orientals, find your perfect signature scent.
          </p>
        </div>

        {/* Hero Section */}
        <section className="mb-16">
          <div className="relative bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 rounded-2xl overflow-hidden">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&h=400&fit=crop" 
                alt="Women's fragrances" 
                className="w-full h-full object-cover opacity-30"
              />
            </div>
            <div className="relative z-10 px-8 py-16 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Feminine Elegance</h2>
              <p className="text-xl mb-8 opacity-90">
                Curated collection of premium women's fragrances
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-2">Enchanting</h3>
                  <p className="text-sm opacity-80">Captivating scents</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-2">Luxurious</h3>
                  <p className="text-sm opacity-80">Premium ingredients</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-2">Timeless</h3>
                  <p className="text-sm opacity-80">Classic & modern</p>
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
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
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
              {selectedCategory === 'all' ? 'All Women\'s Fragrances' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Fragrances`}
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
                      src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&h=300&fit=crop'}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    {product.is_bestseller && (
                      <div className="absolute top-3 left-3 bg-pink-600 text-white px-2 py-1 rounded-lg text-xs font-semibold">
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
                        className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300"
              >
                View All Products
              </button>
            </div>
          )}
        </section>

        {/* Fragrance Guide */}
        <section className="mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Women's Fragrance Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Floral & Romantic</h3>
                <p className="text-gray-600 text-sm">Feminine and elegant. Perfect for daytime wear and romantic occasions.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fresh & Energizing</h3>
                <p className="text-gray-600 text-sm">Light and uplifting. Ideal for active lifestyles and summer days.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Citrus & Bright</h3>
                <p className="text-gray-600 text-sm">Vibrant and cheerful. Great for everyday wear and boosting mood.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Oriental & Sensual</h3>
                <p className="text-gray-600 text-sm">Rich and captivating. Perfect for evening events and special moments.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Beauty Tips */}
        <section className="mt-16">
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Fragrance Application Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Best Application Points</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-pink-600 rounded-full mr-3"></span>
                    Pulse points (wrists, neck, behind ears)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-pink-600 rounded-full mr-3"></span>
                    Inside of elbows and knees
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-pink-600 rounded-full mr-3"></span>
                    Hair and clothing (lightly)
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Longevity Tips</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                    Apply to moisturized skin
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                    Don't rub after application
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                    Layer with matching body products
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ForHerPage;
