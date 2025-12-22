import axios from "axios";

import { auth } from "../firebase/firebaseConfig";

// Get the correct base URL for development
export const getBaseURL = () => {
  console.log("Using development API URL");
  if (__DEV__) {
    console.log("Using development API URL");
    // Your machine's IP address for mobile device to connect
    return "http://192.168.18.38:5000"; // Replace with your local IP
  }
  return "https://api.aarath.app"; // Your production API URL
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    console.log("Current user in request interceptor:", user?.email || "null");

    // Handle FormData requests
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"]; // Let browser set multipart/form-data boundary
    }

    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Auth token added successfully");
      } catch (error) {
        console.error("Error getting auth token:", error);
      }
    }

    console.log("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config?.url);
    return response.data;
  },
  (error) => {
    if (error.response) {
      // console.error("Error Status:", error.response.status);
      // console.error("Error Data:", error.response.data);
    }

    if (error.response?.status === 401) {
      // Handle unauthorized access
      auth.signOut();
      // Note: navigation should be handled in components, not interceptors
    }
    return Promise.reject(error.response?.data || error.message || error);
  }
);

// API methods
export const apiClient = {
  // Auth endpoints
  auth: {
    login: (mobile) => api.post("/api/auth/otp/login-whatsapp", { mobile }),
    verifyOtp: (mobile, otp, usecase = null) =>
      api.post("/api/auth/otp/verify-otp", { mobile, code: otp, usecase }),
    sendOtp: (phone, usecase = null) => {
      console.log("API: Sending OTP to phone:", phone);
      return api.post("/api/auth/otp/send-otp", { phone, usecase });
    },
  },
  user: {
    onboardingComplete: (data) => {
      return api.post("/api/users/onboarding-complete", data);
    },
    getById: (userId) => api.get(`/api/users/${userId}`),
  },
  products: {
    create: (data) => api.post("/api/products/create", data),
    draft: (data) => api.post("/api/products/draft", data),
    publish: (data) => api.post("/api/products/publish", data),
    getAll: (params) => api.get("/api/products", { params }),

    getById: (userId, status = null) =>
      api.get(`/api/products/user/${userId}/${status}`),
    update: (id, data) => api.put(`/api/products/${id}`, data),
    delete: (id) => api.delete(`/api/products/${id}`),
  },
};

export default apiClient;
