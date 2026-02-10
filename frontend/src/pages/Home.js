import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-hero">
      <h1>Welcome to Campus Portal</h1>
      <p>Connect with top companies and find your dream job.</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <Link to="/register" className="btn-primary" style={{ width: 'auto', padding: '10px 30px' }}>
          Get Started
        </Link>
        <Link to="/login" className="btn-primary" style={{ width: 'auto', padding: '10px 30px', background: 'transparent', border: '2px solid var(--primary-color)', color: 'var(--primary-color)' }}>
          Login
        </Link>
      </div>
    </div>
  );
};

export default Home;
