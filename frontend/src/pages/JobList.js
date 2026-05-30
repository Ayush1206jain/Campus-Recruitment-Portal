import React, { useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs"); // Public endpoint
        setJobs(res.data.data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const jobTypes = useMemo(
    () => ["all", ...new Set(jobs.map((job) => job.type || "Unknown"))],
    [jobs],
  );

  const locations = useMemo(
    () => ["all", ...new Set(jobs.map((job) => job.location || "Unknown"))],
    [jobs],
  );

  const visibleJobs = useMemo(() => {
    return jobs.filter((job) => {
      const companyName = job.company?.user?.name || "";
      const matchesQuery =
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        companyName.toLowerCase().includes(query.toLowerCase());

      const matchesType = typeFilter === "all" || job.type === typeFilter;
      const matchesLocation =
        locationFilter === "all" || job.location === locationFilter;

      return matchesQuery && matchesType && matchesLocation;
    });
  }, [jobs, query, typeFilter, locationFilter]);

  return (
    <div className="page-container">
      <div className="page-heading-row">
        <div>
          <h1 className="page-title">Browse Jobs</h1>
          <p className="page-subtitle">
            Search for open roles, filter by job type or location, and view
            details.
          </p>
        </div>
      </div>

      <div className="filters-row">
        <div className="filter-control">
          <label>Search</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or company"
          />
        </div>

        <div className="filter-control">
          <label>Job Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type === "all" ? "All types" : type}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-control">
          <label>Location</label>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location === "all" ? "All locations" : location}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="loading-text">Loading jobs...</p>
      ) : visibleJobs.length === 0 ? (
        <div className="empty-state">
          <p>No jobs match your search criteria.</p>
          <p>Try clearing filters or changing the search term.</p>
        </div>
      ) : (
        <div className="job-grid">
          {visibleJobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-card-header">
                <h3>{job.title}</h3>
                <span className="job-tag">{job.type || "Full-time"}</span>
              </div>
              <p className="company-name">
                {job.company?.user?.name || "Unknown Company"}
              </p>
              <div className="job-details">
                <span>📍 {job.location || "Remote"}</span>
                <span>💰 {job.salary || "Not specified"}</span>
                <span>🕒 {job.experience || "Any experience"}</span>
              </div>
              <div className="job-card-actions">
                <Link to={`/job/${job._id}`} className="btn-primary-outline">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
