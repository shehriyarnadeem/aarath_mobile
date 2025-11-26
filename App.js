import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { ThemeProvider } from "./src/constants/Theme";
import { AuthProvider } from "./src/context/AuthContext";
import Toast from "react-native-toast-message";
export default function App() {
  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
        <Toast position="bottom" bottomOffset={20} />
      </ThemeProvider>
    </>
  );
}
