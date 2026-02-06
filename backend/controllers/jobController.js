const Job = require('../models/Job');
const Company = require('../models/Company');

/**
 * @desc    Create a new job
 * @route   POST /api/jobs
 * @access  Private (Company only)
 */
exports.createJob = async (req, res, next) => {
  try {
    // 1. Check if the user has a company profile
    const company = await Company.findOne({ user: req.user.id });
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Complete your company profile before posting a job'
      });
    }

    // 2. Create the job, linking it to the company profile
    const job = await Job.create({
      ...req.body,
      company: company._id // Link to Company document, not User document
    });

    res.status(201).json({
      success: true,
      data: job,
      message: 'Job posted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all jobs (with filters)
 * @route   GET /api/jobs
 * @access  Public/Private (Both)
 */
exports.getJobs = async (req, res, next) => {
  try {
    // Basic filtering logic (can be expanded later)
    let query = Job.find({ status: 'Open' }).populate('company', 'industry size website logo'); // Populate company details

    // Sort by newest first
    query = query.sort('-createdAt');

    const jobs = await query;

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single job details
 * @route   GET /api/jobs/:id
 * @access  Public
 */
exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('company', 'industry size website logo description');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get jobs posted by current company
 * @route   GET /api/jobs/my-jobs
 * @access  Private (Company only)
 */
exports.getCompanyJobs = async (req, res, next) => {
  try {
    const company = await Company.findOne({ user: req.user.id });
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const jobs = await Job.find({ company: company._id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a job
 * @route   PUT /api/jobs/:id
 * @access  Private (Company only)
 */
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Security Check: Ensure the logged-in company owns this job
    const company = await Company.findOne({ user: req.user.id });
    if (job.company.toString() !== company._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: job,
      message: 'Job updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a job
 * @route   DELETE /api/jobs/:id
 * @access  Private (Company only)
 */
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Security Check: Ownership
    const company = await Company.findOne({ user: req.user.id });
    if (job.company.toString() !== company._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
