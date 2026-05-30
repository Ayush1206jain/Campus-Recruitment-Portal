const express = require("express");
const {
  createJob,
  getJobs,
  getCompanyJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

/**
 * Job Routes
 * Base path: /api/jobs
 */

// Public Routes (or valid for all logged in users)
router.get("/", getJobs); // Anyone can see jobs

// Protected Routes (Company Only)
router.post("/", protect, authorize("company"), createJob);
router.get("/my-jobs", protect, authorize("company"), getCompanyJobs);
router.get("/:id", getJobById);
router.put("/:id", protect, authorize("company"), updateJob);
router.delete("/:id", protect, authorize("company"), deleteJob);

module.exports = router;
