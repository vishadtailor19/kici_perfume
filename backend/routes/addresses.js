const express = require('express');
const { body, validationResult } = require('express-validator');
const { Address, User, sequelize } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/addresses
// @desc    Create new address
// @access  Private
router.post('/', authenticateToken, [
  body('full_name').optional().trim().isLength({ min: 2 }),
  body('first_name').optional().trim().isLength({ min: 1 }),
  body('last_name').optional().trim().isLength({ min: 1 }),
  body('address_line_1').trim().isLength({ min: 5 }).withMessage('Address line 1 is required'),
  body('city').trim().isLength({ min: 2 }).withMessage('City is required'),
  body('state').trim().isLength({ min: 2 }).withMessage('State is required'),
  body('postal_code').isLength({ min: 6, max: 6 }).withMessage('Valid 6-digit postal code is required'),
  body('phone').optional().matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit mobile number is required')
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
      full_name,
      first_name,
      last_name,
      address_line_1,
      address_line_2,
      city,
      state,
      postal_code,
      phone,
      is_default
    } = req.body;

    // Handle full_name or first_name/last_name
    let firstName, lastName;
    if (full_name) {
      const nameParts = full_name.trim().split(' ');
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(' ') || nameParts[0];
    } else {
      firstName = first_name || 'User';
      lastName = last_name || '';
    }

    // If this is set as default, unset other default addresses
    if (is_default) {
      await Address.update(
        { is_default: false },
        { where: { user_id: req.user.id } }
      );
    }

    const address = await Address.create({
      user_id: req.user.id,
      first_name: firstName,
      last_name: lastName,
      address_line_1,
      address_line_2: address_line_2 || null,
      city,
      state,
      postal_code,
      country: 'India',
      phone: phone || null,
      is_default: is_default || false,
      is_active: true
    });

    res.status(201).json({
      message: 'Address created successfully',
      address
    });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/addresses
// @desc    Get user's addresses
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const addresses = await Address.findAll({
      where: { user_id: req.user.id },
      order: [['is_default', 'DESC'], ['created_at', 'DESC']]
    });

    res.json({ addresses });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/addresses/:id
// @desc    Update address
// @access  Private
router.put('/:id', authenticateToken, [
  body('full_name').optional().trim().isLength({ min: 2 }),
  body('address_line_1').optional().trim().isLength({ min: 5 }),
  body('city').optional().trim().isLength({ min: 2 }),
  body('state').optional().trim().isLength({ min: 2 }),
  body('postal_code').optional().isLength({ min: 6, max: 6 }),
  body('phone').optional().matches(/^[6-9]\d{9}$/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const address = await Address.findOne({
      where: { 
        id: req.params.id,
        user_id: req.user.id 
      }
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If setting as default, unset other defaults
    if (req.body.is_default) {
      await Address.update(
        { is_default: false },
        { where: { user_id: req.user.id, id: { [sequelize.Op.ne]: req.params.id } } }
      );
    }

    await address.update(req.body);

    res.json({
      message: 'Address updated successfully',
      address
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/addresses/:id
// @desc    Delete address
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const address = await Address.findOne({
      where: { 
        id: req.params.id,
        user_id: req.user.id 
      }
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    await address.destroy();

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
