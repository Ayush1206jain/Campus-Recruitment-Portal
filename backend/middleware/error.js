/**
 * Centralized Error Handler Middleware
 * Catches all errors passed via next(error) from controllers
 * Formats errors into consistent JSON responses
 * 
 * Must be placed AFTER all routes in server.js
 * Usage: app.use(errorHandler);
 */
const errorHandler = (err, req, res, next) => {
  // Create error object copy
  let error = { ...err };
  error.message = err.message;

  // Log error to console for debugging (in development)
  console.error(err);

  // Mongoose bad ObjectId (invalid ID format)
  // Example: /api/users/invalidid123
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key error (unique constraint violation)
  // Example: Registering with existing email
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error (schema validation failed)
  // Example: Missing required fields, invalid email format
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
