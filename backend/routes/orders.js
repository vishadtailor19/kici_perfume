const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Order, OrderItem, Product, User, Cart, CartItem, sequelize } = require('../models');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order from cart
// @access  Private
router.post('/', authenticateToken, [
  body('payment_method').isIn(['credit_card', 'debit_card', 'paypal', 'stripe', 'cash_on_delivery']).withMessage('Invalid payment method'),
  body('shipping_address_id').isInt({ min: 1 }).withMessage('Valid shipping address ID is required'),
  body('billing_address_id').optional().isInt({ min: 1 })
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

    const { payment_method, shipping_address_id, billing_address_id, notes } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            { model: Product, as: 'product' }
          ]
        }
      ],
      transaction
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate stock and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const cartItem of cart.items) {
      const product = cartItem.product;
      
      if (!product.is_active) {
        await transaction.rollback();
        return res.status(400).json({ 
          message: `Product ${product.name} is no longer available` 
        });
      }

      if (product.stock_quantity < cartItem.quantity) {
        await transaction.rollback();
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock_quantity}` 
        });
      }

      const itemTotal = parseFloat(product.price) * cartItem.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product_id: product.id,
        quantity: cartItem.quantity,
        unit_price: product.price,
        total_price: itemTotal,
        product_snapshot: {
          name: product.name,
          sku: product.sku,
          concentration: product.concentration,
          size_ml: product.size_ml
        }
      });
    }

    // Calculate shipping and tax
    const shipping_cost = subtotal >= 50 ? 0 : 9.99;
    const tax_amount = subtotal * 0.08; // 8% tax
    const total_amount = subtotal + shipping_cost + tax_amount;

    // Generate order number
    const order_number = `ORD-${Date.now()}-${req.user.id}`;

    // Create order
    const order = await Order.create({
      user_id: req.user.id,
      order_number,
      subtotal_amount: subtotal,
      tax_amount,
      shipping_cost,
      total_amount,
      payment_method,
      shipping_address_id,
      billing_address_id: billing_address_id || shipping_address_id,
      notes,
      status: 'pending'
    }, { transaction });

    // Create order items
    for (const item of orderItems) {
      await OrderItem.create({
        order_id: order.id,
        ...item
      }, { transaction });
    }

    // Update product stock and sales count
    for (const cartItem of cart.items) {
      await Product.update({
        stock_quantity: sequelize.literal(`stock_quantity - ${cartItem.quantity}`),
        sales_count: sequelize.literal(`sales_count + ${cartItem.quantity}`)
      }, {
        where: { id: cartItem.product_id },
        transaction
      });
    }

    // Clear cart
    await CartItem.destroy({
      where: { cart_id: cart.id },
      transaction
    });

    await transaction.commit();

    // Return order with details
    const orderWithDetails = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            { model: Product, as: 'product', attributes: ['id', 'name', 'price'] }
          ]
        }
      ]
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: orderWithDetails
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/orders/:id/cancel
// @desc    Cancel order (user can cancel if status is 'pending' or 'confirmed')
// @access  Private
router.patch('/:id/cancel', authenticateToken, [
  body('reason').optional().isString().trim().isLength({ max: 500 })
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
    
    const { id } = req.params;
    const { reason } = req.body;
    
    // Find the order
    const order = await Order.findOne({
      where: { 
        id,
        user_id: req.user.id // Ensure user can only cancel their own orders
      },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        }
      ],
      transaction
    });
    
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Check if order can be cancelled
    const cancellableStatuses = ['pending', 'confirmed'];
    if (!cancellableStatuses.includes(order.status)) {
      await transaction.rollback();
      return res.status(400).json({ 
        error: `Cannot cancel order with status: ${order.status}. Order can only be cancelled when status is pending or confirmed.` 
      });
    }
    
    // Update order status
    await order.update({
      status: 'cancelled',
      cancellation_reason: reason || 'Cancelled by customer',
      cancelled_at: new Date()
    }, { transaction });
    
    // Restore product stock
    for (const item of order.items) {
      if (item.product) {
        await Product.update({
          stock_quantity: sequelize.literal(`stock_quantity + ${item.quantity}`),
          sales_count: sequelize.literal(`GREATEST(sales_count - ${item.quantity}, 0)`)
        }, {
          where: { id: item.product.id },
          transaction
        });
      }
    }
    
    await transaction.commit();
    
    res.json({
      message: 'Order cancelled successfully',
      order: {
        id: order.id,
        order_number: order.order_number,
        status: order.status,
        cancellation_reason: order.cancellation_reason,
        cancelled_at: order.cancelled_at
      }
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', authenticateToken, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Invalid query parameters', 
        errors: errors.array() 
      });
    }

    const { page = 1, limit = 10, status } = req.query;

    const whereClause = { user_id: req.user.id };
    if (status) whereClause.status = status;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            { model: Product, as: 'product', attributes: ['id', 'name', 'price'] }
          ]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalOrders: count,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name brand images')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private/Admin
router.put('/:id/status', authenticateToken, requireAdmin, [
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status'),
  body('trackingNumber').optional().trim().isLength({ min: 1 }),
  body('estimatedDelivery').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { status, trackingNumber, estimatedDelivery } = req.body;

    const updateData = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (estimatedDelivery) updateData.estimatedDelivery = new Date(estimatedDelivery);
    if (status === 'delivered') updateData.deliveredAt = new Date();

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('items.product', 'name brand images');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/admin/all', authenticateToken, requireAdmin, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Invalid query parameters', 
        errors: errors.array() 
      });
    }

    const { page = 1, limit = 20, status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, totalCount] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .populate('items.product', 'name brand')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalOrders: totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Cancel order
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only allow cancellation of pending or confirmed orders
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel order in current status' });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;