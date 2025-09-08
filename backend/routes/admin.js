const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { 
  User, 
  Product, 
  Order, 
  OrderItem, 
  Category, 
  Brand,
  Review,
  sequelize 
} = require('../models');

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    console.log('Dashboard request from user:', req.user.id, req.user.role);
    
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue
    ] = await Promise.all([
      User.count().catch(err => { console.error('User count error:', err); return 0; }),
      Product.count().catch(err => { console.error('Product count error:', err); return 0; }),
      Order.count().catch(err => { console.error('Order count error:', err); return 0; }),
      Order.sum('total_amount').catch(err => { console.error('Revenue sum error:', err); return 0; })
    ]);

    console.log('Stats calculated:', { totalUsers, totalProducts, totalOrders, totalRevenue });

    // Get recent orders with user details (simplified)
    let recentOrders = [];
    try {
      recentOrders = await Order.findAll({
        limit: 5,
        order: [['created_at', 'DESC']],
        include: [
          {
            model: User,
            attributes: ['name', 'email'],
            required: false // LEFT JOIN instead of INNER JOIN
          }
        ]
      });
      console.log('Recent orders found:', recentOrders.length);
    } catch (orderError) {
      console.error('Recent orders error:', orderError);
      // Fallback: get orders without user details
      recentOrders = await Order.findAll({
        limit: 5,
        order: [['created_at', 'DESC']]
      });
    }

    // Get monthly revenue data for chart (simplified)
    let monthlyRevenue = [];
    try {
      monthlyRevenue = await sequelize.query(`
        SELECT 
          strftime('%Y-%m', created_at) as month,
          SUM(total_amount) as revenue,
          COUNT(*) as orders
        FROM orders 
        WHERE created_at >= date('now', '-12 months')
        GROUP BY strftime('%Y-%m', created_at)
        ORDER BY month DESC
        LIMIT 12
      `, { type: sequelize.QueryTypes.SELECT });
      console.log('Monthly revenue data:', monthlyRevenue.length, 'months');
    } catch (revenueError) {
      console.error('Monthly revenue error:', revenueError);
      monthlyRevenue = [];
    }

    // Get additional analytics
    let lowStockProducts = [];
    let topSellingProducts = [];
    let ordersByStatus = [];
    let paymentMethodStats = [];

    try {
      // Low stock products
      lowStockProducts = await Product.findAll({
        where: {
          stock_quantity: { [sequelize.Op.lte]: 10 }
        },
        attributes: ['id', 'name', 'stock_quantity', 'price'],
        limit: 10,
        order: [['stock_quantity', 'ASC']]
      });

      // Top selling products
      topSellingProducts = await Product.findAll({
        attributes: ['id', 'name', 'sales_count', 'price', 'stock_quantity'],
        order: [['sales_count', 'DESC']],
        limit: 5
      });

      // Orders by status
      ordersByStatus = await sequelize.query(`
        SELECT status, COUNT(*) as count 
        FROM orders 
        GROUP BY status
      `, { type: sequelize.QueryTypes.SELECT });

      // Payment method statistics
      paymentMethodStats = await sequelize.query(`
        SELECT payment_method, COUNT(*) as count, SUM(total_amount) as total_amount
        FROM orders 
        WHERE created_at >= date('now', '-30 days')
        GROUP BY payment_method
        ORDER BY count DESC
      `, { type: sequelize.QueryTypes.SELECT });

    } catch (analyticsError) {
      console.error('Analytics error:', analyticsError);
    }

    const response = {
      stats: {
        totalUsers: totalUsers || 0,
        totalProducts: totalProducts || 0,
        totalOrders: totalOrders || 0,
        totalRevenue: totalRevenue || 0
      },
      recentOrders: recentOrders || [],
      monthlyRevenue: monthlyRevenue || [],
      analytics: {
        lowStockProducts: lowStockProducts || [],
        topSellingProducts: topSellingProducts || [],
        ordersByStatus: ordersByStatus || [],
        paymentMethodStats: paymentMethodStats || []
      }
    };

    console.log('Sending dashboard response');
    res.json(response);
  } catch (error) {
    console.error('Dashboard error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private (Admin only)
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const whereClause = search ? {
      [sequelize.Op.or]: [
        { name: { [sequelize.Op.like]: `%${search}%` } },
        { email: { [sequelize.Op.like]: `%${search}%` } }
      ]
    } : {};

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalUsers: count,
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/products
// @desc    Get all products with pagination
// @access  Private (Admin only)
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const whereClause = search ? {
      [sequelize.Op.or]: [
        { name: { [sequelize.Op.like]: `%${search}%` } },
        { sku: { [sequelize.Op.like]: `%${search}%` } }
      ]
    } : {};

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        { model: Brand, as: 'brand', attributes: ['name'] },
        { model: Category, as: 'category', attributes: ['name'] }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalProducts: count,
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders with pagination
// @access  Private (Admin only)
router.get('/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status || '';

    const whereClause = status ? { status } : {};

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['name', 'price']
            }
          ]
        }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalOrders: count,
        hasNext: page < Math.ceil(count / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
// @access  Private (Admin only)
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({ 
      status,
      shipped_at: status === 'shipped' ? new Date() : order.shipped_at,
      delivered_at: status === 'delivered' ? new Date() : order.delivered_at
    });

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/orders/:id
// @desc    Delete order
// @access  Private (Admin only)
router.delete('/orders/:id', async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          as: 'items'
        }
      ],
      transaction
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Order not found' });
    }

    // Delete order items first
    await OrderItem.destroy({
      where: { order_id: orderId },
      transaction
    });

    // Delete the order
    await order.destroy({ transaction });

    await transaction.commit();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user details
