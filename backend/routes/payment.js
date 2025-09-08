const express = require('express');
const { body, validationResult } = require('express-validator');
// Initialize Stripe with environment variable or null for testing
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey && stripeSecretKey !== 'sk_test_your_stripe_secret_key_here' 
  ? require('stripe')(stripeSecretKey) 
  : null;
const { Cart, CartItem, Product, Order, OrderItem, User, sequelize } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payment/create-payment-intent
// @desc    Create Stripe payment intent for cart checkout
// @access  Private
router.post('/create-payment-intent', authenticateToken, [
  body('shipping_address').isObject().withMessage('Shipping address is required'),
  body('billing_address').optional().isObject()
], async (req, res) => {
  try {
    // Check if Stripe is properly configured
    if (!stripe) {
      return res.status(503).json({
        message: 'Payment service not configured',
        error: 'Stripe API key not set. Please configure STRIPE_SECRET_KEY in environment variables.',
        setup_required: true
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { shipping_address, billing_address } = req.body;

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
      ]
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const cartItem of cart.items) {
      const product = cartItem.product;
      
      if (!product.is_active) {
        return res.status(400).json({ 
          message: `Product ${product.name} is no longer available` 
        });
      }

      if (product.stock_quantity < cartItem.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock_quantity}` 
        });
      }

      const itemTotal = parseFloat(product.price) * cartItem.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product_id: product.id,
        quantity: cartItem.quantity,
        price: product.price,
        product_snapshot: {
          name: product.name,
          sku: product.sku,
          concentration: product.concentration,
          size: product.size
        }
      });
    }

    // Calculate shipping and tax (Indian standards)
    const shipping_cost = subtotal > 2000 ? 0 : 99; // Free shipping over ₹2000
    const tax_amount = subtotal * 0.18; // 18% GST
    const total_amount = subtotal + shipping_cost + tax_amount;

    // Convert to paise (Stripe requires amount in smallest currency unit)
    const amountInPaise = Math.round(total_amount * 100);

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise,
      currency: 'inr',
      metadata: {
        user_id: req.user.id.toString(),
        cart_id: cart.id.toString(),
        subtotal: subtotal.toString(),
        shipping_cost: shipping_cost.toString(),
        tax_amount: tax_amount.toString(),
        total_amount: total_amount.toString()
      },
      shipping: {
        name: shipping_address.full_name,
        address: {
          line1: shipping_address.address_line_1,
          line2: shipping_address.address_line_2 || null,
          city: shipping_address.city,
          state: shipping_address.state,
          postal_code: shipping_address.postal_code,
          country: 'IN'
        }
      },
      description: `Kici Perfume Order - ${cart.items.length} items`
    });

    res.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      amount: total_amount,
      currency: 'INR',
      order_summary: {
        subtotal,
        shipping_cost,
        tax_amount,
        total_amount,
        items: orderItems.length
      }
    });

  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ 
      message: 'Failed to create payment intent',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/payment/confirm-payment
// @desc    Confirm payment and create order
// @access  Private
router.post('/confirm-payment', authenticateToken, [
  body('payment_intent_id').notEmpty().withMessage('Payment intent ID is required'),
  body('shipping_address').isObject().withMessage('Shipping address is required'),
  body('billing_address').optional().isObject()
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

    const { payment_intent_id, shipping_address, billing_address } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status !== 'succeeded') {
      await transaction.rollback();
      return res.status(400).json({ 
        message: 'Payment not completed',
        payment_status: paymentIntent.status
      });
    }

    // Verify payment belongs to this user
    if (paymentIntent.metadata.user_id !== req.user.id.toString()) {
      await transaction.rollback();
      return res.status(403).json({ message: 'Unauthorized payment' });
    }

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

    // Extract amounts from payment intent metadata
    const subtotal = parseFloat(paymentIntent.metadata.subtotal);
    const shipping_cost = parseFloat(paymentIntent.metadata.shipping_cost);
    const tax_amount = parseFloat(paymentIntent.metadata.tax_amount);
    const total_amount = parseFloat(paymentIntent.metadata.total_amount);

    // Generate order number
    const order_number = `KICI-${Date.now()}-${req.user.id}`;

    // Create order
    const order = await Order.create({
      user_id: req.user.id,
      order_number,
      subtotal_amount: subtotal,
      tax_amount,
      shipping_cost,
      total_amount,
      payment_method: 'stripe',
      payment_status: 'paid',
      payment_intent_id: payment_intent_id,
      shipping_address: shipping_address,
      billing_address: billing_address || shipping_address,
      status: 'confirmed'
    }, { transaction });

    // Create order items and update stock
    for (const cartItem of cart.items) {
      const product = cartItem.product;
      
      // Create order item
      await OrderItem.create({
        order_id: order.id,
        product_id: product.id,
        quantity: cartItem.quantity,
        price: product.price,
        product_snapshot: {
          name: product.name,
          sku: product.sku,
          concentration: product.concentration,
          size: product.size
        }
      }, { transaction });

      // Update product stock and sales count
      await Product.update({
        stock_quantity: sequelize.literal(`stock_quantity - ${cartItem.quantity}`),
        sales_count: sequelize.literal(`sales_count + ${cartItem.quantity}`)
      }, {
        where: { id: product.id },
        transaction
      });
    }

    // Clear cart
    await CartItem.destroy({
      where: { cart_id: cart.id },
      transaction
    });

    await transaction.commit();

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order.id,
        order_number: order.order_number,
        total_amount: order.total_amount,
        status: order.status,
        payment_status: order.payment_status,
        created_at: order.created_at
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Confirm payment error:', error);
    res.status(500).json({ 
      message: 'Failed to process payment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/payment/config
// @desc    Get Stripe publishable key
// @access  Public
router.get('/config', (req, res) => {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  
  if (!publishableKey || publishableKey === 'pk_test_your_stripe_publishable_key_here') {
    return res.status(503).json({
      message: 'Payment service not configured',
      error: 'Stripe publishable key not set. Please configure STRIPE_PUBLISHABLE_KEY in environment variables.',
      setup_required: true
    });
  }
  
  res.json({
    publishable_key: publishableKey,
    configured: true
  });
});

// @route   POST /api/payment/webhook
// @desc    Handle Stripe webhooks
// @access  Public (but verified with Stripe signature)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // Update order status if needed
      try {
        await Order.update(
          { payment_status: 'paid' },
          { where: { payment_intent_id: paymentIntent.id } }
        );
      } catch (error) {
        console.error('Error updating order after payment success:', error);
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      
      // Update order status
      try {
        await Order.update(
          { payment_status: 'failed' },
          { where: { payment_intent_id: failedPayment.id } }
        );
      } catch (error) {
        console.error('Error updating order after payment failure:', error);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
