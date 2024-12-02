import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:5150/api",
});

// interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
