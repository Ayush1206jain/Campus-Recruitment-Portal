const Student = require("../models/Student");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const axios = require("axios");

/**
 * @desc    Get current student profile
 * @route   GET /api/student/me
 * @access  Private (Student only)
 */
exports.getStudentProfile = async (req, res, next) => {
  try {
    // Find student profile linked to the logged-in user
    // Populate user details (name, email, role) from User model
    const student = await Student.findOne({ user: req.user.id }).populate(
      "user",
      "name email role",
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
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
    const { college, branch, cgpa, graduationYear, skills, phone } = req.body;

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
        : skills.split(",").map((skill) => skill.trim());
    }

    // Find and update the profile
    // new: true -> returns the updated document
    // runValidators: true -> runs schema validators on update
    const student = await Student.findOneAndUpdate(
      { user: req.user.id },
      { $set: updateFields },
      { new: true, runValidators: true },
    ).populate("user", "name email role");

    res.status(200).json({
      success: true,
      data: student,
      message: "Profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload Resume (PDF)
 * @route   POST /api/students/resume
 * @access  Private (Student only)
 */
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    // Convert memory buffer to base64 data URI for Cloudinary
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Upload to Cloudinary as raw PDF so the returned URL opens directly in browser
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "campus-portal/resumes",
      resource_type: "raw",
      format: "pdf",
      public_id: `resume-${req.user.id}-${Date.now()}`,
      overwrite: true,
    });

    // Update student profile with the Cloudinary URL
    const student = await Student.findOneAndUpdate(
      { user: req.user.id },
      {
        resume: uploadResponse.secure_url,
        resumePublicId: uploadResponse.public_id,
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      data: student,
      message: "Resume uploaded successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Stream the current student's resume through the server
 * @route GET /api/students/resume/view
 * @access Private (Student only)
 */
exports.viewResume = async (req, res, next) => {
  try {
    console.log(
      "[viewResume] called by user:",
      req.user ? req.user.id : "(no user)",
    );
    const student = await Student.findOne({ user: req.user.id });
    if (!student || !student.resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });
    }

    console.log("[viewResume] fetching remote url:", student.resume);

    // Fetch the remote file as stream and pipe it to the response
    const response = await axios.get(student.resume, {
      responseType: "stream",
      validateStatus: (s) => s >= 200 && s < 500, // let us handle non-2xx
    });

    if (response.status !== 200) {
      console.error(
        "[viewResume] upstream fetch failed",
        response.status,
        response.statusText,
      );

      // If Cloudinary returned Unauthorized, try generating a signed URL via SDK
      if (response.status === 401) {
        try {
          // Prefer stored public_id if available
          const publicId =
            student.resumePublicId ||
            (() => {
              try {
                const parsed = new URL(student.resume);
                const afterUpload = parsed.pathname.split("/upload/")[1] || "";
                const withoutVersion = afterUpload.replace(/^v\d+\//, "");
                return withoutVersion.replace(/\.[^/.]+$/, "");
              } catch (e) {
                return null;
              }
            })();

          if (!publicId) {
            console.error(
              "[viewResume] no public_id available to try Cloudinary API",
            );
            return res
              .status(502)
              .json({ success: false, message: "Resume is not accessible" });
          }

          console.log(
            "[viewResume] attempting cloudinary.api.resource for public_id:",
            publicId,
          );
          const info = await cloudinary.api.resource(publicId, {
            resource_type: "raw",
          });
          const fetchUrl = info.secure_url || info.url;
          if (!fetchUrl) {
            console.error(
              "[viewResume] cloudinary api.resource returned no URL",
            );
            return res
              .status(502)
              .json({
                success: false,
                message: "Resume not accessible from Cloudinary",
              });
          }

          console.log("[viewResume] fetched resource secure_url via API");
          const signedRes = await axios.get(fetchUrl, {
            responseType: "stream",
            validateStatus: (s) => s >= 200 && s < 500,
          });
          if (signedRes.status !== 200) {
            console.error(
              "[viewResume] resource upstream fetch failed",
              signedRes.status,
              signedRes.statusText,
            );
            return res
              .status(signedRes.status)
              .json({
                success: false,
                message: `Failed to fetch resume (resource upstream ${signedRes.status})`,
              });
          }

          const contentType2 =
            signedRes.headers["content-type"] || "application/pdf";
          res.setHeader("Content-Type", contentType2);
          res.setHeader("Content-Disposition", "inline; filename=resume.pdf");
          res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
          return signedRes.data.pipe(res).on("error", (err) => {
            console.error("[viewResume] resource stream pipe error:", err);
            try {
              res.end();
            } catch (e) {}
          });
        } catch (fallbackErr) {
          console.error(
            "[viewResume] cloudinary API fallback failed:",
            fallbackErr && fallbackErr.message
              ? fallbackErr.message
              : fallbackErr,
          );
          return res
            .status(502)
            .json({
              success: false,
              message: "Failed to fetch resume from Cloudinary",
            });
        }
      }

      // forward upstream status and message for other statuses
      return res.status(response.status).json({
        success: false,
        message: `Failed to fetch resume (upstream ${response.status})`,
      });
    }

    // Prefer content-type from upstream, but default to PDF
    const contentType = response.headers["content-type"] || "application/pdf";
    res.setHeader("Content-Type", contentType);
    // Suggest inline display
    res.setHeader("Content-Disposition", "inline; filename=resume.pdf");
    // Allow browsers to see Content-Disposition header
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

    response.data.pipe(res).on("error", (err) => {
      console.error("[viewResume] stream pipe error:", err);
      // If piping fails, ensure we don't leave the request hanging
      try {
        res.end();
      } catch (e) {}
    });
  } catch (error) {
    console.error(
      "[viewResume] error:",
      error && error.message ? error.message : error,
    );
    // If upstream returned an error object, try to surface useful info
    if (error.response) {
      return res.status(error.response.status || 500).json({
        success: false,
        message:
          error.response.data?.message ||
          `Upstream error ${error.response.status}`,
      });
    }
    next(error);
  }
};