// @access  Private (Admin only)
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, role, is_active } = req.body;
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ name, email, role, is_active });

    res.json({ 
      message: 'User updated successfully', 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user (soft delete)
// @access  Private (Admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Soft delete by setting is_active to false
    await user.update({ is_active: false });

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/products
// @desc    Create new product
// @access  Private (Admin only)
router.post('/products', async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      brand_id,
      category_id,
      sku,
      stock_quantity,
      concentration,
      size_ml,
      perfumer,
      launch_year,
      longevity,
      sillage,
      season,
      occasion,
      is_active,
      is_featured
    } = req.body;

    // Generate SKU if not provided
    const finalSku = sku || `KICI-${Date.now()}`;
    
    // Convert concentration to match enum values
    const concentrationMap = {
      'Parfum': 'parfum',
      'Eau de Parfum': 'eau_de_parfum',
      'Eau de Toilette': 'eau_de_toilette',
      'Eau de Cologne': 'eau_de_cologne',
      'Eau Fraiche': 'eau_fraiche'
    };
    
    const finalConcentration = concentrationMap[concentration] || 'eau_de_parfum';

    const product = await Product.create({
      name,
      description,
      price,
      brand_id,
      category_id,
      sku: finalSku,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      stock_quantity,
      concentration: finalConcentration,
      size_ml,
      perfumer,
      launch_year,
      longevity,
      sillage,
      season,
      occasion,
      is_active: is_active !== undefined ? is_active : true,
      is_featured: is_featured !== undefined ? is_featured : false
    });

    res.status(201).json({ 
      message: 'Product created successfully', 
      product 
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (Admin only)
router.put('/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      brand_id,
      category_id,
      sku,
      stock_quantity,
      concentration,
      size_ml,
      perfumer,
      launch_year,
      longevity,
      sillage,
      season,
      occasion,
      is_active,
      is_featured
    } = req.body;

    // Convert concentration to match enum values
    const concentrationMap = {
      'Parfum': 'parfum',
      'Eau de Parfum': 'eau_de_parfum',
      'Eau de Toilette': 'eau_de_toilette',
      'Eau de Cologne': 'eau_de_cologne',
      'Eau Fraiche': 'eau_fraiche'
    };
    
    const finalConcentration = concentrationMap[concentration] || concentration;

    const updateData = {};
    if (name) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (brand_id) updateData.brand_id = brand_id;
    if (category_id) updateData.category_id = category_id;
    if (sku) updateData.sku = sku;
    if (stock_quantity !== undefined) updateData.stock_quantity = stock_quantity;
    if (concentration) updateData.concentration = finalConcentration;
    if (size_ml) updateData.size_ml = size_ml;
    if (perfumer) updateData.perfumer = perfumer;
    if (launch_year) updateData.launch_year = launch_year;
    if (longevity) updateData.longevity = longevity;
    if (sillage) updateData.sillage = sillage;
    if (season) updateData.season = season;
    if (occasion) updateData.occasion = occasion;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (is_featured !== undefined) updateData.is_featured = is_featured;

    const [updatedRowsCount] = await Product.update(updateData, {
      where: { id }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await Product.findByPk(id, {
      include: [
        { model: Brand, as: 'brand', attributes: ['name'] },
        { model: Category, as: 'category', attributes: ['name'] }
      ]
    });

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
});

// Delete product (Admin only)
router.delete('/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Soft delete by setting is_active to false
    await Product.update({ is_active: false }, { where: { id } });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

// Update user (Admin only)
router.put('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, is_active } = req.body;

    // Prevent admin from changing their own role or deactivating themselves
    if (req.user.id === parseInt(id)) {
      if (role && role !== req.user.role) {
        return res.status(400).json({ message: 'Cannot change your own role' });
      }
      if (is_active === false) {
        return res.status(400).json({ message: 'Cannot deactivate your own account' });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (is_active !== undefined) updateData.is_active = is_active;

    const [updatedRowsCount] = await User.update(updateData, {
      where: { id }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error updating user' });
  }
});

// Delete user (Admin only)
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Soft delete by setting is_active to false
    await User.update({ is_active: false }, { where: { id } });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

module.exports = router;
