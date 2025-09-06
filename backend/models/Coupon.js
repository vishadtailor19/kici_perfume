const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Coupon code is required' }
    }
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Coupon name is required' }
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  type: {
    type: DataTypes.ENUM('percentage', 'fixed_amount', 'free_shipping'),
    allowNull: false
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: { args: 0, msg: 'Coupon value cannot be negative' }
    }
  },
  minimum_order_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  maximum_discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    comment: 'Maximum discount for percentage coupons'
  },
  usage_limit: {
    type: DataTypes.INTEGER,
    comment: 'Total usage limit for this coupon'
  },
  usage_limit_per_user: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  used_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  valid_from: {
    type: DataTypes.DATE,
    allowNull: false
  },
  valid_until: {
    type: DataTypes.DATE,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  applicable_categories: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of category IDs this coupon applies to'
  },
  applicable_products: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of product IDs this coupon applies to'
  },
  excluded_categories: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of category IDs this coupon excludes'
  },
  excluded_products: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of product IDs this coupon excludes'
  }
}, {
  tableName: 'coupons',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['code'] },
    { fields: ['is_active'] },
    { fields: ['valid_from', 'valid_until'] }
  ]
});

module.exports = Coupon;
