const express = require('express');
const { 
  getCompanyProfile, 
  updateCompanyProfile 
} = require('../controllers/companyController');

// Middleware for authentication and authorization
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * Company Profile Routes
 * Base path: /api/companies
 */

// Apply protection to all routes in this file
router.use(protect);

// @route   GET /api/companies/me
// @desc    Get current company's profile
// @access  Private (Company only)
router.get('/me', authorize('company'), getCompanyProfile);

// @route   PUT /api/companies/me
// @desc    Update current company's profile
// @access  Private (Company only)
router.put('/me', authorize('company'), updateCompanyProfile);

module.exports = router;
