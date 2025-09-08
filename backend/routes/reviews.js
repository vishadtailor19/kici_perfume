const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Review, Product, User, Brand, Category } = require('../models');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reviews/product/:productId
// @desc    Get reviews for a specific product
// @access  Public
router.get('/product/:productId', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('rating').optional().isInt({ min: 1, max: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Invalid query parameters', 
        errors: errors.array() 
      });
    }

    const { productId } = req.params;
    const { page = 1, limit = 10, rating } = req.query;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const whereClause = { 
      product_id: productId,
      is_approved: true 
    };
    
    if (rating) {
      whereClause.rating = rating;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    // Calculate rating statistics
    const ratingStats = await Review.findAll({
      where: { product_id: productId, is_approved: true },
      attributes: [
        'rating',
        [Review.sequelize.fn('COUNT', Review.sequelize.col('rating')), 'count']
      ],
      group: ['rating'],
      raw: true
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalReviews: count,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      },
      ratingStats
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', authenticateToken, [
  body('product_id').isInt({ min: 1 }).withMessage('Valid product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('comment').trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters'),
  body('longevity_rating').optional().isInt({ min: 1, max: 5 }),
  body('sillage_rating').optional().isInt({ min: 1, max: 5 }),
  body('value_rating').optional().isInt({ min: 1, max: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const {
      product_id,
      rating,
      title,
      comment,
      longevity_rating,
      sillage_rating,
      value_rating,
      would_recommend
    } = req.body;

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product || !product.is_active) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      where: { 
        user_id: req.user.id, 
        product_id: product_id 
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Create review
    const review = await Review.create({
      user_id: req.user.id,
      product_id,
      rating,
      title,
      comment,
      longevity_rating,
      sillage_rating,
      value_rating,
      would_recommend: would_recommend || false,
      is_approved: true // Auto-approve for now, can be changed to false for moderation
    });

    // Update product rating average
    const avgRating = await Review.findOne({
      where: { product_id, is_approved: true },
      attributes: [
        [Review.sequelize.fn('AVG', Review.sequelize.col('rating')), 'avgRating'],
        [Review.sequelize.fn('COUNT', Review.sequelize.col('rating')), 'reviewCount']
      ],
      raw: true
    });

    await product.update({
      rating_average: parseFloat(avgRating.avgRating).toFixed(1),
      rating_count: parseInt(avgRating.reviewCount)
    });

    // Return review with user details
    const reviewWithUser = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name']
        }
      ]
    });

    res.status(201).json({
      message: 'Review created successfully',
      review: reviewWithUser
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update user's own review
// @access  Private
router.put('/:id', authenticateToken, [
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('title').optional().trim().isLength({ min: 1, max: 100 }),
  body('comment').optional().trim().isLength({ min: 10, max: 1000 }),
  body('longevity_rating').optional().isInt({ min: 1, max: 5 }),
  body('sillage_rating').optional().isInt({ min: 1, max: 5 }),
  body('value_rating').optional().isInt({ min: 1, max: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { id } = req.params;

    // Find review and verify ownership
    const review = await Review.findOne({
      where: { 
        id, 
        user_id: req.user.id 
      }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update review
    await review.update(req.body);

    // Recalculate product rating if rating was updated
    if (req.body.rating) {
      const avgRating = await Review.findOne({
        where: { product_id: review.product_id, is_approved: true },
        attributes: [
          [Review.sequelize.fn('AVG', Review.sequelize.col('rating')), 'avgRating'],
          [Review.sequelize.fn('COUNT', Review.sequelize.col('rating')), 'reviewCount']
        ],
        raw: true
      });

      await Product.update({
        rating_average: parseFloat(avgRating.avgRating).toFixed(1),
        rating_count: parseInt(avgRating.reviewCount)
      }, {
        where: { id: review.product_id }
      });
    }

    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete user's own review
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Find review and verify ownership
    const review = await Review.findOne({
      where: { 
        id, 
        user_id: req.user.id 
      }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const productId = review.product_id;
    await review.destroy();

    // Recalculate product rating
    const avgRating = await Review.findOne({
      where: { product_id: productId, is_approved: true },
      attributes: [
        [Review.sequelize.fn('AVG', Review.sequelize.col('rating')), 'avgRating'],
        [Review.sequelize.fn('COUNT', Review.sequelize.col('rating')), 'reviewCount']
      ],
      raw: true
    });

    await Product.update({
      rating_average: avgRating.avgRating ? parseFloat(avgRating.avgRating).toFixed(1) : 0,
      rating_count: parseInt(avgRating.reviewCount) || 0
    }, {
      where: { id: productId }
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reviews/user
// @desc    Get current user's reviews
// @access  Private
router.get('/user', authenticateToken, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Invalid query parameters', 
        errors: errors.array() 
      });
    }

    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price'],
          include: [
            { model: Brand, as: 'brand', attributes: ['name'] }
          ]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalReviews: count,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
