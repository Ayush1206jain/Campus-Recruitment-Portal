const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect Middleware
 * Verifies JWT token and authenticates user
 * Attaches user object to request for use in subsequent middleware/controllers
 * 
 * Usage: router.get('/profile', protect, getProfile)
 */
exports.protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  // Expected format: "Authorization: Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extract token from "Bearer <token>"
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token using JWT_SECRET from environment variables
    // Returns decoded payload (contains user id)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database using id from token
    req.user = await User.findById(decoded.id);

    // Check if user still exists (could be deleted after token was issued)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // User authenticated, proceed to next middleware
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

/**
 * Authorize Middleware
 * Grant access to specific roles only
 * Must be used after protect middleware (requires req.user)
 * 
 * Usage: router.post('/jobs', protect, authorize('company'), createJob)
 * 
 * @param {...string} roles - Allowed roles (e.g., 'student', 'company', 'admin')
 * @returns {function} Middleware function
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user's role is in the allowed roles array
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    // User has required role, proceed
    next();
  };
};
