const mongoose = require('mongoose');

/**
 * Job Model
 * Stores details of job postings created by companies.
 */
const jobSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide job title'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide job description'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  requirements: {
    type: String, // Can be text or bullet points
    required: [true, 'Please provide job requirements/skills']
  },
  location: {
    type: String,
    required: [true, 'Please provide job location']
  },
  salary: {
    type: String, // e.g., "12 LPA", "Not Disclosed"
    required: [true, 'Please provide salary details']
  },
  type: {
    type: String,
    enum: ['Full-time', 'Internship', 'Contract'],
    default: 'Full-time'
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide application deadline']
  },
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);
