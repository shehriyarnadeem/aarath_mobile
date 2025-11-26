import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import MarketplaceScreen from "../screens/main/MarketplaceScreen";
import OnboardingFlow from "../screens/onboarding/OnboardingFlow";
import DashboardNavigator from "./DashboardNavigator";
import { useAuth } from "../context/AuthContext";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  // Determine initial route based on auth and onboarding status
  const getInitialRoute = () => {
    if (loading) return "Splash";
    if (!isAuthenticated) return "Login";
    return "Dashboard";
  };

  // Use a key on the navigator to force remount when auth state changes
  return (
    <Stack.Navigator
      key={isAuthenticated ? "auth" : "guest"}
      screenOptions={{ headerShown: false }}
      initialRouteName={getInitialRoute()}
    >
      {isAuthenticated ? (
        // Main app routes for authenticated users
        <>
          <Stack.Screen name="Dashboard" component={DashboardNavigator} />
        </>
      ) : (
        // Authentication routes
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingFlow} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
