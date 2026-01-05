// Update: src/navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/SplashScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import OnboardingFlow from "../screens/onboarding/OnboardingFlow";
import DashboardNavigator from "./DashboardNavigator";
import { useAuth } from "../context/AuthContext";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, initializing, hasCompletedOnboarding } = useAuth();

  // Build a key so NavigationContainer is recreated when auth state changes
  const navKey = `${isAuthenticated ? "auth" : "anon"}-${
    hasCompletedOnboarding ? "onboarded" : "not_onboarded"
  }`;

  return (
    <NavigationContainer key={navKey}>
      {initializing ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
        </Stack.Navigator>
      ) : isAuthenticated ? (
        !hasCompletedOnboarding ? (
          <Stack.Navigator
            key="onboarding-stack"
            screenOptions={{ headerShown: false }}
            initialRouteName="Onboarding"
          >
            <Stack.Screen name="Onboarding" component={OnboardingFlow} />
            <Stack.Screen name="Dashboard" component={DashboardNavigator} />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator
            key="dashboard-stack"
            screenOptions={{ headerShown: false }}
            initialRouteName="Dashboard"
          >
            <Stack.Screen name="Dashboard" component={DashboardNavigator} />
          </Stack.Navigator>
        )
      ) : (
        <Stack.Navigator
          key="auth-stack"
          screenOptions={{ headerShown: false }}
          initialRouteName="Welcome"
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={DashboardNavigator} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
