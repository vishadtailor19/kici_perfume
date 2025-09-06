import React from 'react';
import { removeProduct } from '../services/api';

interface RemoveProductButtonProps {
  productId: string;
  onRemove: () => void;
}

const RemoveProductButton: React.FC<RemoveProductButtonProps> = ({ productId, onRemove }) => {
  const handleRemove = async () => {
    try {
      await removeProduct(productId);
      onRemove();
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  return (
    <button onClick={handleRemove} className="remove-product-button">
      Remove Product
    </button>
  );
};

export default RemoveProductButton;