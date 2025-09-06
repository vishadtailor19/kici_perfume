const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  session_id: {
    type: DataTypes.STRING(255),
    comment: 'For guest users'
  },
  total_items: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  expires_at: {
    type: DataTypes.DATE,
    comment: 'Cart expiration for cleanup'
  }
}, {
  tableName: 'carts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['session_id'] },
    { fields: ['expires_at'] }
  ]
});

module.exports = Cart;
