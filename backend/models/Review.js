const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
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
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: 1, msg: 'Rating must be at least 1' },
      max: { args: 5, msg: 'Rating cannot exceed 5' }
    }
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Review title is required' }
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Review comment is required' },
      len: { args: [10, 1000], msg: 'Comment must be between 10 and 1000 characters' }
    }
  },
  longevity_rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    },
    comment: 'How long the fragrance lasts'
  },
  sillage_rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    },
    comment: 'How much the fragrance projects'
  },
  value_rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    },
    comment: 'Value for money rating'
  },
  is_verified_purchase: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  helpful_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  reported_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  skin_type: {
    type: DataTypes.ENUM('oily', 'dry', 'combination', 'sensitive', 'normal'),
    comment: 'Reviewer skin type for fragrance performance context'
  },
  age_range: {
    type: DataTypes.ENUM('18-25', '26-35', '36-45', '46-55', '56-65', '65+'),
    comment: 'Reviewer age range'
  },
  season_worn: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Seasons when the fragrance was worn'
  },
  occasion_worn: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Occasions when the fragrance was worn'
  }
}, {
  tableName: 'reviews',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['product_id'] },
    { fields: ['user_id'] },
    { fields: ['rating'] },
    { fields: ['is_approved'] },
    { fields: ['created_at'] },
    {
      unique: true,
      fields: ['user_id', 'product_id'],
      name: 'unique_user_product_review'
    }
  ]
});

module.exports = Review;