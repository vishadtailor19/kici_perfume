const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductFragranceNote = sequelize.define('ProductFragranceNote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  fragrance_note_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'fragrance_notes',
      key: 'id'
    }
  },
  note_type: {
    type: DataTypes.ENUM('top', 'heart', 'base'),
    allowNull: false
  },
  intensity: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 10
    },
    comment: 'How prominent this note is in the fragrance'
  }
}, {
  tableName: 'product_fragrance_notes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['product_id', 'fragrance_note_id']
    }
  ]
});

module.exports = ProductFragranceNote;
