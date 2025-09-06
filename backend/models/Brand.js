const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Brand = sequelize.define('Brand', {
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
      notEmpty: { msg: 'Brand name is required' }
    }
  },
  slug: {
    type: DataTypes.STRING(60),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  },
  logo: {
    type: DataTypes.STRING
  },
  website: {
    type: DataTypes.STRING,
    validate: {
      isUrl: { msg: 'Please enter a valid URL' }
    }
  },
  country_of_origin: {
    type: DataTypes.STRING(50)
  },
  founded_year: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1800,
      max: new Date().getFullYear()
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  meta_title: {
    type: DataTypes.STRING(60)
  },
  meta_description: {
    type: DataTypes.STRING(160)
  }
}, {
  tableName: 'brands',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: (brand) => {
      if (!brand.slug) {
        brand.slug = brand.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
    },
    beforeUpdate: (brand) => {
      if (brand.changed('name') && !brand.changed('slug')) {
        brand.slug = brand.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
    }
  }
});

module.exports = Brand;
