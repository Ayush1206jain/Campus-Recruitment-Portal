import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../utils/api";

const CompanyDashboard = () => {
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/jobs/my-jobs");
      setJobs(res.data.data);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (location.state?.success) {
      fetchJobs();
    }
  }, [location.state]);

  const deleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await api.delete(`/jobs/${id}`);
        setJobs(jobs.filter((job) => job._id !== id));
      } catch (error) {
        alert("Failed to delete job");
      }
    }
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1>Company Dashboard</h1>
        <Link to="/post-job" className="btn-primary" style={{ width: "auto" }}>
          Post New Job
        </Link>
      </div>

      <div className="section">
        <h2>My Posted Jobs</h2>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p>You haven't posted any jobs yet.</p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Candidates</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td>{job.title}</td>
                    <td>{job.location}</td>
                    <td>{job.type}</td>
                    <td>
                      <Link
                        to={`/job/${job._id}/applicants`}
                        className="link-action"
                      >
                        View Applicants
                      </Link>
                    </td>
                    <td>
                      <button
                        onClick={() => deleteJob(job._id)}
                        className="btn-danger-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
