const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Address = sequelize.define('Address', {
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
  type: {
    type: DataTypes.ENUM('billing', 'shipping', 'both'),
    defaultValue: 'shipping'
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'First name is required' }
    }
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Last name is required' }
    }
  },
  company: {
    type: DataTypes.STRING(100)
  },
  address_line_1: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Address line 1 is required' }
    }
  },
  address_line_2: {
    type: DataTypes.STRING(100)
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'City is required' }
    }
  },
  state: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'State is required' }
    }
  },
  postal_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Postal code is required' }
    }
  },
  country: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'United States',
    validate: {
      notEmpty: { msg: 'Country is required' }
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    validate: {
      is: { args: /^\+?[\d\s-()]+$/, msg: 'Please enter a valid phone number' }
    }
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'addresses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['is_default'] }
  ]
});

module.exports = Address;
