import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import api from "../utils/api";

const StudentProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "view" ? "view" : "edit";
  const redirectTimer = useRef(null);
  const fromPath = location.state?.from || "/dashboard";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    branch: "",
    cgpa: "",
    graduationYear: "",
    skills: "",
    phone: "",
  });
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resumeSuccess, setResumeSuccess] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await api.get("/students/me");
      const student = res.data.data;
      setFormData({
        name: student.user?.name || "",
        email: student.user?.email || "",
        college: student.college || "",
        branch: student.branch || "",
        cgpa: student.cgpa || "",
        graduationYear: student.graduationYear || "",
        skills: student.skills ? student.skills.join(", ") : "",
        phone: student.phone || "",
      });
      setResumeUrl(student.resume || "");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onResumeChange = (e) => {
    setResumeFile(e.target.files[0] || null);
    setResumeSuccess("");
    setError("");
  };

  const onResumeUpload = async () => {
    if (!resumeFile) {
      setError("Please select a resume PDF to upload");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("resume", resumeFile);

    try {
      setError("");
      setResumeSuccess("");
      const res = await api.post("/students/resume", uploadData);
      setResumeUrl(res.data.data.resume || "");
      setResumeSuccess("Resume uploaded successfully.");
      setResumeFile(null);
      await fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload resume");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        college: formData.college,
        branch: formData.branch,
        cgpa: formData.cgpa ? Number(formData.cgpa) : undefined,
        graduationYear: formData.graduationYear
          ? Number(formData.graduationYear)
          : undefined,
        skills: formData.skills,
        phone: formData.phone,
      };

      await api.put("/students/me", payload);
      setSuccess("Profile updated successfully. Redirecting...");

      redirectTimer.current = window.setTimeout(() => {
        navigate(fromPath, { replace: true });
      }, 1400);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="form-container" style={{ maxWidth: "700px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        {mode === "view" ? "Student Profile" : "Update Student Profile"}
      </h2>
      {success && (
        <div
          className="success-message"
          style={{ textAlign: "center", marginBottom: "15px" }}
        >
          {success}
        </div>
      )}
      {resumeSuccess && (
        <div
          className="success-message"
          style={{ textAlign: "center", marginBottom: "15px" }}
        >
          {resumeSuccess}
        </div>
      )}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} disabled />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} disabled />
        </div>

        <div className="form-group">
          <label>College</label>
          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={onChange}
            placeholder="College name"
            disabled={mode === "view"}
          />
        </div>

        <div className="form-group">
          <label>Branch</label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={onChange}
            placeholder="Branch / department"
            disabled={mode === "view"}
          />
        </div>

        <div className="form-group">
          <label>CGPA</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="10"
            name="cgpa"
            value={formData.cgpa}
            onChange={onChange}
            placeholder="CGPA"
            disabled={mode === "view"}
          />
        </div>

        <div className="form-group">
          <label>Graduation Year</label>
          <input
            type="number"
            min="2020"
            max="2035"
            name="graduationYear"
            value={formData.graduationYear}
            onChange={onChange}
            placeholder="Graduation year"
            disabled={mode === "view"}
          />
        </div>

        <div className="form-group">
          <label>Skills</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={onChange}
            placeholder="Comma separated skills"
            disabled={mode === "view"}
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            placeholder="Phone number"
            disabled={mode === "view"}
          />
        </div>

        <div className="form-group">
          <label>Resume</label>
          {resumeUrl ? (
            <div style={{ marginBottom: "8px" }}>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                View current resume
              </a>
            </div>
          ) : (
            <p style={{ marginBottom: "8px", color: "#555" }}>
              No resume uploaded yet.
            </p>
          )}
          <input
            type="file"
            name="resume"
            accept="application/pdf"
            onChange={onResumeChange}
            disabled={mode === "view"}
          />
          {mode !== "view" && (
            <button
              type="button"
              className="btn-primary"
              onClick={onResumeUpload}
              style={{ marginTop: "10px", width: "auto" }}
            >
              Upload Resume
            </button>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          {mode !== "view" && (
            <button
              type="submit"
              className="btn-primary"
              style={{ width: "120px" }}
            >
              Save
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentProfile;
