const cloudinary = require('cloudinary').v2;

/**
 * Cloudinary Configuration
 *Configures the Cloudinary SDK with API credentials from environment variables.
 * This allows the application to upload and manage media assets in the cloud.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
