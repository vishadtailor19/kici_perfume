const express = require('express');
const { Category, Product } = require('../models');

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name', 'slug', 'description', 'parent_id'],
      order: [['name', 'ASC']]
    });

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/categories/:id
// @desc    Get single category with products
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          as: 'products',
          where: { is_active: true },
          required: false,
          limit: 12,
          order: [['created_at', 'DESC']]
        }
      ]
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/categories/:id/products
// @desc    Get products in a category with pagination
// @access  Public
router.get('/:id/products', async (req, res) => {
  try {
    const { page = 1, limit = 12, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: { 
        category_id: req.params.id,
        is_active: true 
      },
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      category,
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts: count,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get category products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
