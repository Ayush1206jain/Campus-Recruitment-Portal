const express = require('express');
const { 
  getCompanyProfile, 
  updateCompanyProfile,
  uploadLogo
} = require('../controllers/companyController');

// Middleware for authentication and authorization
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

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

// @route   POST /api/companies/logo
// @desc    Upload company logo (Image)
// @access  Private (Company only)
router.post('/logo', authorize('company'), upload.single('logo'), uploadLogo);

module.exports = router;
