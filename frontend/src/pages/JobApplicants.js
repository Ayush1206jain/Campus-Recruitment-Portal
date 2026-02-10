import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get(`/applications/job/${jobId}`);
        setApplicants(res.data.data);
        // Ideally fetch job details to show title, or pass it via state
      } catch (error) {
        console.error('Error fetching applicants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      // Update local state
      setApplicants(applicants.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Applicants</h1>
      
      {loading ? (
        <p>Loading applicants...</p>
      ) : applicants.length === 0 ? (
        <p>No applicants yet for this job.</p>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>CGPA</th>
                <th>Skills</th>
                <th>Resume</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => (
                <tr key={app._id}>
                  <td>{app.student.user.name}</td>
                  <td>{app.student.user.email}</td>
                  <td>{app.student.cgpa}</td>
                  <td>{app.student.skills}</td>
                  <td>
                    {app.student.resume ? (
                      <a href={app.student.resume} target="_blank" rel="noopener noreferrer" className="link-action">
                        View Resume
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      className="form-control"
                      style={{ padding: '5px', fontSize: '14px', width: 'auto' }}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Shortlisted">Shortlist</option>
                      <option value="Interviewing">Interview</option>
                      <option value="Rejected">Reject</option>
                      <option value="Hired">Hire</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JobApplicants;
