import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";
import { TYPOGRAPHY } from "../../constants/Typography";

/**
 * EmptyProductState - Shows when no products are found
 * Displays different messages based on filter status
 */
const EmptyProductState = ({ activeFilter, statusLabel }) => {
  const { COLORS } = useTheme();

  const getMessage = () => {
    if (activeFilter === "all") {
      return "You haven't added any products yet.";
    }
    return `No products with ${statusLabel.toLowerCase()} status.`;
  };

  return (
    <View style={styles.container}>
      <Ionicons
        name="cube-outline"
        size={48}
        color="#94a3b8"
        style={styles.icon}
      />
      <Text style={[TYPOGRAPHY.h3, styles.title, { color: COLORS.dark }]}>
        No products found
      </Text>
      <Text
        style={[TYPOGRAPHY.body1, styles.subtitle, { color: COLORS.gray600 }]}
      >
        {getMessage()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 24,
  },
});

export default EmptyProductState;
