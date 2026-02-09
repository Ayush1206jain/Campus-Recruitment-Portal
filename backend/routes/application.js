const express = require('express');
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * Application Routes
 * Base path: /api/applications
 */

// Student Routes
router.post('/apply/:jobId', protect, authorize('student'), applyForJob); // Apply to a job
router.get('/my-applications', protect, authorize('student'), getMyApplications); // View my history

// Company Routes
router.get('/job/:jobId', protect, authorize('company'), getJobApplications); // View applicants for a job
router.put('/:id/status', protect, authorize('company'), updateApplicationStatus); // Update status (Shortlist/Reject etc)

module.exports = router;
