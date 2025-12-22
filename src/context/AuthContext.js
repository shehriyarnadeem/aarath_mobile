// Updated AuthContext with cleaner approach
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
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Debug current state
  console.log("📱 AuthProvider State:", {
    initializing,
    isAuthenticated,
    hasUser: !!user,
    userUid: user?.uid || "none",
  });

  // Handle user state changes
  function handleAuthStateChanged(firebaseUser) {
    console.log("🔄 Auth state changed:", firebaseUser?.uid || "signed out");

    if (firebaseUser) {
      // User is signed in
      console.log("✅ Firebase user found:", firebaseUser.uid);
      setIsAuthenticated(true);

      // Set basic user info immediately
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        phoneNumber: firebaseUser.phoneNumber,
      });

      // Optionally fetch user profile from backend
      fetchUserProfile(firebaseUser.uid)
        .then((userProfile) => {
          if (userProfile && typeof userProfile === "object") {
            console.log("✅ User profile loaded successfully");
            setUser((prevUser) => ({ ...prevUser, ...userProfile }));
            setHasCompletedOnboarding(userProfile.profileCompleted || false);
          }
        })
        .catch((profileError) => {
          console.log(
            "⚠️ Could not fetch user profile, but user is still authenticated"
          );
          // Keep user authenticated even if profile fetch fails
        });
    } else {
      // User is signed out
      console.log("🚪 User signed out");
      setIsAuthenticated(false);
      setUser(null);
      setHasCompletedOnboarding(false);
    }

    // Set initializing to false after first auth state change
    if (initializing) {
      setInitializing(false);
      console.log("✅ Auth initialization complete");
    }
  }

  useEffect(() => {
    console.log("🚀 Setting up auth state listener...");
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);

    // Cleanup subscription on unmount
    return subscriber;
  }, []);

  const checkUserSession = async () => {
    try {
      const auth = getAuth();
      const firebaseUser = auth.currentUser;
      console.log(
        "🔍 Checking user session for:",
        firebaseUser?.uid || "no user"
      );
      await firebaseUser.getIdToken(true);
      if (firebaseUser) {
        // Verify the token is still valid
        await firebaseUser.getIdToken(true); // Force refresh token

        setIsAuthenticated(true);
        const userProfile = await fetchUserProfile(firebaseUser.uid);
        if (userProfile && typeof userProfile === "object") {
          setUser(userProfile);
          setHasCompletedOnboarding(userProfile.profileCompleted || false);
        } else {
          setUser({ uid: firebaseUser.uid });
          setHasCompletedOnboarding(false);
        }
        console.log("✅ Session validated successfully");
      } else {
        console.log("❌ No Firebase user found");
        setIsAuthenticated(false);
        setUser(null);
        setHasCompletedOnboarding(false);
      }
    } catch (error) {
      console.error("❌ Session validation failed:", error);
      setIsAuthenticated(false);
      setUser(null);
      setHasCompletedOnboarding(false);
    }
  };

  const logout = async () => {
    try {
      console.log("🚪 Signing out...");
      const auth = getAuth();
      await signOut(auth);

      // State will be updated by handleAuthStateChanged
      console.log("✅ Signed out successfully");
    } catch (error) {
      console.error("❌ Error signing out:", error);

      // Force clear state even if signOut fails
      setUser(null);
      setIsAuthenticated(false);
      setHasCompletedOnboarding(false);

      throw error;
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
    loading: initializing, // Use initializing as loading state
    setUser,
    setHasCompletedOnboarding,
    checkUserSession,
    initializing,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
