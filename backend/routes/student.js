const express = require('express');
const { 
  getStudentProfile, 
  updateStudentProfile 
} = require('../controllers/studentController');

// Middleware for authentication and authorization
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * Student Profile Routes
 * Base path: /api/students
 */

// Apply protection to all routes in this file
// User must be logged in for any of these endpoints
router.use(protect);

// @route   GET /api/students/me
// @desc    Get current student's profile
// @access  Private (Student only)
router.get('/me', authorize('student'), getStudentProfile);

// @route   PUT /api/students/me
// @desc    Update current student's profile
// @access  Private (Student only)
router.put('/me', authorize('student'), updateStudentProfile);

module.exports = router;
