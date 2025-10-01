const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const path = require('path');
const Database = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
const db = new Database();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Validation rules
const registrationValidation = [
  body('surname').notEmpty().trim().isLength({ min: 2, max: 50 }).withMessage('Surname must be between 2-50 characters'),
  body('firstName').notEmpty().trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2-50 characters'),
  body('middleName').optional().trim().isLength({ max: 50 }).withMessage('Middle name must be less than 50 characters'),
  body('phoneNumber').matches(/^(\+234|234|0)?[789][01]\d{8}$/).withMessage('Please enter a valid Nigerian phone number'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address'),
  body('dateOfBirth').isISO8601().toDate().withMessage('Please enter a valid date of birth'),
  body('graduationYear').isInt({ min: 1960, max: new Date().getFullYear() }).withMessage('Please enter a valid graduation year'),
  body('occupation').notEmpty().trim().isLength({ min: 2, max: 100 }).withMessage('Occupation must be between 2-100 characters'),
  body('homeAddress').notEmpty().trim().isLength({ min: 10, max: 200 }).withMessage('Home address must be between 10-200 characters')
];

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Admin dashboard
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Register new member
app.post('/api/register', registrationValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const {
      surname,
      firstName,
      middleName,
      phoneNumber,
      email,
      dateOfBirth,
      graduationYear,
      occupation,
      homeAddress
    } = req.body;

    // Check if email already exists
    const existingMember = await db.getMemberByEmail(email);
    if (existingMember) {
      return res.status(409).json({
        success: false,
        message: 'A member with this email address already exists'
      });
    }

    // Generate unique member ID
    const memberId = await db.generateMemberId();

    // Create new member
    const newMember = await db.createMember({
      memberId,
      surname,
      firstName,
      middleName,
      phoneNumber,
      email,
      dateOfBirth,
      graduationYear,
      occupation,
      homeAddress
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        memberId: newMember.memberId,
        fullName: `${firstName} ${middleName ? middleName + ' ' : ''}${surname}`
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

// Get all members (for admin purposes)
app.get('/api/members', async (req, res) => {
  try {
    const members = await db.getAllMembers();
    res.json({
      success: true,
      data: members
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching members'
    });
  }
});

// Get member statistics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await db.getStatistics();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ASSA Registration Server running on port ${PORT}`);
  console.log(`📝 Access the registration form at: http://localhost:${PORT}`);
});

module.exports = app;
