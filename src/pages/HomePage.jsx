import { useState, useEffect } from 'react';
import { useApp } from '../App';

const HomePage = () => {
  const { setCurrentPage, setSelectedProduct, products, categories, loading, error, apiCall } = useApp();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoadingFeatured(true);
        const data = await apiCall('/products/featured?limit=3');
        setFeaturedProducts(data || []);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
        // Fallback to first 3 products if featured API fails
        setFeaturedProducts(products.slice(0, 3));
      } finally {
        setLoadingFeatured(false);
      }
    };

    if (!loading && products.length > 0) {
      fetchFeaturedProducts();
    }
  }, [loading, products, apiCall]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your
              <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                Signature Scent
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Premium fragrances crafted for the modern individual
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setCurrentPage('products')}
                className="bg-white text-purple-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Shop Collection
              </button>
              {/* <button
                onClick={() => setCurrentPage('products')}
                className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-purple-900 transition-all duration-300 transform hover:scale-105"
              >
                Learn More
              </button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Fragrances</h2>
            <p className="text-lg text-gray-600">Handpicked selections from our premium collection</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loadingFeatured ? (
              // Loading skeleton for featured products
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="aspect-square bg-gray-300"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded mb-3 w-2/3"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                        <div className="h-4 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
                onClick={() => handleProductClick(product)}
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-3">{product.brand?.name} • {product.category?.name}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-purple-600">Rs.{product.price}</span>
                      <span className="text-sm text-gray-500">{product.stock_quantity} in stock</span>
                    </div>
                  </div>
                </div>
              </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">No featured products available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Find your perfect fragrance family</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton for categories
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="relative rounded-2xl overflow-hidden shadow-lg">
                    <div className="w-full h-48 bg-gray-300"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className="h-6 bg-gray-400 rounded w-20 mb-1"></div>
                      <div className="h-4 bg-gray-400 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : categories.length > 0 ? (
              categories.slice(0, 4).map((category) => {
                // Count products in each category
                const productCount = products.filter(p => p.category_id === category.id).length;
                const defaultImages = {
                  'Floral': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&h=200&fit=crop',
                  'Fresh': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
                  'Oriental': 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300&h=200&fit=crop',
                  'Citrus': 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=300&h=200&fit=crop',
                  'Woody': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
                  'Spicy': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=200&fit=crop'
                };
                
                return (
                  <div
                    key={category.id}
                    className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                    onClick={() => setCurrentPage('products')}
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                      <img
                        src={defaultImages[category.name] || 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&h=200&fit=crop'}
                        alt={category.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                        <p className="text-sm opacity-90">{productCount} fragrances</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-4 text-center py-12">
                <p className="text-gray-500">No categories available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Kici Perfume</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">Crafted with the finest ingredients and expert artistry</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over Rs.500, delivered within 3-5 days</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Satisfaction Guarantee</h3>
              <p className="text-gray-600">30-day return policy for your complete satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Real reviews from fragrance lovers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Ravi Sharma",
                rating: 5,
                review: "I purchased Breezy and it’s just perfect for daily use. The fragrance is refreshing and feels very premium.",
                product: "Breezy"
              },
              {
                name: "Priya Mehta",
                rating: 5,
                review: "Kici Flora is absolutely lovely 😍. The floral notes are natural, long-lasting, and I keep getting compliments for it.",
                product: "Kici Flora"
              },
              {
                name: "Arjun Verma",
                rating: 4,
                review: "Oud Cambodian is strong, rich, and classy – perfect for evenings. The quality is top-notch and delivery was quick.",
                product: "Oud Cambodian"
              }           
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">"{testimonial.review}"</p>
                <p className="text-sm text-purple-600 font-medium">Purchased: {testimonial.product}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
