import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../utils/apiClient";
import { auth, onAuthStateChanged, signOut } from "../firebase/firebaseConfig";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          setIsAuthenticated(true);
          console.log("Firebase user detected:", firebaseUser);
          // Fetch user profile from backend
          const profile = await apiClient.users.getById(firebaseUser.uid);
          setUserProfile(profile);
          // Save to AsyncStorage
          await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
        } else {
          setUser(null);
          setUserProfile(null);
          setIsAuthenticated(false);
          setLoading(false);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);
  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Clear local state immediately
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      updateUserProfile(null);

      // Clear any local storage if needed

      await AsyncStorage.multiRemove(["authToken", "userProfile"]);
      setLoading(false);
      // User successfully signed out
    } catch (error) {
      console.error("Error signing out:", error);

      // Even if Firebase signout fails, clear local state
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      await AsyncStorage.multiRemove(["authToken", "userProfile"]);

      throw error; // Re-throw so AppLayout can handle it
    }
  };
  const checkAuthStatus = async () => {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      const storedUserProfile = await AsyncStorage.getItem("userProfile");

      // Set onboarding status based on stored value
      if (authToken && storedUserProfile) {
        setHasCompletedOnboarding(authToken === "true");
      } else {
        setHasCompletedOnboarding(false);
      }

      // Load stored user profile if available
      if (storedUserProfile) {
        setUserProfile(storedUserProfile && JSON.parse(storedUserProfile));
      }

      // Firebase auth state is handled by onAuthStateChanged listener
      // No need for separate token validation
    } catch (error) {
      console.error("Auth check error:", error);
    }
  };
  const syncAuthState = async () => {
    try {
      // Firebase automatically handles auth state through onAuthStateChanged
      // This function can be used to manually refresh user profile data
      if (user && isAuthenticated) {
        await fetchUserProfile(user);
        console.log("Auth state synced successfully");
      }
    } catch (error) {
      console.error("Auth sync error:", error);
    }
  };

  const updateUserProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
    // Save to AsyncStorage
    if (updatedProfile) {
      AsyncStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem("onboardingCompleted", "true");
      setHasCompletedOnboarding(true);
      return { success: true };
    } catch (error) {
      console.error("Complete onboarding error:", error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    isAuthenticated,
    hasCompletedOnboarding,
    updateUserProfile,
    completeOnboarding,
    checkAuthStatus,
    syncAuthState,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
