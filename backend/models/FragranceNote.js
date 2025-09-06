const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FragranceNote = sequelize.define('FragranceNote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Fragrance note name is required' }
    }
  },
  type: {
    type: DataTypes.ENUM('top', 'heart', 'base'),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Fragrance note type is required' }
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  scent_family: {
    type: DataTypes.ENUM('floral', 'fresh', 'oriental', 'woody', 'citrus', 'spicy', 'fruity', 'green', 'aquatic', 'gourmand'),
    allowNull: false
  },
  intensity: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 10
    },
    comment: 'Intensity scale from 1 (light) to 10 (strong)'
  },
  longevity: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 10
    },
    comment: 'Longevity scale from 1 (short) to 10 (long-lasting)'
  },
  is_natural: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'fragrance_notes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = FragranceNote;
