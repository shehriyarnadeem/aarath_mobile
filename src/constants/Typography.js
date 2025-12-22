/**
 * Clean Minimalistic Typography System
 *
 * Inspired by platforms like PakWheels - clean, professional, and trustworthy.
 * Features modern sans-serif fonts with generous whitespace and strong readability.
 *
 * Usage Examples:
 * ```javascript
 * import { TYPOGRAPHY } from '../constants/Typography';
 *
 * <Text style={[TYPOGRAPHY.h1, { color: colors.textPrimary }]}>
 *   Clean Heading
 * </Text>
 *
 * <Text style={[TYPOGRAPHY.body, { color: colors.textSecondary }]}>
 *   Clean readable body text
 * </Text>
 * ```
 */

import { Platform } from "react-native";

// Clean Modern Font Stack (Inter-based with fallbacks)
export const FONT_FAMILIES = {
  // Primary font stack - Inter with clean fallbacks
  primary: Platform.select({
    ios: "Inter", // Will fallback to SF Pro if Inter not available
    android: "Inter", // Will fallback to Roboto if Inter not available
    default: "System",
  }),

  // System fallbacks for guaranteed compatibility
  system: Platform.select({
    ios: "SF Pro Text",
    android: "Roboto",
    default: "System",
  }),

  // Monospace for numbers/data (clean and precise)
  mono: Platform.select({
    ios: "SF Mono",
    android: "Roboto Mono",
    default: "monospace",
  }),
};

// Clean Font Weights (Light to Medium focus)
export const FONT_WEIGHTS = {
  light: "300", // Subtle text
  regular: "400", // Default body text
  medium: "500", // Emphasized text
  semibold: "600", // Headings only (clean, not heavy)
};

// Clean Typography System (PakWheels-style)
export const TYPOGRAPHY = {
  // Headings (Clean and Readable)
  h1: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: 26, // 24-28px range
    fontWeight: FONT_WEIGHTS.semibold, // 600 - bold but not heavy
    lineHeight: 32, // 1.23 ratio - tight for headings
    letterSpacing: 0.9, // Subtle tightening
  },

  h2: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: 21, // 20-22px range
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: 26, // 1.24 ratio
    letterSpacing: -0.1,
  },

  h3: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: 16, // 18-20px range
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: 24, // 1.26 ratio
    letterSpacing: 0,
  },

  // Body Text (Clean and Readable)
  body: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: 15, // 14-16px range - optimized for mobile
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: 22, // 1.47 ratio - generous for readability
    letterSpacing: 0,
  },

  bodyLarge: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: 24, // 1.5 ratio
    letterSpacing: 0,
  },

  bodySmall: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: 20, // 1.43 ratio
    letterSpacing: 0.1,
  },

  // Captions and Small Text
  caption: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: 14, // 12-13px range
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: 16, // 1.33 ratio
    letterSpacing: 0.2,
  },

  captionMedium: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: 13,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 17,
    letterSpacing: 0.1,
  },

  // Interface Elements (Clean and Functional)
  button: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: 15,
    fontWeight: FONT_WEIGHTS.medium, // 500 - clean, not heavy
    lineHeight: 18, // Tight for buttons
    letterSpacing: 0.2,
  },

  buttonSmall: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 16,
    letterSpacing: 0.1,
  },

  // Navigation and Tabs
  tabLabel: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 17,
    letterSpacing: 0.1,
  },

  // Data and Numbers (Clean Monospace)
  price: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 20,
    letterSpacing: -0.1, // Tight for data
  },

  priceSmall: {
    fontFamily: FONT_FAMILIES.mono,
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: 18,
    letterSpacing: 0,
  },

  data: {
    fontFamily: FONT_FAMILIES.mono,
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: 18,
    letterSpacing: 0,
  },
};

// Utility Functions
export const createTextStyle = (preset, customStyles = {}) => {
  const baseStyle = TYPOGRAPHY[preset] || TYPOGRAPHY.body;
  return {
    ...baseStyle,
    ...customStyles,
  };
};

// Clean Text Shadows (Minimal)
export const TEXT_SHADOWS = {
  subtle: {
    textShadowColor: "rgba(0, 0, 0, 0.08)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  medium: {
    textShadowColor: "rgba(0, 0, 0, 0.12)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
};

export default {
  FONT_FAMILIES,
  FONT_WEIGHTS,
  TYPOGRAPHY,
  createTextStyle,
  TEXT_SHADOWS,
};
