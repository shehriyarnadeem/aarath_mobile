import React, { createContext, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";

// Modern Clean Agricultural Marketplace Theme
const COLORS = {
  // Primary Dark Green System (Trust, Agriculture, Brand Identity)
  primary: "#166534",         // Dark Forest Green
  primaryLight: "#16a34a",    // Medium Green
  primaryDark: "#14532d",     // Deepest Green
  primaryAccent: "#22c55e",   // Vibrant Green for highlights
  
  // Primary variants for different use cases
  primary50: "#f0fdf4",
  primary100: "#dcfce7", 
  primary200: "#bbf7d0",
  primary300: "#86efac",
  primary400: "#4ade80",
  primary500: "#22c55e",
  primary600: "#16a34a",
  primary700: "#15803d",
  primary800: "#166534",      // Main primary
  primary900: "#14532d",

  // Clean Gray System (Cards, Backgrounds, UI Elements)
  white: "#FFFFFF",           // Pure white for content
  gray25: "#fefefe",          // Near white
  gray50: "#fafafa",          // Lightest gray
  gray100: "#f5f5f5",         // Light card backgrounds
  gray200: "#e5e5e5",         // Border light
  gray300: "#d4d4d4",         // Border medium
  gray400: "#a3a3a3",         // Text muted
  gray500: "#737373",         // Text secondary
  gray600: "#525252",         // Text primary light
  gray700: "#404040",         // Text primary
  gray800: "#262626",         // Text primary dark
  gray900: "#171717",         // Deepest text

  // Background System (Depth and Separation)
  background: "#f9fafb",      // Slightly darker screen background
  backgroundLight: "#ffffff", // Pure white for cards
  backgroundCard: "#ffffff",  // Card backgrounds
  backgroundSection: "#f5f5f5", // Section backgrounds
  backgroundOverlay: "rgba(23, 23, 23, 0.05)",

  // Text Hierarchy (Clean Sans-serif)
  textPrimary: "#171717",     // Primary text - dark gray
  textSecondary: "#525252",   // Secondary text
  textMuted: "#a3a3a3",       // Muted text
  textWhite: "#ffffff",       // White text
  textGreen: "#166534",       // Brand text

  // Interactive Elements
  buttonPrimary: "#166534",   // Dark green buttons
  buttonSecondary: "#f5f5f5", // Light gray buttons
  buttonText: "#ffffff",      // White button text
  buttonTextSecondary: "#525252", // Gray button text

  // Borders (Subtle and Clean)
  border: "#e5e5e5",          // Standard borders
  borderLight: "#f5f5f5",     // Light borders
  borderMedium: "#d4d4d4",    // Medium borders
  borderDark: "#a3a3a3",      // Dark borders

  // Status Colors (Minimal and Clear)
  success: "#16a34a",         // Green success
  warning: "#f59e0b",         // Amber warning
  error: "#dc2626",           // Red error
  info: "#2563eb",            // Blue info

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

// Typography System (Clean Sans-serif)
const TYPOGRAPHY = {
  // Font Family (System fonts for clean, readable text)
  fontFamily: {
    regular: "System",
    medium: "System",
    semibold: "System", 
    bold: "System",
  },

  // Font Weights (Clean hierarchy)
  fontWeight: {
    light: "300",
    regular: "400",
    medium: "500",
    semibold: "600", 
    bold: "700",
    extrabold: "800",
    black: "900",
  },

  // Font Sizes (Readable and scalable)
  fontSize: {
    xs: 11,      // Fine print
    sm: 13,      // Small text
    base: 15,    // Body text
    md: 17,      // Medium text
    lg: 19,      // Large text
    xl: 22,      // Extra large
    "2xl": 26,   // Headings
    "3xl": 30,   // Large headings
    "4xl": 36,   // Display text
    "5xl": 42,   // Hero text
  },

  // Line Heights (Optimal readability)
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  // Letter Spacing (Subtle and clean)
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
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
    shadowOpacity: 0.10,
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

  // Border radius
  radius: 8,
  radiusLg: 12,
  radiusXl: 16,
  radiusCard: 12,
  radiusButton: 8,

  // Component sizes
  buttonHeight: 48,
  inputHeight: 48,
  cardPadding: 16,
  headerHeight: 120,
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
const SHADOWS = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ COLORS, SIZES, GRADIENTS, SHADOWS }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
