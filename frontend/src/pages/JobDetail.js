import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs`); // We don't have a specific getJobById endpoint, filtering from list or can implement one. 
        // Wait, standard CRUD usually has get by ID. Let's check backend.
        // Backend: router.get('/', getJobs); router.get('/my-jobs', protect, authorize('company'), getCompanyJobs);
        // We missed a public GET /jobs/:id in backend. 
        // Workaround: Fetch all and find (not efficient but works for now) OR Implementing backend update.
        // Let's check if we can add it or just filter. Filtering for now to avoid backend context switch.
        const foundJob = res.data.data.find(j => j._id === id);
        setJob(foundJob);
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'student') {
      setMessage('Only students can apply for jobs.');
      return;
    }

    setApplying(true);
    try {
      await api.post(`/applications/apply/${id}`);
      setMessage('Application submitted successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to apply.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <div className="job-detail-container">
      <div className="job-header">
        <h1>{job.title}</h1>
        <h2>{job.company.name}</h2>
      </div>
      
      <div className="job-info-grid">
        <div className="info-item">
          <strong>Location:</strong> {job.location}
        </div>
        <div className="info-item">
          <strong>Salary:</strong> {job.salary}
        </div>
        <div className="info-item">
          <strong>Type:</strong> {job.type}
        </div>
        <div className="info-item">
          <strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}
        </div>
      </div>

      <div className="job-description">
        <h3>Description</h3>
        <p>{job.description}</p>
        
        <h3>Requirements</h3>
        <pre>{job.requirements}</pre>
      </div>

      <div className="action-area">
        {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>{message}</div>}
        
        {user?.role === 'student' && (
          <button 
            className="btn-primary" 
            onClick={handleApply} 
            disabled={applying}
          >
            {applying ? 'Applying...' : 'Apply Now'}
          </button>
        )}
      </div>
    </div>
  );
};

export default JobDetail;
