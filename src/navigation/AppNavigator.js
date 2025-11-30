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
  const { isAuthenticated, loading, hasCompletedOnboarding, user } = useAuth();
  const navKey = `${isAuthenticated}-${hasCompletedOnboarding}`;
  const [navigationKey, setNavigationKey] = useState(0);

  // Show splash screen while loading
  if (loading) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
      </Stack.Navigator>
    );
  }

  // Determine which screens to show based on auth state
  const renderScreens = () => {
    console.log("🧭 Rendering AppNavigator screens:", hasCompletedOnboarding);
    if (isAuthenticated) {
      if (hasCompletedOnboarding) {
        console.log("🏠 Rendering Dashboard");
        return <Stack.Screen name="Dashboard" component={DashboardNavigator} />;
      } else {
        console.log("📋 Rendering Onboarding");
        return <Stack.Screen name="Onboarding" component={OnboardingFlow} />;
      }
    } else {
      console.log("🔐 Rendering Auth screens");
      return (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={RegisterScreen} />
        </>
      );
    }
  };

  return (
    <Stack.Navigator
      key={navKey} // Force remount when key changes
      screenOptions={{ headerShown: false }}
      initialRouteName={
        isAuthenticated
          ? hasCompletedOnboarding
            ? "Dashboard"
            : "Onboarding"
          : "Login"
      }
    >
      {renderScreens()}
    </Stack.Navigator>
  );
};

export default AppNavigator;
