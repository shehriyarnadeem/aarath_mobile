import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";
import { useLanguage } from "../../context/LanguageContext";
import { TYPOGRAPHY } from "../../constants/Typography";

/**
 * Reusable empty state component for marketplace
 * Shows different states: loading, error, no results
 */
const EmptyState = ({ type = "empty", error = null }) => {
  const { COLORS } = useTheme();
  const { t } = useLanguage();

  const getEmptyStateConfig = () => {
    switch (type) {
      case "loading":
        return {
          icon: "hourglass-outline",
          iconColor: COLORS.primary,
          title: t("marketplace.loadingProducts"),
          message: null,
        };

      case "error":
        return {
          icon: "alert-circle",
          iconColor: COLORS.error,
          title: t("marketplace.errorLoading"),
          message: error || t("marketplace.errorLoadingMessage"),
        };

      case "empty":
      default:
        return {
          icon: "search",
          iconColor: COLORS.gray400,
          title: t("marketplace.noProducts"),
          message: t("marketplace.noProductsMessage"),
        };
    }
  };

  const config = getEmptyStateConfig();

  return (
    <View style={styles.container}>
      <Ionicons name={config.icon} size={64} color={config.iconColor} />
      <Text
        style={[TYPOGRAPHY.h4, styles.title, { color: COLORS.textPrimary }]}
      >
        {config.title}
      </Text>
      {config.message && (
        <Text
          style={[
            TYPOGRAPHY.body,
            styles.message,
            { color: COLORS.textSecondary },
          ]}
        >
          {config.message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  title: {
    marginTop: 16,
  },
  message: {
    textAlign: "center",
    marginTop: 8,
  },
});

export default EmptyState;
