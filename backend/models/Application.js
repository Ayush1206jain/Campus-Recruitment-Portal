const mongoose = require('mongoose');

/**
 * Application Model
 * Stores the relationship between a Student and a Job.
 * Tracks the status of the application.
 */
const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Interviewing', 'Rejected', 'Hired'],
    default: 'Applied'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent a student from applying to the same job twice
applicationSchema.index({ job: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
