const express = require('express');
const { body, validationResult } = require('express-validator');
const { Contact } = require('../models');
const nodemailer = require('nodemailer');

const router = express.Router();

// Email configuration (you'll need to set up your email service)
const createTransporter = () => {
  // For Gmail (you'll need to enable "Less secure app access" or use App Password)
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });

  // Alternative: For other email services
  // return nodemailer.createTransport({
  //   host: 'smtp.your-email-provider.com',
  //   port: 587,
  //   secure: false,
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASS
  //   }
  // });
};

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9')
    .isLength({ min: 10, max: 10 })
    .withMessage('Phone number must be exactly 10 digits'),
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;

    // Save to database
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      status: 'new',
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    });

    // Send email notification to admin
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@kiciperfume.com',
        to: process.env.ADMIN_EMAIL || 'admin@kiciperfume.com',
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Contact Details:</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
            </div>
            
            <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h3 style="color: #374151; margin-top: 0;">Message:</h3>
              <p style="line-height: 1.6; color: #4b5563;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-radius: 8px;">
              <p style="margin: 0; color: #92400e;">
                <strong>Action Required:</strong> Please respond to this inquiry within 24 hours.
              </p>
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; text-align: center;">
              This email was automatically generated from the Kici Perfume contact form.<br>
              Contact ID: #${contact.id}
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`Contact form email sent for submission #${contact.id}`);
    } catch (emailError) {
      console.error('Failed to send contact form email:', emailError);
      // Don't fail the request if email fails, just log it
    }

    // Send auto-reply to customer
    try {
      const transporter = createTransporter();
      
      const autoReplyOptions = {
        from: process.env.EMAIL_USER || 'noreply@kiciperfume.com',
        to: email,
        subject: 'Thank you for contacting Kici Perfume',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">Kici Perfume</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">A perfume studio</p>
            </div>
            
            <div style="padding: 30px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <h2 style="color: #374151; margin-top: 0;">Thank you for reaching out!</h2>
              
              <p style="color: #4b5563; line-height: 1.6;">
                Dear ${name},
              </p>
              
              <p style="color: #4b5563; line-height: 1.6;">
                We have received your message regarding "<strong>${subject}</strong>" and appreciate you taking the time to contact us.
              </p>
              
              <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
                <p style="margin: 0; color: #0c4a6e;">
                  <strong>What happens next?</strong><br>
                  Our customer service team will review your message and respond within 24 hours during business hours (Monday-Saturday, 10 AM - 8 PM IST).
                </p>
              </div>
              
              <p style="color: #4b5563; line-height: 1.6;">
                If you have any urgent concerns, please feel free to call us at <strong>+91 98765 43210</strong>.
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #4b5563; line-height: 1.6; margin-bottom: 0;">
                  Best regards,<br>
                  <strong>The Kici Perfume Team</strong>
                </p>
              </div>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
              <p style="margin: 0;">
                Kici Perfume | Sahid Park Road, Opp. Nikunj Plaza, Nr. DB Jewellers, Dungarpur, Rajasthan 314001<br>
                Phone: +91 91161 61630 | Email: support@herbytots.com
              </p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(autoReplyOptions);
      console.log(`Auto-reply sent to ${email} for contact #${contact.id}`);
    } catch (emailError) {
      console.error('Failed to send auto-reply email:', emailError);
    }

    res.status(201).json({
      message: 'Thank you for your message! We will get back to you within 24 hours.',
      contact_id: contact.id
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ 
      message: 'Failed to submit your message. Please try again or contact us directly.' 
    });
  }
});

// @route   GET /api/contact
// @desc    Get all contact form submissions (Admin only)
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    
    if (status && ['new', 'in_progress', 'resolved', 'closed'].includes(status)) {
      whereClause.status = status;
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { subject: { [Op.iLike]: `%${search}%` } },
        { message: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: contacts } = await Contact.findAndCountAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      contacts,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / limit),
        total_items: count,
        items_per_page: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/contact/:id/status
// @desc    Update contact status (Admin only)
// @access  Private/Admin
router.put('/:id/status', [
  body('status').isIn(['new', 'in_progress', 'resolved', 'closed']).withMessage('Invalid status'),
  body('admin_notes').optional().trim().isLength({ max: 1000 }).withMessage('Admin notes too long')
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
    const { status, admin_notes } = req.body;

    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await contact.update({
      status,
      admin_notes,
      updated_at: new Date()
    });

    res.json({
      message: 'Contact status updated successfully',
      contact
    });

  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

