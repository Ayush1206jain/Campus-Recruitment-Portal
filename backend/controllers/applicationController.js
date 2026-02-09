const Application = require('../models/Application');
const Job = require('../models/Job');
const Student = require('../models/Student');
const Company = require('../models/Company');

/**
 * @desc    Apply for a job
 * @route   POST /api/applications/apply/:jobId
 * @access  Private (Student only)
 */
exports.applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // 1. Get the student profile of the logged-in user
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // 2. Check if job exists and is Open
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    if (job.status !== 'Open') {
      return res.status(400).json({ success: false, message: 'This job is no longer accepting applications' });
    }

    // 3. Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      student: student._id
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    // 4. Create Application
    const application = await Application.create({
      job: jobId,
      student: student._id
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my applications
 * @route   GET /api/applications/my-applications
 * @access  Private (Student only)
 */
exports.getMyApplications = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const applications = await Application.find({ student: student._id })
      .populate({
        path: 'job',
        select: 'title company location salary status type',
        populate: { path: 'company', select: 'name logo' }
      })
      .sort('-appliedAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get applicants for a specific job
 * @route   GET /api/applications/job/:jobId
 * @access  Private (Company only)
 */
exports.getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // 1. Verify Company
    const company = await Company.findOne({ user: req.user.id });
    if (!company) return res.status(404).json({ message: 'Company not found' });

    // 2. Verifica Job Ownership
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.company.toString() !== company._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view applications for this job' });
    }

    // 3. Fetch Applications with Student Details
    const applications = await Application.find({ job: jobId })
      .populate({
        path: 'student',
        select: 'college branch cgpa graduationYear skills resume',
        populate: { path: 'user', select: 'name email' }
      })
      .sort('-appliedAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update application status
 * @route   PUT /api/applications/:id/status
 * @access  Private (Company only)
 */
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params; // Application ID

    // Validate status
    const validStatuses = ['Applied', 'Shortlisted', 'Interviewing', 'Rejected', 'Hired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find Application
    const application = await Application.findById(id).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Verify Ownership via Job
    const company = await Company.findOne({ user: req.user.id });
    if (application.job.company.toString() !== company._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this application' });
    }

    // Update Status
    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      data: application
    });
  } catch (error) {
    next(error);
  }
};
