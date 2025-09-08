const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Product, Brand, Category, Review, User, ProductImage, sequelize } = require('../models');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category_id').optional().isInt({ min: 1 }),
  query('brand_id').optional().isInt({ min: 1 }),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('concentration').optional().isIn(['parfum', 'eau_de_parfum', 'eau_de_toilette', 'eau_de_cologne', 'eau_fraiche']),
  query('gender').optional().isIn(['unisex', 'men', 'women']),
  query('sortBy').optional().isIn(['name', 'price', 'created_at', 'rating_average']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Invalid query parameters', 
        errors: errors.array() 
      });
    }

    const {
      page = 1,
      limit = 12,
      category_id,
      brand_id,
      minPrice,
      maxPrice,
      concentration,
      gender,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc',
      featured
    } = req.query;

    // Build where clause
    const whereClause = { is_active: true };

    if (category_id) whereClause.category_id = category_id;
    if (brand_id) whereClause.brand_id = brand_id;
    if (concentration) whereClause.concentration = concentration;
    if (gender) whereClause.gender = gender;
    if (featured === 'true') whereClause.is_featured = true;

    // Price filtering
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[sequelize.Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereClause.price[sequelize.Op.lte] = parseFloat(maxPrice);
    }

    // Text search
    if (search) {
      whereClause[sequelize.Op.or] = [
        { name: { [sequelize.Op.iLike]: `%${search}%` } },
        { description: { [sequelize.Op.iLike]: `%${search}%` } }
      ];
    }

    // Build order clause
    const orderClause = [];
    if (sortBy === 'created_at') {
      orderClause.push(['created_at', sortOrder.toUpperCase()]);
    } else if (sortBy === 'rating_average') {
      orderClause.push(['rating_average', sortOrder.toUpperCase()]);
    } else {
      orderClause.push([sortBy, sortOrder.toUpperCase()]);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        { model: Brand, as: 'brand', attributes: ['id', 'name'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] }
      ],
      order: orderClause,
      limit: parseInt(limit),
      offset,
      distinct: true
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts: count,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID with full details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { 
        id: req.params.id, 
        is_active: true 
      },
      include: [
        { model: Brand, as: 'brand', attributes: ['id', 'name', 'description'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'description'] },
        { model: ProductImage, as: 'images', attributes: ['id', 'url', 'is_primary'] },
        {
          model: Review,
          as: 'reviews',
          where: { is_approved: true },
          required: false,
          include: [
            { model: User, as: 'user', attributes: ['name'] }
          ],
          limit: 5,
          order: [['created_at', 'DESC']]
        }
      ]
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment view count
    await product.increment('view_count');

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/products
// @desc    Create new product (Admin only)
// @access  Private/Admin
router.post('/', authenticateToken, requireAdmin, [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be less than 100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('brand').trim().isLength({ min: 1, max: 50 }).withMessage('Brand is required'),
  body('category').isIn(['Floral', 'Fresh', 'Oriental', 'Citrus', 'Woody', 'Spicy']).withMessage('Invalid category'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('images.*.url').isURL().withMessage('Invalid image URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Product with this SEO URL already exists' });
    }
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (Admin only)
// @access  Private/Admin
router.put('/:id', authenticateToken, requireAdmin, [
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }),
  body('brand').optional().trim().isLength({ min: 1, max: 50 }),
  body('category').optional().isIn(['Floral', 'Fresh', 'Oriental', 'Citrus', 'Woody', 'Spicy']),
  body('price').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('images').optional().isArray({ min: 1 }),
  body('images.*.url').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin only)
// @access  Private/Admin
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.findAll({
      where: { 
        is_active: true,
        is_featured: true
      },
      include: [
        { model: Brand, as: 'brand', attributes: ['id', 'name'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(products);
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/bestsellers
// @desc    Get bestselling products
// @access  Public
router.get('/bestsellers', async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.findAll({
      where: { 
        is_active: true
      },
      include: [
        { model: Brand, as: 'brand', attributes: ['id', 'name'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] }
      ],
      order: [['sales_count', 'DESC'], ['rating_average', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(products);
  } catch (error) {
    console.error('Get bestsellers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/new-arrivals
// @desc    Get new arrival products
// @access  Public
router.get('/new-arrivals', async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.findAll({
      where: { 
        is_active: true,
        is_new_arrival: true
      },
      include: [
        { model: Brand, as: 'brand', attributes: ['id', 'name'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(products);
  } catch (error) {
    console.error('Get new arrivals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/related/:id
// @desc    Get related products
// @access  Public
router.get('/related/:id', async (req, res) => {
  try {
    const { limit = 4 } = req.query;
    const productId = req.params.id;

    // Get the current product to find related ones
    const currentProduct = await Product.findByPk(productId);
    if (!currentProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const products = await Product.findAll({
      where: { 
        is_active: true,
        id: { [sequelize.Op.ne]: productId },
        [sequelize.Op.or]: [
          { category_id: currentProduct.category_id },
          { brand_id: currentProduct.brand_id }
        ]
      },
      include: [
        { model: Brand, as: 'brand', attributes: ['id', 'name'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] }
      ],
      order: [['rating_average', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(products);
  } catch (error) {
    console.error('Get related products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;