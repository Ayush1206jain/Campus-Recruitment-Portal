import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      try {
        // Clear token and force login so user can re-authenticate
        localStorage.removeItem("token");
        // Optional: show a message then redirect
        window.alert("Session expired. Please login again.");
        window.location.href = "/login";
      } catch (e) {
        // ignore
      }
    }
    return Promise.reject(error);
  },
);

export default api;
