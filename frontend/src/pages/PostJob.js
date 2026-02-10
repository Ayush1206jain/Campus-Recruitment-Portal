import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    deadline: '',
    type: 'Full-time'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { title, description, requirements, location, salary, deadline, type } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/jobs', formData);
      navigate('/dashboard'); // Redirect to dashboard to see the new job
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: '800px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Post a New Job</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={onChange}
            required
            placeholder="e.g. Software Engineer"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={description}
            onChange={onChange}
            required
            rows="4"
            className="form-control"
            placeholder="Job responsibilities..."
          ></textarea>
        </div>

        <div className="form-group">
          <label>Requirements</label>
          <textarea
            name="requirements"
            value={requirements}
            onChange={onChange}
            required
            rows="4"
            className="form-control"
            placeholder="Skills required (e.g. React, Node.js)"
          ></textarea>
        </div>

        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={location}
              onChange={onChange}
              required
              placeholder="e.g. Remote / Bangalore"
            />
          </div>
          <div>
            <label>Salary</label>
            <input
              type="text"
              name="salary"
              value={salary}
              onChange={onChange}
              required
              placeholder="e.g. 12 LPA"
            />
          </div>
        </div>

        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label>Deadline</label>
            <input
              type="date"
              name="deadline"
              value={deadline}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <label>Job Type</label>
            <select name="type" value={type} onChange={onChange}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
