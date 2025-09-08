import { useState, useEffect } from 'react';
import { useApp } from '../App';

const ProductsPage = () => {
  const { products, categories, loading, setSelectedProduct, setCurrentPage, addToCart, apiCall } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);

  const priceRanges = ['All', 'Under Rs.500', 'Rs.500-800', 'Rs.800-1000', 'Over Rs.1000'];

  // Filter and fetch products based on criteria
  useEffect(() => {
    const filterProducts = async () => {
      if (loading) return;
      
      setIsFiltering(true);
      try {
        // Build query parameters
        const params = new URLSearchParams();
        
        if (searchTerm) params.append('search', searchTerm);
        if (selectedCategory !== 'All') {
          const category = categories.find(c => c.name === selectedCategory);
          if (category) params.append('category_id', category.id);
        }
        
        // Handle price range
        if (priceRange !== 'All') {
          switch (priceRange) {
            case 'Under Rs.500':
              params.append('maxPrice', '49.99');
              break;
            case 'Rs.500-800':
              params.append('minPrice', '50');
              params.append('maxPrice', '80');
              break;
            case 'Rs.800-1000':
              params.append('minPrice', '80.01');
              params.append('maxPrice', '100');
              break;
            case 'Over Rs.1000':
              params.append('minPrice', '100.01');
              break;
          }
        }
        
        // Handle sorting
        switch (sortBy) {
          case 'price-low':
            params.append('sortBy', 'price');
            params.append('sortOrder', 'asc');
            break;
          case 'price-high':
            params.append('sortBy', 'price');
            params.append('sortOrder', 'desc');
            break;
          case 'name':
          default:
            params.append('sortBy', 'name');
            params.append('sortOrder', 'asc');
            break;
        }
        
        params.append('limit', '50'); // Get more products for better filtering
        
        const data = await apiCall(`/products?${params.toString()}`);
        setFilteredProducts(data.products || []);
      } catch (error) {
        console.error('Failed to filter products:', error);
        // Fallback to client-side filtering if API fails
        setFilteredProducts(products);
      } finally {
        setIsFiltering(false);
      }
    };

    filterProducts();
  }, [searchTerm, selectedCategory, priceRange, sortBy, products, categories, loading, apiCall]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Our Collection</h1>
        <p className="text-lg text-gray-600">Discover premium fragrances for every occasion</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search perfumes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>

          {/* Price Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {priceRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {isFiltering ? 'Filtering products...' : `Showing ${filteredProducts.length} products`}
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(loading || isFiltering) ? (
          // Loading skeleton
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="aspect-square bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 w-2/3"></div>
                  <div className="h-3 bg-gray-300 rounded mb-3"></div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={() => handleProductClick(product)}
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Low Stock
                  </div>
                )}
                {product.stock_quantity === 0 && (
                  <div className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                    Out of Stock
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.brand?.name} • {product.category?.name}</p>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xl font-bold text-purple-600">Rs.{product.price}</span>
                  <span className="text-xs text-gray-500">{product.stock_quantity} in stock</span>
                </div>
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={product.stock_quantity === 0}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProductsPage;