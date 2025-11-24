import React, { createContext, useContext } from "react";

// Agricultural Marketplace Theme - Matching aarath_frontend
const COLORS = {
  // Primary Colors - Green theme for agriculture
  primary: "#22c55e",
  primaryLight: "#4ade80",
  primaryDark: "#16a34a",
  primary50: "#f0fdf4",
  primary100: "#dcfce7",
  primary200: "#bbf7d0",
  primary300: "#86efac",
  primary400: "#4ade80",
  primary500: "#22c55e",
  primary600: "#16a34a",
  primary700: "#15803d",
  primary800: "#166534",
  primary900: "#14532d",

  // Secondary Colors - Orange for CTAs
  secondary: "#f97316",
  secondaryLight: "#fb923c",
  secondaryDark: "#ea580c",
  secondary50: "#fff7ed",
  secondary100: "#ffedd5",
  secondary200: "#fed7aa",
  secondary300: "#fdba74",
  secondary400: "#fb923c",
  secondary500: "#f97316",
  secondary600: "#ea580c",
  secondary700: "#c2410c",
  secondary800: "#9a3412",
  secondary900: "#7c2d12",

  // Neutral Colors
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray300: "#d1d5db",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray600: "#4b5563",
  gray700: "#374151",
  gray800: "#1f2937",
  gray900: "#111827",

  // Status Colors
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",

  // Basic Colors
  white: "#FFFFFF",
  black: "#000000",
  light: "#f9fafb",
  dark: "#1f2937",
};

const SIZES = {
  // Base spacing
  base: 8,
  xs: 10,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,

  // Font sizes
  fontXs: 12,
  fontSm: 14,
  fontBase: 16,
  fontLg: 18,
  fontXl: 20,
  font2xl: 24,
  font3xl: 30,
  font4xl: 36,

  // Spacing
  padding: 16,
  margin: 16,
  radius: 8,
  radiusLg: 12,
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ COLORS, SIZES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
