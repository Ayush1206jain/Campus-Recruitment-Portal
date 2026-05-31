import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
    // Force reload to avoid stale cached UI when user presses browser back
    try {
      window.location.reload();
    } catch (e) {
      // ignore
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={user ? "/dashboard" : "/"} className="navbar-logo">
          Campus Connect
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
              {location.pathname === "/post-job" && (
                <li className="nav-item">
                  <button
                    className="btn-back"
                    onClick={() => navigate("/dashboard")}
                    style={{ marginRight: "8px" }}
                  >
                    Back
                  </button>
                </li>
              )}
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
