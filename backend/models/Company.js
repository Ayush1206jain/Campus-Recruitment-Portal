const mongoose = require('mongoose');

/**
 * Company Model
 * Extended profile for users with 'company' role
 * Contains company information and verification status
 */
const companySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
    unique: true // One company profile per user
  },
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please provide a valid URL'] // Must start with http:// or https://
  },
  industry: {
    type: String,
    // required: [true, 'Please provide industry type']
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-100', '101-500', '500+'], // Company size categories
    // required: [true, 'Please provide company size']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  logo: {
    type: String, // Cloudinary URL for company logo
    default: null
  },
  verified: {
    type: Boolean,
    default: false // Admin must verify company before they can post jobs
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Pre-save Middleware
 * Update the updatedAt timestamp whenever document is saved
 */
companySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Company', companySchema);
