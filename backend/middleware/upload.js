const multer = require('multer');
const path = require('path');

/**
 * Multer Storage Configuration
 * We use memory storage to access the file buffer directly.
 * This buffer will be sent to Cloudinary.
 */
const storage = multer.memoryStorage();

/**
 * File Filter
 * Validates the file type before accepting the upload.
 * - Resumes: PDF only
 * - Images: JPEG, JPG, PNG only
 */
const fileFilter = (req, file, cb) => {
  // Identify the field name to determine validation rules
  if (file.fieldname === 'resume') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF is allowed for resumes.'), false);
    }
  } else if (file.fieldname === 'logo') {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed for logos.'), false);
    }
  } else {
    cb(new Error('Unknown field name.'), false);
  }
};

/**
 * Multer Upload Middleware
 * Configures the upload limits and filter.
 */
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;
