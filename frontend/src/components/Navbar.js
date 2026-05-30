import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={user ? "/dashboard" : "/"} className="navbar-logo">
          CampusPortal
        </Link>
        <ul className="nav-menu">
          {!user && (
            <li className="nav-item">
              <Link to="/" className="nav-links">
                Home
              </Link>
            </li>
          )}
          {user ? (
            <>
              <li className="nav-item">
                <span className="nav-links">Hello, {user.name}</span>
              </li>
              <li className="nav-item">
                <button className="btn-back" onClick={handleBack}>
                  Back
                </button>
              </li>
              <li className="nav-item">
                <button className="btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
