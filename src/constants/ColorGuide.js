/**
 * Modern Agricultural Marketplace Color System
 *
 * This file documents all available colors in our design system.
 * Import modernColors from Theme.js or use the useTheme() hook for consistency.
 *
 * Usage Examples:
 * ```javascript
 * import { modernColors } from '../constants/Theme';
 * // OR
 * const { modernColors } = useTheme();
 *
 * // Primary colors
 * backgroundColor: modernColors.primary
 * color: modernColors.textWhite
 * ```
 */

// === PRIMARY COLORS (Dark Green Agricultural Theme) ===
export const PRIMARY_COLORS = {
  primary: "#166534", // Dark Forest Green - Main brand color
  primaryLight: "#16a34a", // Medium Green - Lighter variant
  primaryDark: "#14532d", // Deepest Green - For gradients and depth
  primaryAccent: "#22c55e", // Vibrant Green - Highlights and CTAs
};

// === GRAY SCALE (Clean and Modern) ===
export const GRAY_COLORS = {
  white: "#FFFFFF", // Pure white - Cards and content
  gray50: "#fafafa", // Lightest gray - Subtle backgrounds
  gray100: "#f5f5f5", // Light gray - Section backgrounds
  gray200: "#e5e5e5", // Border color
  gray400: "#a3a3a3", // Muted text
  gray500: "#737373", // Secondary text
  gray600: "#525252", // Primary light text
  gray900: "#171717", // Deepest text color
};

// === BACKGROUND COLORS (Depth and Separation) ===
export const BACKGROUND_COLORS = {
  background: "#f9fafb", // Main screen background (slightly darker)
  backgroundCard: "#ffffff", // Pure white for cards
  backgroundSection: "#f5f5f5", // Light section backgrounds
};

// === TEXT COLORS (Clean Hierarchy) ===
export const TEXT_COLORS = {
  textPrimary: "#171717", // Primary text - dark gray
  textSecondary: "#525252", // Secondary text
  textMuted: "#a3a3a3", // Muted/disabled text
  textWhite: "#ffffff", // White text for dark backgrounds
};

// === INTERACTIVE COLORS ===
export const INTERACTIVE_COLORS = {
  buttonPrimary: "#166534", // Green buttons
  buttonSecondary: "#f5f5f5", // Light gray buttons
  border: "#e5e5e5", // Standard borders
};

// === STATUS COLORS ===
export const STATUS_COLORS = {
  success: "#16a34a", // Green for success states
  warning: "#f59e0b", // Amber for warnings
  error: "#dc2626", // Red for errors
};

// === GRADIENT COMBINATIONS ===
export const GRADIENTS = {
  primary: ["#166534", "#14532d"], // Primary gradient
  header: ["#166534", "#16a34a"], // Header gradient
  card: ["#ffffff", "#f5f5f5"], // Subtle card gradient
  section: ["#f5f5f5", "#f9fafb"], // Section backgrounds
};

// === SHADOW COLORS ===
export const SHADOW_COLORS = {
  shadow: "rgba(0, 0, 0, 0.1)", // Standard shadow
  shadowLight: "rgba(0, 0, 0, 0.05)", // Light shadow
  shadowMedium: "rgba(0, 0, 0, 0.15)", // Medium shadow
  shadowGreen: "rgba(22, 101, 52, 0.15)", // Green accent shadow
};

// === USAGE GUIDE ===
export const USAGE_EXAMPLES = {
  // Headers and titles
  headerBackground: PRIMARY_COLORS.primary,
  headerText: TEXT_COLORS.textWhite,

  // Cards and containers
  cardBackground: BACKGROUND_COLORS.backgroundCard,
  cardText: TEXT_COLORS.textPrimary,

  // Buttons
  primaryButton: PRIMARY_COLORS.primary,
  primaryButtonText: TEXT_COLORS.textWhite,
  secondaryButton: INTERACTIVE_COLORS.buttonSecondary,
  secondaryButtonText: TEXT_COLORS.textSecondary,

  // Sections
  sectionBackground: BACKGROUND_COLORS.backgroundSection,
  screenBackground: BACKGROUND_COLORS.background,

  // Borders and dividers
  borderColor: INTERACTIVE_COLORS.border,

  // Status indicators
  successColor: STATUS_COLORS.success,
  warningColor: STATUS_COLORS.warning,
  errorColor: STATUS_COLORS.error,
};

export default {
  PRIMARY_COLORS,
  GRAY_COLORS,
  BACKGROUND_COLORS,
  TEXT_COLORS,
  INTERACTIVE_COLORS,
  STATUS_COLORS,
  GRADIENTS,
  SHADOW_COLORS,
  USAGE_EXAMPLES,
};
