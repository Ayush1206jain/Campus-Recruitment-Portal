const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Model
 * Base authentication model for all user types (student, company, admin)
 * Handles core authentication fields and password hashing
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true, // Remove whitespace from both ends
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true, // Creates unique index - prevents duplicate emails
    lowercase: true, // Convert to lowercase before saving
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries by default (security)
  },
  role: {
    type: String,
    enum: ['student', 'company', 'admin'], // Only these values allowed
    default: 'student'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Pre-save Middleware
 * Automatically hash password before saving to database
 * Only runs when password is new or modified
 */
userSchema.pre('save', async function(next) {
  // Only hash if password is modified (not on every save)
  if (!this.isModified('password')) {
    next();
  }

  // Generate salt with 10 rounds (higher = more secure but slower)
  const salt = await bcrypt.genSalt(10);
  // Hash password with salt
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance Method: Compare Password
 * Compare entered password with hashed password in database
 * @param {string} enteredPassword - Plain text password from login
 * @returns {boolean} - True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
