import React, { useEffect, useState } from 'react';
import ProductList from '../components/ProductList';
import AddProductForm from '../components/AddProductForm';
import { fetchProducts } from '../services/api';
import { Product } from '../types';

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };

    loadProducts();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <AddProductForm />
      <ProductList products={products} />
    </div>
  );
};

export default Dashboard;