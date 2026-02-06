const mongoose = require('mongoose');

/**
 * Student Model
 * Extended profile for users with 'student' role
 * Contains academic and personal information for placement purposes
 */
const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
    unique: true // One student profile per user
  },
  phone: {
    type: String,
    match: [/^[+]?[\d\s\-()]+$/, 'Please provide a valid phone number']
  },
  college: {
    type: String,
    // required: [true, 'Please provide college name'] - Removed for initial registration
  },
  branch: {
    type: String,
    // required: [true, 'Please provide branch/department']
  },
  cgpa: {
    type: Number,
    min: [0, 'CGPA cannot be negative'],
    max: [10, 'CGPA cannot be more than 10'], // Assuming 10-point scale
    default: 0
  },
  graduationYear: {
    type: Number,
    // required: [true, 'Please provide graduation year'],
    min: [2020, 'Invalid graduation year'],
    max: [2030, 'Invalid graduation year']
  },
  skills: [{
    type: String,
    trim: true // Array of skills (e.g., JavaScript, Python, React)
  }],
  resume: {
    type: String, // Cloudinary URL for uploaded resume
    default: null
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
studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Student', studentSchema);
