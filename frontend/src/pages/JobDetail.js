import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get("/jobs");
        const foundJob = res.data.data.find((j) => j._id === id);
        setJob(foundJob);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const requirements = useMemo(() => {
    if (!job?.requirements) return [];
    return job.requirements
      .split(/\n|,|;/)
      .map((item) => item.trim())
      .filter(Boolean);
  }, [job]);

  const handleApply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "student") {
      setMessage("Only students can apply for jobs.");
      return;
    }

    setApplying(true);
    try {
      await api.post(`/applications/apply/${id}`);
      setMessage("Application submitted successfully! Redirecting...");
      window.setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to apply.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="page-container">Loading job details...</div>;
  }

  if (!job) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p>Job not found.</p>
          <button className="btn-secondary" onClick={() => navigate("/jobs")}>
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="job-detail-page">
        <div className="job-detail-topbar">
          <button className="btn-secondary" onClick={() => navigate("/jobs")}>
            ← Back to Jobs
          </button>
          <span className="job-company-label">{job.company.name}</span>
        </div>

        <div className="job-detail-card">
          <div className="job-detail-header">
            <div>
              <h1>{job.title}</h1>
              <p className="job-role-subtitle">
                {job.location || "Remote"} · {job.type || "Full-time"}
              </p>
            </div>
            <span className="job-type-pill">{job.type || "Full-time"}</span>
          </div>

          <div className="job-overview-grid">
            <div>
              <h4>Location</h4>
              <p>{job.location || "Remote"}</p>
            </div>
            <div>
              <h4>Salary</h4>
              <p>{job.salary || "Not specified"}</p>
            </div>
            <div>
              <h4>Deadline</h4>
              <p>
                {job.deadline
                  ? new Date(job.deadline).toLocaleDateString()
                  : "TBD"}
              </p>
            </div>
            <div>
              <h4>Eligibility</h4>
              <p>
                {job.minCgpa
                  ? `Min CGPA: ${job.minCgpa}`
                  : "No CGPA requirement"}
                <br />
                {job.eligibleCourses && job.eligibleCourses.length > 0
                  ? `Courses: ${job.eligibleCourses.join(", ")}`
                  : "All courses"}
                <br />
                {job.eligibleBranches && job.eligibleBranches.length > 0
                  ? `Branches: ${job.eligibleBranches.join(", ")}`
                  : "All branches"}
              </p>
            </div>
          </div>

          <div className="job-section">
            <h3>Description</h3>
            <p>{job.description || "No description provided yet."}</p>
          </div>

          <div className="job-section">
            <h3>Requirements</h3>
            {requirements.length > 0 ? (
              <ul className="requirement-list">
                {requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No requirements provided yet.</p>
            )}
          </div>

          <div className="job-detail-footer">
            {message && (
              <div
                className={`alert ${message.includes("success") ? "alert-success" : "alert-error"}`}
              >
                {message}
              </div>
            )}
            {user?.role === "student" && (
              <button
                className="btn-primary btn-full"
                onClick={handleApply}
                disabled={applying}
              >
                {applying ? "Applying…" : "Apply Now"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
