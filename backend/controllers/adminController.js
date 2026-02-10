const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

/**
 * @desc    Get System Stats
 * @route   GET /api/admin/stats
 * @access  Private (Admin only)
 */
exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const companies = await User.countDocuments({ role: 'company' });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'Open' });
    const totalApplications = await Application.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        users: { total: totalUsers, students, companies },
        jobs: { total: totalJobs, active: activeJobs },
        applications: totalApplications
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get All Users
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify Company
 * @route   PUT /api/admin/companies/:id/verify
 * @access  Private (Admin only)
 */
exports.verifyCompany = async (req, res, next) => {
  try {
    // Note: The ID passed here is the COMPANY Profile ID, not the User ID
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    // Toggle verification status
    company.isVerified = !company.isVerified;
    await company.save();

    res.status(200).json({
      success: true,
      data: company,
      message: `Company ${company.isVerified ? 'verified' : 'unverified'} successfully`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete User
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin only)
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deleting yourself (if you are an admin)
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete yourself' });
    }

    // If user is a student/company, delete their profile too
    if (user.role === 'student') {
      await Student.findOneAndDelete({ user: user._id });
    } else if (user.role === 'company') {
      await Company.findOneAndDelete({ user: user._id });
    }

    // Finally delete the user account
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
