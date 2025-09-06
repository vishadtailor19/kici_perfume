import React, { useEffect, useState } from 'react';
import { fetchProducts, removeProduct } from '../services/api';
import RemoveProductButton from './RemoveProductButton';
import { Product } from '../types';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleRemoveProduct = async (productId: string) => {
    try {
      await removeProduct(productId);
      setProducts(products.filter(product => product.id !== productId));
    } catch (err) {
      setError('Failed to remove product');
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <span>{product.name}</span>
            <RemoveProductButton productId={product.id} onRemove={handleRemoveProduct} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;