import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import MarketplaceScreen from "../screens/main/MarketplaceScreen";
import OnboardingFlow from "../screens/onboarding/OnboardingFlow";
import { useAuth } from "../context/AuthContext";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  // Determine initial route based on auth and onboarding status
  const getInitialRoute = () => {
    if (loading) return "Splash";
    if (!isAuthenticated) return "Login";
    return "Marketplace";
  };

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={getInitialRoute()}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      {isAuthenticated ? (
        // Main app routes for completed users
        <>
          <Stack.Screen name="Marketplace" component={MarketplaceScreen} />
        </>
      ) : (
        // Authentication routes
        <>
          <Stack.Screen name="Onboarding" component={OnboardingFlow} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
