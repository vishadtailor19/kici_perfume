const { sequelize, testConnection } = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const Brand = require('./Brand');
const FragranceNote = require('./FragranceNote');
const ProductFragranceNote = require('./ProductFragranceNote');
const Review = require('./Review');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Wishlist = require('./Wishlist');
const ProductImage = require('./ProductImage');
const Coupon = require('./Coupon');
const Address = require('./Address');

// Define associations
const defineAssociations = () => {
  // User associations
  User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
  User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
  User.hasOne(Cart, { foreignKey: 'user_id', as: 'cart' });
  User.hasMany(Wishlist, { foreignKey: 'user_id', as: 'wishlist' });
  User.hasMany(Address, { foreignKey: 'user_id', as: 'addresses' });

  // Category associations
  Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
  Category.hasMany(Category, { foreignKey: 'parent_id', as: 'subcategories' });
  Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' });

  // Brand associations
  Brand.hasMany(Product, { foreignKey: 'brand_id', as: 'products' });

  // Product associations
  Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
  Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });
  Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' });
  Product.hasMany(Review, { foreignKey: 'product_id', as: 'reviews' });
  Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'orderItems' });
  Product.hasMany(CartItem, { foreignKey: 'product_id', as: 'cartItems' });
  Product.hasMany(Wishlist, { foreignKey: 'product_id', as: 'wishlistItems' });
  
  // Product fragrance notes (many-to-many)
  Product.belongsToMany(FragranceNote, {
    through: ProductFragranceNote,
    foreignKey: 'product_id',
    otherKey: 'fragrance_note_id',
    as: 'fragranceNotes'
  });

  // FragranceNote associations
  FragranceNote.belongsToMany(Product, {
    through: ProductFragranceNote,
    foreignKey: 'fragrance_note_id',
    otherKey: 'product_id',
    as: 'products'
  });

  // ProductFragranceNote associations
  ProductFragranceNote.belongsTo(Product, { foreignKey: 'product_id' });
  ProductFragranceNote.belongsTo(FragranceNote, { foreignKey: 'fragrance_note_id' });

  // ProductImage associations
  ProductImage.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

  // Review associations
  Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Review.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

  // Order associations
  Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Order.belongsTo(Address, { foreignKey: 'shipping_address_id', as: 'shippingAddress' });
  Order.belongsTo(Coupon, { foreignKey: 'coupon_id', as: 'coupon' });
  Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });

  // OrderItem associations
  OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
  OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

  // Cart associations
  Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items' });

  // CartItem associations
  CartItem.belongsTo(Cart, { foreignKey: 'cart_id', as: 'cart' });
  CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

  // Wishlist associations
  Wishlist.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Wishlist.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

  // Address associations
  Address.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Address.hasMany(Order, { foreignKey: 'shipping_address_id', as: 'orders' });

  // Coupon associations
  Coupon.hasMany(Order, { foreignKey: 'coupon_id', as: 'orders' });
};

// Initialize associations
defineAssociations();

// Sync database
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Database synchronized successfully');
  } catch (error) {
    console.error('❌ Error synchronizing database:', error);
  }
};

module.exports = {
  sequelize,
  testConnection,
  User,
  Product,
  Category,
  Brand,
  FragranceNote,
  ProductFragranceNote,
  Review,
  Order,
  OrderItem,
  Cart,
  CartItem,
  Wishlist,
  ProductImage,
  Coupon,
  Address,
  syncDatabase
};
