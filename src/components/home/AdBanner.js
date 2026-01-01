import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";
import { TYPOGRAPHY } from "../../constants/Typography";

/**
 * AdBanner - Placeholder for Meta/Facebook advertisement banner
 * Can be customized for actual ad implementation
 */
const AdBanner = ({ onPress }) => {
  const { modernColors } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.banner,
          {
            backgroundColor: modernColors.backgroundSection,
            borderColor: modernColors.border || "#e2e8f0",
          },
        ]}
      >
        <View style={styles.content}>
          <MaterialIcons
            name="ads-click"
            size={32}
            color={modernColors.textMuted}
          />
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: modernColors.textPrimary }]}>
              Featured Advertisement
            </Text>
            <Text
              style={[styles.subtitle, { color: modernColors.textSecondary }]}
            >
              Meta Ads Placement
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: modernColors.primary }]}
            onPress={onPress}
          >
            <Text
              style={[
                TYPOGRAPHY.bodySmall,
                styles.buttonText,
                { color: modernColors.white },
              ]}
            >
              Learn More
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  banner: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: "600",
  },
});

export default AdBanner;
