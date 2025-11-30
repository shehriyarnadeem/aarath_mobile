// Update: src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { signOut } from "../firebase/firebaseConfig";
import apiClient from "../utils/apiClient";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in
          setIsAuthenticated(true);

          // Fetch user profile from your backend
          const userProfile = await fetchUserProfile(firebaseUser.uid);

          if (userProfile && typeof userProfile === "object") {
            setUser(userProfile);
            setHasCompletedOnboarding(userProfile.profileCompleted || false);
          } else {
            // If no profile found, user needs to complete onboarding
            setUser({ uid: firebaseUser.uid });
            setHasCompletedOnboarding(false);
            console.log("⚠️ No user profile found, needs onboarding");
          }
          setLoading(false);
        } else {
          // User is signed out
          console.log("🚪 User signed out");
          setIsAuthenticated(false);
          setUser(null);
          setHasCompletedOnboarding(false);
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ Error in auth state change:", error);
        setIsAuthenticated(false);
        setUser(null);
        setHasCompletedOnboarding(false);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      // Sign out from Firebase
      setLoading(true);
      const auth = getAuth();
      await signOut(auth);

      // Clear local state immediately
      setUser(null);
      setIsAuthenticated(false);

      // Clear any local storage if needed
      setLoading(false);
      // User successfully signed out
    } catch (error) {
      console.error("Error signing out:", error);

      // Even if Firebase signout fails, clear local state
      setUser(null);
      setIsAuthenticated(false);

      throw error; // Re-throw so AppLayout can handle it
    }
  };

  const fetchUserProfile = async (uid) => {
    try {
      console.log("🔍 Fetching user profile for UID:", uid);

      // Make sure to properly await the API call
      const response = await apiClient.user.getById(uid);

      console.log("📝 API Response:", response);

      // Check if response exists and has user data
      if (response.success) {
        console.log("✅ User profile found:", response);
        return response.user;
      } else if (response && response.success === false) {
        console.log("⚠️ API returned error:", response.error);
        return null;
      } else {
        console.log("⚠️ No user data in response");
        return null;
      }
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
      return null;
    }
  };

  const value = {
    user,
    isAuthenticated,
    hasCompletedOnboarding,
    loading,
    setLoading,
    logout,
    setUser,
    setHasCompletedOnboarding, // Allow manual updates after onboarding completion
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
