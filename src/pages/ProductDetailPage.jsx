import { useState, useEffect } from 'react';
import { useApp } from '../App';

const ProductDetailPage = () => {
  const { selectedProduct, setCurrentPage, addToCart, apiCall } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch detailed product information
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!selectedProduct?.id) return;
      
      try {
        setLoading(true);
        setError('');
        const data = await apiCall(`/products/${selectedProduct.id}`);
        setProductDetails(data);
      } catch (error) {
        console.error('Failed to fetch product details:', error);
        setError('Failed to load product details');
        // Fallback to selectedProduct data
        setProductDetails(selectedProduct);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [selectedProduct, apiCall]);

  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <button
          onClick={() => setCurrentPage('products')}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-300 rounded-2xl"></div>
              <div className="flex space-x-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-300 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Product</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => setCurrentPage('products')}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const product = productDetails || selectedProduct;

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    // Show success message or redirect to cart
    alert(`Added ${quantity} x ${selectedProduct.name} to cart!`);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock_quantity) {
      setQuantity(newQuantity);
    }
  };

  // Get product images or use fallback
  const productImages = product.images?.length > 0 
    ? product.images.map(img => img.url)
    : [
        product.image || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop'
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <button
            onClick={() => setCurrentPage('home')}
            className="hover:text-purple-600 transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => setCurrentPage('products')}
            className="hover:text-purple-600 transition-colors"
          >
            Products
          </button>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={productImages[selectedImage]}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="flex space-x-4">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-purple-600' : 'border-gray-200'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {product.brand?.name} • {product.category?.name}
            </p>
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-purple-600">
                Rs.{product.price}
              </span>
              <span className={`text-sm px-3 py-1 rounded-full ${
                product.stock_quantity > 10 
                  ? 'bg-green-100 text-green-800' 
                  : product.stock_quantity > 0 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
              }`}>
                {product.stock_quantity > 10 
                  ? 'In Stock' 
                  : product.stock_quantity > 0 
                    ? `Only ${product.stock_quantity} left` 
                    : 'Out of Stock'
                }
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Fragrance Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Fragrance Notes</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Top Notes:</span>
                <span className="text-gray-900">Bergamot, Lemon, Pink Pepper</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Heart Notes:</span>
                <span className="text-gray-900">Rose, Jasmine, Lily of the Valley</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Base Notes:</span>
                <span className="text-gray-900">Musk, Vanilla, Sandalwood</span>
              </div>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock_quantity}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add to Cart - Rs.{(product.price * quantity).toFixed(2)}
              </button>
              <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Product Features */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">Free shipping over Rs.500</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-600">30-day return policy</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm text-gray-600">Secure checkout</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm text-gray-600">Fast delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;