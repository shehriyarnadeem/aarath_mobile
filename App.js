import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { ThemeProvider } from "./src/constants/Theme";
import { AuthProvider } from "./src/context/AuthContext";
import { LanguageProvider } from "./src/context/LanguageContext";
import Toast from "react-native-toast-message";
import AuthDebugger from "./src/components/AuthDebugger";
import "./src/i18n";

export default function App() {
  return (
    <>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </LanguageProvider>
        <Toast position="bottom" bottomOffset={20} />
      </ThemeProvider>
    </>
  );
}
