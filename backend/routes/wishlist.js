const express = require('express');
const { body, validationResult } = require('express-validator');
const { Wishlist, Product, Brand, Category } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const wishlistItems = await Wishlist.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Product,
          as: 'product',
          include: [
            { model: Brand, as: 'brand', attributes: ['name'] },
            { model: Category, as: 'category', attributes: ['name'] }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      items: wishlistItems,
      totalItems: wishlistItems.length
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/wishlist/add
// @desc    Add item to wishlist
// @access  Private
router.post('/add', authenticateToken, [
  body('product_id').isInt({ min: 1 }).withMessage('Valid product ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { product_id } = req.body;

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product || !product.is_active) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if item already exists in wishlist
    const existingItem = await Wishlist.findOne({
      where: { 
        user_id: req.user.id, 
        product_id: product_id 
      }
    });

    if (existingItem) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      user_id: req.user.id,
      product_id: product_id
    });

    // Return with product details
    const wishlistItemWithProduct = await Wishlist.findByPk(wishlistItem.id, {
      include: [
        {
          model: Product,
          as: 'product',
          include: [
            { model: Brand, as: 'brand', attributes: ['name'] },
            { model: Category, as: 'category', attributes: ['name'] }
          ]
        }
      ]
    });

    res.status(201).json({
      message: 'Product added to wishlist successfully',
      wishlistItem: wishlistItemWithProduct
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/wishlist/remove/:productId
// @desc    Remove item from wishlist
// @access  Private
router.delete('/remove/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlistItem = await Wishlist.findOne({
      where: { 
        user_id: req.user.id, 
        product_id: productId 
      }
    });

    if (!wishlistItem) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }

    await wishlistItem.destroy();

    res.json({ message: 'Product removed from wishlist successfully' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/wishlist/toggle
// @desc    Toggle item in wishlist (add if not exists, remove if exists)
// @access  Private
router.post('/toggle', authenticateToken, [
  body('product_id').isInt({ min: 1 }).withMessage('Valid product ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { product_id } = req.body;

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product || !product.is_active) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if item exists in wishlist
    const existingItem = await Wishlist.findOne({
      where: { 
        user_id: req.user.id, 
        product_id: product_id 
      }
    });

    if (existingItem) {
      // Remove from wishlist
      await existingItem.destroy();
      res.json({ 
        message: 'Product removed from wishlist',
        inWishlist: false
      });
    } else {
      // Add to wishlist
      await Wishlist.create({
        user_id: req.user.id,
        product_id: product_id
      });
      res.json({ 
        message: 'Product added to wishlist',
        inWishlist: true
      });
    }
  } catch (error) {
    console.error('Toggle wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/wishlist/clear
// @desc    Clear entire wishlist
// @access  Private
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    await Wishlist.destroy({
      where: { user_id: req.user.id }
    });

    res.json({ message: 'Wishlist cleared successfully' });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
