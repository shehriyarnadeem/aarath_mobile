import React, { createContext, useContext } from "react";
import { Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TYPOGRAPHY } from "./Typography";

// Modern Clean Agricultural Marketplace Theme
const COLORS = {
  // Primary Dark Green System (Trust, Agriculture, Brand Identity)
  primary: "#166534", // Dark Forest Green
  primaryLight: "#16a34a", // Medium Green
  primaryDark: "#14532d", // Deepest Green
  primaryAccent: "#22c55e", // Vibrant Green for highlights

  // Primary variants for different use cases
  primary50: "#f0fdf4",
  primary100: "#dcfce7",
  primary200: "#bbf7d0",
  primary300: "#86efac",
  primary400: "#4ade80",
  primary500: "#22c55e",
  primary600: "#16a34a",
  primary700: "#15803d",
  primary800: "#166534", // Main primary
  primary900: "#14532d",

  // Clean Gray System (Cards, Backgrounds, UI Elements)
  white: "#FFFFFF", // Pure white for content
  gray25: "#fefefe", // Near white
  gray50: "#fafafa", // Lightest gray
  gray100: "#f5f5f5", // Light card backgrounds
  gray200: "#e5e5e5", // Border light
  gray300: "#d4d4d4", // Border medium
  gray400: "#a3a3a3", // Text muted
  gray500: "#737373", // Text secondary
  gray600: "#525252", // Text primary light
  gray700: "#404040", // Text primary
  gray800: "#262626", // Text primary dark
  gray900: "#171717", // Deepest text

  // Background System (Depth and Separation)
  background: "#f9fafb", // Slightly darker screen background
  backgroundLight: "#ffffff", // Pure white for cards
  backgroundCard: "#ffffff", // Card backgrounds
  backgroundSection: "#f5f5f5", // Section backgrounds
  backgroundOverlay: "rgba(23, 23, 23, 0.05)",

  // Text Hierarchy (Clean Sans-serif)
  textPrimary: "#171717", // Primary text - dark gray
  textSecondary: "#525252", // Secondary text
  textMuted: "#a3a3a3", // Muted text
  textWhite: "#ffffff", // White text
  textGreen: "#166534", // Brand text

  // Interactive Elements
  buttonPrimary: "#166534", // Dark green buttons
  buttonSecondary: "#f5f5f5", // Light gray buttons
  buttonText: "#ffffff", // White button text
  buttonTextSecondary: "#525252", // Gray button text

  // Borders (Subtle and Clean)
  border: "#e5e5e5", // Standard borders
  borderLight: "#f5f5f5", // Light borders
  borderMedium: "#d4d4d4", // Medium borders
  borderDark: "#a3a3a3", // Dark borders

  // Status Colors (Minimal and Clear)
  success: "#16a34a", // Green success
  warning: "#f59e0b", // Amber warning
  error: "#dc2626", // Red error
  info: "#2563eb", // Blue info

  // Shadows (Soft and Subtle)
  shadow: "rgba(0, 0, 0, 0.04)",
  shadowMedium: "rgba(0, 0, 0, 0.08)",
  shadowLarge: "rgba(0, 0, 0, 0.12)",
  shadowGreen: "rgba(22, 101, 52, 0.15)",

  // Gradients
  gradientPrimary: ["#166534", "#14532d"],
  gradientLight: ["#ffffff", "#f9fafb"],
  gradientCard: ["#ffffff", "#fafafa"],
};

const SIZES = {
  // Base spacing (8pt grid system)
  base: 8,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
  "4xl": 64,
  "5xl": 80,

  // Padding and margins
  padding: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  // Border radius (Soft edges)
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    "2xl": 20,
    "3xl": 24,
    full: 9999,
  },
};

// Shadow System (Soft and Modern)
const SHADOWS = {
  // Subtle shadows for cards and components
  xs: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 5,
  },

  // Green accent shadows
  green: {
    shadowColor: "#166534",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
};

// Gradient utility functions
const GRADIENTS = {
  primary: {
    light: ["#f0fdf4", "#dcfce7"],
    medium: ["#86efac", "#22c55e"],
    dark: ["#22c55e", "#15803d"],
    header: ["#ffffff", "#f0fdf4"],
  },
  card: {
    default: ["#ffffff", "#f8fafc"],
    hover: ["#f8fafc", "#f1f5f9"],
  },
};

// Shadow presets

// Modern Colors - Complete theme palette for consistent usage
export const modernColors = {
  // Primary colors (Dark Green System)
  primary: COLORS.primary,
  primaryLight: COLORS.primaryLight,
  primaryDark: COLORS.primaryDark,
  primaryAccent: COLORS.primaryAccent,

  // Clean grays
  white: COLORS.white,
  gray50: COLORS.gray50,
  gray100: COLORS.gray100,
  gray200: COLORS.gray200,
  gray400: COLORS.gray400,
  gray500: COLORS.gray500,
  gray600: COLORS.gray600,
  gray900: COLORS.gray900,

  // Backgrounds (depth and separation)
  background: COLORS.background,
  backgroundCard: COLORS.backgroundCard,
  backgroundSection: COLORS.backgroundSection,

  // Text hierarchy
  textPrimary: COLORS.textPrimary,
  textSecondary: COLORS.textSecondary,
  textMuted: COLORS.textMuted,
  textWhite: COLORS.textWhite,

  // Interactive elements
  buttonPrimary: COLORS.buttonPrimary,
  buttonSecondary: COLORS.buttonSecondary,
  border: COLORS.border,

  // Status colors
  success: COLORS.success,
  warning: COLORS.warning,
  error: COLORS.error,

  // Grain-specific colors for icons and branding
  grainGreen: "#22c55e", // Basmati Rice
  grainAmber: "#f59e0b", // Wheat
  grainYellow: "#eab308", // Maize
  grainEmerald: "#10b981", // Paddy
  grainViolet: "#8b5cf6", // Barley
};

// Legacy safe colors for backward compatibility
export const safeColors = {
  background: COLORS.background,
  backgroundLight: COLORS.backgroundLight,
  backgroundCard: COLORS.backgroundCard,
  backgroundSection: COLORS.backgroundSection,
  textPrimary: COLORS.textPrimary,
  textSecondary: COLORS.textSecondary,
  textWhite: COLORS.textWhite,
  textMuted: COLORS.textMuted,
  primary: COLORS.primary,
  primaryDark: COLORS.primaryDark,
  primaryAccent: COLORS.primaryAccent,
  white: COLORS.white,
  gray100: COLORS.gray100,
  gray200: COLORS.gray200,
  gray700: COLORS.gray700,
  border: COLORS.border,
  success: COLORS.success,
  warning: COLORS.warning,
  error: COLORS.error,
};
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider
      value={{
        COLORS,
        SIZES,
        GRADIENTS,
        SHADOWS,
        modernColors,
        TYPOGRAPHY,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
