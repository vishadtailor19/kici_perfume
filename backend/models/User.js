const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Name is required' },
      len: { args: [2, 50], msg: 'Name must be between 2 and 50 characters' }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Please enter a valid email' },
      notEmpty: { msg: 'Email is required' }
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase());
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Password is required' },
      len: { args: [6, 255], msg: 'Password must be at least 6 characters' }
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Phone number is required' },
      is: { 
        args: /^[6-9]\d{9}$/, 
        msg: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9' 
      },
      len: { args: [10, 10], msg: 'Phone number must be exactly 10 digits' }
    }
  },
  date_of_birth: {
    type: DataTypes.DATEONLY
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say')
  },
  preferred_fragrance_types: {
    type: DataTypes.JSON, // Store array of preferred fragrance categories
    defaultValue: []
  },
  newsletter_subscribed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  loyalty_points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  email_verification_token: {
    type: DataTypes.STRING
  },
  password_reset_token: {
    type: DataTypes.STRING
  },
  password_reset_expires: {
    type: DataTypes.DATE
  },
  last_login: {
    type: DataTypes.DATE
  },
  profile_image: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance methods
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  delete values.email_verification_token;
  delete values.password_reset_token;
  delete values.password_reset_expires;
  return values;
};

// Class methods
User.findByEmail = function(email) {
  return this.findOne({ where: { email: email.toLowerCase() } });
};

User.findActiveById = function(id) {
  return this.findOne({ where: { id, is_active: true } });
};

module.exports = User;