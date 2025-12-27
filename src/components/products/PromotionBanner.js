import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";
import { TYPOGRAPHY } from "../../constants/Typography";

/**
 * PromotionBanner - Advertisement banner for product promotion
 * Can be used for Meta Ads or other promotional content
 */
const PromotionBanner = ({ onPress }) => {
  const { COLORS } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.banner,
          {
            backgroundColor: "#f0fdf4",
            borderColor: "#bbf7d0",
          },
        ]}
        onPress={onPress}
      >
        <View style={styles.content}>
          <Ionicons
            name="megaphone"
            size={16}
            color="#166534"
            style={styles.icon}
          />
          <Text style={[TYPOGRAPHY.body2, styles.text]}>
            Boost your sales - Promote your products
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#64748b" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: "#166534",
    flex: 1,
  },
});

export default PromotionBanner;
