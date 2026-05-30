import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StudentDashboard from "./StudentDashboard";
import CompanyDashboard from "./CompanyDashboard";

const Dashboard = () => {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <div className="error-message">Please log in to view dashboard</div>;
  }

  return (
    <div className="dashboard-container">
      {location.state?.success && (
        <div
          className="success-message"
          style={{
            marginBottom: "20px",
            textAlign: "center",
            fontSize: "1.2rem",
            color: "#155724",
            backgroundColor: "#d4edda",
            border: "1px solid #c3e6cb",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          {location.state.success}
        </div>
      )}
      {user.role === "student" ? <StudentDashboard /> : <CompanyDashboard />}
    </div>
  );
};

export default Dashboard;
