const express = require('express');
const {
  getStats,
  getAllUsers,
  verifyCompany,
  deleteUser
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and restricted to 'admin'
router.use(protect);
router.use(authorize('admin')); // Apply admin check to all routes below

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/companies/:id/verify', verifyCompany);
router.delete('/users/:id', deleteUser);

module.exports = router;
