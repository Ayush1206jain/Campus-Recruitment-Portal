/**
 * Campus Recruitment Portal - Backend Server
 * Main entry point for Express.js application
 * Handles API routes, middleware, and database connection
 */

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB();

// Initialize Express application
const app = express();

/**
 * Body Parser Middleware
 * Parse incoming JSON and URL-encoded data
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Security Middleware - Helmet
 * Sets various HTTP headers to protect against common vulnerabilities
 * - XSS attacks
 * - Clickjacking
 * - MIME sniffing
 */
app.use(helmet());

/**
 * CORS (Cross-Origin Resource Sharing)
 * Allow frontend (different origin) to access backend API
 * In production, set FRONTEND_URL to deployed frontend domain
 */
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true // Allow cookies to be sent
}));

/**
 * Development Logging Middleware - Morgan
 * Logs HTTP requests in development mode
 * Helps with debugging API calls
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**
 * Rate Limiting Middleware
 * Prevents brute-force attacks and API abuse
 * Limits: 100 requests per 10 minutes per IP address
 */
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api/', limiter);

/**
 * API Routes
 * Mount route handlers for different endpoints
 */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/student'));
app.use('/api/companies', require('./routes/company'));
app.use('/api/jobs', require('./routes/job'));
app.use('/api/applications', require('./routes/application'));
// Additional routes will be added here (jobs, applications, etc.)

/**
 * Root Route
 * API information endpoint
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Campus Recruitment Portal API',
    version: '1.0.0'
  });
});

/**
 * Error Handler Middleware
 * Must be placed AFTER all routes
 * Catches and formats all errors
 */
app.use(errorHandler);

/**
 * Start Server
 * Listen on specified port from environment or default to 5000
 */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

/**
 * Handle Unhandled Promise Rejections
 * Gracefully shut down server on critical errors
 * Example: Database connection failures
 */
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server and exit process
  server.close(() => process.exit(1));
});
