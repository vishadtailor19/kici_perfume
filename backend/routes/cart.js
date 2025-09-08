const express = require('express');
const { body, validationResult } = require('express-validator');
const { Cart, CartItem, Product, sequelize } = require('../models');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'stock_quantity', 'concentration', 'size']
            }
          ]
        }
      ]
    });

    if (!cart) {
      return res.json({
        items: [],
        totalItems: 0,
        totalAmount: 0
      });
    }

    // Calculate totals
    let totalItems = 0;
    let totalAmount = 0;

    cart.items.forEach(item => {
      totalItems += item.quantity;
      totalAmount += item.quantity * parseFloat(item.product.price);
    });

    res.json({
      items: cart.items,
      totalItems,
      totalAmount: totalAmount.toFixed(2)
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', authenticateToken, [
  body('product_id').isInt({ min: 1 }).withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10')
], async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { product_id, quantity } = req.body;

    // Check if product exists and has sufficient stock
    const product = await Product.findByPk(product_id);
    if (!product || !product.is_active) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock_quantity < quantity) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: `Insufficient stock. Available: ${product.stock_quantity}` 
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({
      where: { user_id: req.user.id },
      transaction
    });

    if (!cart) {
      cart = await Cart.create({
        user_id: req.user.id
      }, { transaction });
    }

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      where: { 
        cart_id: cart.id, 
        product_id: product_id 
      },
      transaction
    });

    if (cartItem) {
      // Update quantity
      const newQuantity = cartItem.quantity + quantity;
      if (newQuantity > product.stock_quantity) {
        await transaction.rollback();
        return res.status(400).json({ 
          message: `Cannot add more items. Total would exceed available stock: ${product.stock_quantity}` 
        });
      }
      
      cartItem.quantity = newQuantity;
      cartItem.total_price = newQuantity * parseFloat(product.price);
      await cartItem.save({ transaction });
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        cart_id: cart.id,
        product_id: product_id,
        quantity: quantity,
        unit_price: parseFloat(product.price),
        total_price: quantity * parseFloat(product.price)
      }, { transaction });
    }

    await transaction.commit();

    res.status(201).json({
      message: 'Item added to cart successfully',
      cartItem: {
        id: cartItem.id,
        quantity: cartItem.quantity,
        unit_price: cartItem.unit_price,
        total_price: cartItem.total_price,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          stock_quantity: product.stock_quantity
        }
      }
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error('Add to cart error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/cart/update/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/update/:itemId', authenticateToken, [
  body('quantity').isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { quantity } = req.body;
    const { itemId } = req.params;

    // Find cart item and verify ownership
    const cartItem = await CartItem.findOne({
      where: { id: itemId },
      include: [
        {
          model: Cart,
          as: 'cart',
          where: { user_id: req.user.id }
        },
        {
          model: Product,
          as: 'product'
        }
      ]
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Check stock availability
    if (quantity > cartItem.product.stock_quantity) {
      return res.status(400).json({ 
        message: `Insufficient stock. Available: ${cartItem.product.stock_quantity}` 
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({
      message: 'Cart item updated successfully',
      cartItem
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cart/remove/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;

    // Find and delete cart item, verify ownership
    const cartItem = await CartItem.findOne({
      where: { id: itemId },
      include: [
        {
          model: Cart,
          as: 'cart',
          where: { user_id: req.user.id }
        }
      ]
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await cartItem.destroy();

    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { user_id: req.user.id }
    });

    if (!cart) {
      return res.json({ message: 'Cart is already empty' });
    }

    // Delete all cart items
    await CartItem.destroy({
      where: { cart_id: cart.id }
    });

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
