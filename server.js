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
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// SIMPLIFIED phone validation - just check length
function isValidPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

// Validation rules with 2006 restriction and terms acceptance
const registrationValidation = [
  body('surname')
    .notEmpty()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Surname must be between 2-50 characters'),
    
  body('firstName')
    .notEmpty()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2-50 characters'),
    
  body('middleName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Middle name must be less than 50 characters'),
    
  body('phoneNumber')
    .custom((value) => {
      if (!isValidPhone(value)) {
        throw new Error('Please enter a valid phone number');
      }
      return true;
    }),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
    
  body('dateOfBirth')
    .isISO8601()
    .toDate()
    .withMessage('Please enter a valid date of birth'),
    
  body('graduationYear')
    .custom((value) => {
      const year = parseInt(value);
      if (year !== 2006) {
        throw new Error('Only 2006 graduation set members are eligible for registration');
      }
      return true;
    }),
    
  body('occupation')
    .notEmpty()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Occupation must be between 2-100 characters'),
    
  body('homeAddress')
    .notEmpty()
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Home address must be between 10-200 characters'),

  body('termsAccepted')
    .custom((value) => {
      if (value !== true && value !== 'true' && value !== 'on') {
        throw new Error('You must accept the terms and conditions to continue');
      }
      return true;
    })
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
    console.log('Registration request received:', req.body);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
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
      homeAddress,
      termsAccepted
    } = req.body;

    // Additional server-side validation for 2006 graduation year
    if (graduationYear !== 2006 && graduationYear !== '2006') {
      return res.status(400).json({
        success: false,
        message: 'Only 2006 graduation set members are eligible for registration'
      });
    }

    // Check if terms are accepted
    if (!termsAccepted) {
      return res.status(400).json({
        success: false,
        message: 'You must accept the terms and conditions to continue'
      });
    }

    // Check if email already exists
    const existingMember = await db.getMemberByEmail(email);
    if (existingMember) {
      return res.status(409).json({
        success: false,
        message: 'A member with this email address already exists'
      });
    }

    // Clean phone number
    const cleanedPhone = phoneNumber.replace(/\D/g, '');

    // Generate unique member ID
    const memberId = await db.generateMemberId();

    // Create new member
    const newMember = await db.createMember({
      memberId,
      surname,
      firstName,
      middleName,
      phoneNumber: cleanedPhone,
      email,
      dateOfBirth,
      graduationYear: 2006, // Always 2006
      occupation,
      homeAddress
    });

    console.log('Member created successfully:', newMember);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to ASSA 2006 set!',
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'ASSA 2006 Set Registration System is running',
    timestamp: new Date().toISOString()
  });
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
  console.log(`🚀 ASSA 2006 Set Registration Server running on port ${PORT}`);
  console.log(`📝 Access the registration form at: http://localhost:${PORT}`);
  console.log(`📊 Access the admin dashboard at: http://localhost:${PORT}/admin`);
  console.log(`🏥 Health check at: http://localhost:${PORT}/api/health`);
  console.log(`🎓 Restricted to 2006 graduation set only`);
});

module.exports = app;
