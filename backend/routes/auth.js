const express = require('express');
const {
  register,
  login,
  getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * Authentication Routes
 * Base path: /api/auth
 */

// @route   POST /api/auth/register
// @desc    Register new user (student, company, or admin)
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user and get JWT token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get current logged in user details
// @access  Private (requires JWT token)
router.get('/me', protect, getMe);

module.exports = router;
