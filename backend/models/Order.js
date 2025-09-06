const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  order_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
    defaultValue: 'pending'
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded'),
    defaultValue: 'pending'
  },
  payment_method: {
    type: DataTypes.ENUM('credit_card', 'debit_card', 'paypal', 'stripe', 'apple_pay', 'google_pay', 'bank_transfer'),
    allowNull: false
  },
  payment_transaction_id: {
    type: DataTypes.STRING(100)
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: { args: 0, msg: 'Subtotal cannot be negative' }
    }
  },
  tax_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  shipping_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: { args: 0, msg: 'Total amount cannot be negative' }
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  coupon_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'coupons',
      key: 'id'
    }
  },
  coupon_code: {
    type: DataTypes.STRING(50)
  },
  shipping_address_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'addresses',
      key: 'id'
    }
  },
  billing_address_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'addresses',
      key: 'id'
    }
  },
  shipping_method: {
    type: DataTypes.ENUM('standard', 'express', 'overnight', 'pickup'),
    defaultValue: 'standard'
  },
  tracking_number: {
    type: DataTypes.STRING(100)
  },
  tracking_url: {
    type: DataTypes.STRING(255)
  },
  estimated_delivery: {
    type: DataTypes.DATE
  },
  shipped_at: {
    type: DataTypes.DATE
  },
  delivered_at: {
    type: DataTypes.DATE
  },
  cancelled_at: {
    type: DataTypes.DATE
  },
  cancellation_reason: {
    type: DataTypes.TEXT
  },
  notes: {
    type: DataTypes.TEXT
  },
  internal_notes: {
    type: DataTypes.TEXT,
    comment: 'Internal notes for staff only'
  },
  gift_message: {
    type: DataTypes.TEXT
  },
  is_gift: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  loyalty_points_earned: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  loyalty_points_used: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (order) => {
      if (!order.order_number) {
        const count = await Order.count();
        order.order_number = `KC${Date.now().toString().slice(-6)}${(count + 1).toString().padStart(3, '0')}`;
      }
    }
  },
  indexes: [
    { fields: ['user_id'] },
    { fields: ['order_number'] },
    { fields: ['status'] },
    { fields: ['payment_status'] },
    { fields: ['created_at'] },
    { fields: ['shipped_at'] },
    { fields: ['delivered_at'] }
  ]
});

// Instance methods
Order.prototype.canBeCancelled = function() {
  return ['pending', 'confirmed'].includes(this.status);
};

Order.prototype.canBeRefunded = function() {
  return ['delivered'].includes(this.status) && this.payment_status === 'paid';
};

Order.prototype.calculateTotal = function() {
  return parseFloat(this.subtotal) + parseFloat(this.tax_amount) + parseFloat(this.shipping_amount) - parseFloat(this.discount_amount);
};

module.exports = Order;