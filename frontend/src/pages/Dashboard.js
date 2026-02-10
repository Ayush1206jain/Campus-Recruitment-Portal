import React from 'react';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import CompanyDashboard from './CompanyDashboard';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <div className="error-message">Please log in to view dashboard</div>;
  }

  return (
    <div className="dashboard-container">
      {user.role === 'student' ? <StudentDashboard /> : <CompanyDashboard />}
    </div>
  );
};

export default Dashboard;
