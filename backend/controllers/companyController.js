const Company = require('../models/Company');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

/**
 * @desc    Get current company profile
 * @route   GET /api/company/me
 * @access  Private (Company only)
 */
exports.getCompanyProfile = async (req, res, next) => {
  try {
    // Find company profile linked to the logged-in user
    // Populate user details (name, email) from User model
    const company = await Company.findOne({ user: req.user.id }).populate('user', 'name email');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update company profile
 * @route   PUT /api/company/me
 * @access  Private (Company only)
 */
exports.updateCompanyProfile = async (req, res, next) => {
  try {
    // Destructure allowed fields from request body
    const {
      industry,
      size,
      website,
      description
    } = req.body;

    // Build update object
    const updateFields = {};
    if (industry) updateFields.industry = industry;
    if (size) updateFields.size = size;
    if (website) updateFields.website = website;
    if (description) updateFields.description = description;

    // Find and update the profile
    const company = await Company.findOneAndUpdate(
      { user: req.user.id },
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate('user', 'name email');


    res.status(200).json({
      success: true,
      data: company,
      message: 'Company profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload Company Logo
 * @route   POST /api/companies/logo
 * @access  Private (Company only)
 */
exports.uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    // Convert memory buffer to base64 data URI
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'campus-portal/logos',
      resource_type: 'image'
    });

    // Update company profile
    const company = await Company.findOneAndUpdate(
      { user: req.user.id },
      { logo: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: company,
      message: 'Logo uploaded successfully'
    });
  } catch (error) {
    next(error);
  }
};
