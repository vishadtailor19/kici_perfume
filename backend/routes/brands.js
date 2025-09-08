const express = require('express');
const { Brand, Product } = require('../models');

const router = express.Router();

// @route   GET /api/brands
// @desc    Get all brands
// @access  Public
router.get('/', async (req, res) => {
  try {
    const brands = await Brand.findAll({
      attributes: ['id', 'name', 'slug', 'description', 'country_of_origin'],
      order: [['name', 'ASC']]
    });

    res.json(brands);
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/brands/:id
// @desc    Get single brand with products
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id, {
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

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.json(brand);
  } catch (error) {
    console.error('Get brand error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/brands/:id/products
// @desc    Get products from a brand with pagination
// @access  Public
router.get('/:id/products', async (req, res) => {
  try {
    const { page = 1, limit = 12, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const brand = await Brand.findByPk(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: { 
        brand_id: req.params.id,
        is_active: true 
      },
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      brand,
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
    console.error('Get brand products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
