const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token
 * Creates a signed token containing user ID
 * 
 * @param {string} id - User's MongoDB ObjectId
 * @returns {string} Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign(
    { id }, // Payload - contains user id
    process.env.JWT_SECRET, // Secret key for signing
    {
      expiresIn: process.env.JWT_EXPIRE || '7d' // Token expires in 7 days
    }
  );
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 * 
 * Creates user account and role-specific profile (Student/Company)
 * Returns JWT token for immediate authentication
 */
exports.register = async (req, res, next) => {
  try {
    const { 
      name, email, password, role, 
      college, branch, // Student fields
      industry, size   // Company fields
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user in database
    // Password will be automatically hashed by pre-save middleware
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student' // Default to student if role not provided
    });

    // Create role-specific profile
    if (user.role === 'student') {
      // Create empty student profile with default values, or use provided values
      await Student.create({
        user: user._id,
        college: college || '',
        branch: branch || '',
        cgpa: 0,
        graduationYear: new Date().getFullYear()
      });
    } else if (user.role === 'company') {
      // Create empty company profile with default values, or use provided values
      await Company.create({
        user: user._id,
        industry: industry || '',
        size: size || '1-10'
      });
    }
    // Admin role doesn't need a separate profile

    // Generate JWT token
    const token = generateToken(user._id);

    // Send response with token and user info
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    // Pass error to error handler middleware
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 * 
 * Authenticates user with email and password
 * Returns JWT token on successful authentication
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email and include password field
    // Password is excluded by default (select: false in schema)
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials' // Generic message for security
      });
    }

    // Compare entered password with hashed password in database
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials' // Generic message for security
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Send response with token and user info
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    // Pass error to error handler middleware
    next(error);
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private (requires authentication)
 * 
 * Returns current user's information
 * User is attached to req.user by protect middleware
 */
exports.getMe = async (req, res, next) => {
  try {
    // req.user is set by protect middleware
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    // Pass error to error handler middleware
    next(error);
  }
};
