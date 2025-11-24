import axios from "axios";

import { auth } from "../firebase/firebaseConfig";

// Get the correct base URL for development
const getBaseURL = () => {
  if (__DEV__) {
    // Your machine's IP address for mobile device to connect
    return "http://192.168.18.38:5000";
  }
  return "https://your-production-api.com"; // Your production API URL
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
    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error getting auth token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      auth.signOut();
      navigator.navigate("Login");
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// API methods
export const apiClient = {
  // Auth endpoints
  auth: {
    login: (mobile) => api.post("/api/auth/otp/login-whatsapp", { mobile }),
    verifyOtp: (mobile, otp) =>
      api.post("/api/auth/otp/verify-otp", { mobile, code: otp }),
    sendOtp: (phone) => {
      console.log("API: Sending OTP to phone:", phone);
      return api.post("/api/auth/otp/send-otp", { phone });
    },
  },
};

export default apiClient;
