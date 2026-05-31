import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await api.get("/auth/me");
          setUser(res.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Listen for history navigation (back/forward) and storage changes to keep auth state in sync
  useEffect(() => {
    const handlePop = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    const handleStorage = (e) => {
      if (e.key === "token") {
        handlePop();
      }
    };

    window.addEventListener("popstate", handlePop);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("pageshow", handlePop);

    return () => {
      window.removeEventListener("popstate", handlePop);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("pageshow", handlePop);
    };
  }, []);

  // Login Function
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Register Function
  const register = async (userData) => {
    try {
      await api.post("/auth/register", userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
