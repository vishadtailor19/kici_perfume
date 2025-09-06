const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Product name is required' },
      len: { args: [1, 100], msg: 'Product name cannot exceed 100 characters' }
    }
  },
  slug: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Product description is required' },
      len: { args: [10, 2000], msg: 'Description must be between 10 and 2000 characters' }
    }
  },
  short_description: {
    type: DataTypes.STRING(255)
  },
  brand_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'brands',
      key: 'id'
    }
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: { args: 0, msg: 'Price cannot be negative' }
    }
  },
  compare_price: {
    type: DataTypes.DECIMAL(10, 2),
    comment: 'Original price for showing discounts'
  },
  cost_price: {
    type: DataTypes.DECIMAL(10, 2),
    comment: 'Cost price for profit calculations'
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: { args: 0, msg: 'Stock cannot be negative' }
    }
  },
  low_stock_threshold: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  sku: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  barcode: {
    type: DataTypes.STRING(50)
  },
  size: {
    type: DataTypes.ENUM('30ml', '50ml', '75ml', '100ml', '150ml', '200ml'),
    defaultValue: '50ml'
  },
  concentration: {
    type: DataTypes.ENUM('parfum', 'eau_de_parfum', 'eau_de_toilette', 'eau_de_cologne', 'eau_fraiche'),
    allowNull: false,
    defaultValue: 'eau_de_parfum'
  },
  gender: {
    type: DataTypes.ENUM('unisex', 'men', 'women'),
    defaultValue: 'unisex'
  },
  launch_year: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1900,
      max: new Date().getFullYear() + 1
    }
  },
  perfumer: {
    type: DataTypes.STRING(100),
    comment: 'Name of the perfumer who created this fragrance'
  },
  longevity: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 10
    },
    comment: 'Longevity rating from 1-10'
  },
  sillage: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 10
    },
    comment: 'Sillage (projection) rating from 1-10'
  },
  season: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of suitable seasons: spring, summer, autumn, winter'
  },
  occasion: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of suitable occasions: casual, formal, evening, office, etc.'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_bestseller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_new_arrival: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_limited_edition: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rating_average: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  rating_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  sales_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  meta_title: {
    type: DataTypes.STRING(60)
  },
  meta_description: {
    type: DataTypes.STRING(160)
  },
  weight: {
    type: DataTypes.DECIMAL(8, 2),
    comment: 'Weight in grams'
  },
  dimensions: {
    type: DataTypes.JSON,
    comment: 'Object with length, width, height in cm'
  }
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: (product) => {
      if (!product.slug) {
        product.slug = product.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      if (!product.sku) {
        product.sku = `PRF${Date.now().toString().slice(-6)}`;
      }
    },
    beforeUpdate: (product) => {
      if (product.changed('name') && !product.changed('slug')) {
        product.slug = product.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
    }
  },
  indexes: [
    { fields: ['brand_id'] },
    { fields: ['category_id'] },
    { fields: ['is_active'] },
    { fields: ['is_featured'] },
    { fields: ['price'] },
    { fields: ['rating_average'] },
    { fields: ['created_at'] },
    { fields: ['name'] },
    { fields: ['sku'] },
    { fields: ['slug'] }
  ]
});

// Instance methods
Product.prototype.updateRating = async function() {
  const Review = require('./Review');
  const reviews = await Review.findAll({
    where: { product_id: this.id },
    attributes: ['rating']
  });
  
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating_average = (totalRating / reviews.length).toFixed(2);
    this.rating_count = reviews.length;
    await this.save();
  }
};

Product.prototype.incrementViewCount = async function() {
  this.view_count += 1;
  await this.save();
};

Product.prototype.isInStock = function() {
  return this.stock_quantity > 0;
};

Product.prototype.isLowStock = function() {
  return this.stock_quantity <= this.low_stock_threshold;
};

module.exports = Product;