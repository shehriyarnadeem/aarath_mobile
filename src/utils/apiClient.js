import axios from "axios";

import { auth } from "../firebase/firebaseConfig";

// Get the correct base URL for development
export const getBaseURL = () => {
  // Always use production API for release builds
  const isProduction = !__DEV__ || process.env.NODE_ENV === "production";

  if (isProduction) {
    console.log("Using production API URL");
    return "http://192.168.1.100:3000";
  }

  console.log("Using development API URL");
  // For Android Studio Emulator, use 10.0.2.2 to access host machine's localhost
  // For physical devices, use your machine's local IP address (192.168.x.x)
  // For iOS Simulator - use localhost
  // return "http://localhost:3000";

  // For Android Emulator - use special alias to access host machine
  // return "http://10.0.2.2:3000";

  // For Physical Device (iOS or Android) - use your computer's local IP
  // On Windows: Run 'ipconfig' in Command Prompt and find IPv4 Address
  // On Mac/Linux: Run 'ifconfig' or 'ip addr' in Terminal
  return "https://api.aarath.app"; // Replace X with your actual IP
  // return "http://10.0.2.2:3000"; // Android Studio Emulator
  //return "http://192.168.1.100:3000"; // Physical device - Replace with your local IP
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
    updateProfile: (userId, data) => api.put(`/api/users/${userId}`, data),
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
