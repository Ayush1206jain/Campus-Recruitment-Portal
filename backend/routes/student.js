const express = require('express');
const { 
  getStudentProfile, 
  updateStudentProfile,
  uploadResume
} = require('../controllers/studentController');

// Middleware for authentication and authorization
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

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

// @route   POST /api/students/resume
// @desc    Upload student resume (PDF)
// @access  Private (Student only)
router.post('/resume', authorize('student'), upload.single('resume'), uploadResume);

module.exports = router;
