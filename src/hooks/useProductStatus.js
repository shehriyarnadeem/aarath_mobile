import { useMemo } from "react";
import { useTheme } from "../constants/Theme";

/**
 * Custom hook for product status utilities
 * Returns status colors, labels, and helper functions
 */
export const useProductStatus = () => {
  const { COLORS } = useTheme();

  /**
   * Get color for product status
   */
  const getStatusColor = useMemo(
    () => (status) => {
      switch (status) {
        case "ACTIVE":
          return COLORS.primaryDark || "#166534";
        case "DRAFT":
          return COLORS.warning || "#f59e0b";
        case "SOLD_OUT":
          return COLORS.error || "#dc2626";
        case "INACTIVE":
          return COLORS.gray600 || "#64748b";
        case "OUT_OF_STOCK":
          return COLORS.warning || "#f59e0b";
        default:
          return COLORS.text || "#1e293b";
      }
    },
    [COLORS]
  );

  /**
   * Get human-readable label for status
   */
  const getStatusLabel = useMemo(
    () => (status) => {
      switch (status) {
        case "ACTIVE":
          return "Active";
        case "DRAFT":
          return "Draft";
        case "SOLD_OUT":
          return "Sold Out";
        case "INACTIVE":
          return "Inactive";
        case "OUT_OF_STOCK":
          return "Out of Stock";
        default:
          return status;
      }
    },
    []
  );

  /**
   * Get icon for product status
   */
  const getStatusIcon = useMemo(
    () => (status) => {
      switch (status) {
        case "ACTIVE":
          return "checkmark-circle";
        case "DRAFT":
          return "document-text";
        case "SOLD_OUT":
          return "close-circle";
        case "INACTIVE":
          return "pause-circle";
        case "OUT_OF_STOCK":
          return "alert-circle";
        default:
          return "help-circle";
      }
    },
    []
  );

  return {
    getStatusColor,
    getStatusLabel,
    getStatusIcon,
  };
};
