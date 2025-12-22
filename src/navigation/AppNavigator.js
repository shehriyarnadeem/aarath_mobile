// Update: src/navigation/AppNavigator.js
import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import OnboardingFlow from "../screens/onboarding/OnboardingFlow";
import DashboardNavigator from "./DashboardNavigator";
import { useAuth } from "../context/AuthContext";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, loading, initializing } = useAuth();

  console.log(
    "🔍 AppNavigator - isAuthenticated:",
    isAuthenticated,
    "loading:",
    loading
  );

  // Show splash screen while initializing
  if (loading || initializing) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
      </Stack.Navigator>
    );
  }

  // Simple authentication-based routing
  if (isAuthenticated) {
    console.log("✅ User is authenticated - showing Dashboard");
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dashboard" component={DashboardNavigator} />
        <Stack.Screen name="Onboarding" component={OnboardingFlow} />
      </Stack.Navigator>
    );
  } else {
    console.log("❌ User not authenticated - showing Login");
    return (
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Dashboard"
      >
        <Stack.Screen name="Dashboard" component={DashboardNavigator} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={RegisterScreen} />
      </Stack.Navigator>
    );
  }
};

export default AppNavigator;
