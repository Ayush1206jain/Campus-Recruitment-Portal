const Student = require('../models/Student');
const User = require('../models/User');

/**
 * @desc    Get current student profile
 * @route   GET /api/student/me
 * @access  Private (Student only)
 */
exports.getStudentProfile = async (req, res, next) => {
  try {
    // Find student profile linked to the logged-in user
    // Populate user details (name, email, role) from User model
    const student = await Student.findOne({ user: req.user.id }).populate('user', 'name email role');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update student profile
 * @route   PUT /api/student/me
 * @access  Private (Student only)
 */
exports.updateStudentProfile = async (req, res, next) => {
  try {
    // Destructure allowed fields from request body
    const {
      college,
      branch,
      cgpa,
      graduationYear,
      skills,
      phone
    } = req.body;

    // Create object for updates to ensure only valid fields are updated
    const updateFields = {};
    if (college) updateFields.college = college;
    if (branch) updateFields.branch = branch;
    if (cgpa) updateFields.cgpa = cgpa;
    if (graduationYear) updateFields.graduationYear = graduationYear;
    if (phone) updateFields.phone = phone;
    
    // Handle skills: if string (comma separated), split it; if array, use as is
    if (skills) {
      updateFields.skills = Array.isArray(skills) 
        ? skills 
        : skills.split(',').map(skill => skill.trim());
    }

    // Find and update the profile
    // new: true -> returns the updated document
    // runValidators: true -> runs schema validators on update
    const student = await Student.findOneAndUpdate(
      { user: req.user.id },
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate('user', 'name email role');

    res.status(200).json({
      success: true,
      data: student,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};
