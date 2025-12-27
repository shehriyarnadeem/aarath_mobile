import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";
import { TYPOGRAPHY } from "../../constants/Typography";

/**
 * DescriptionCard - Product description with show more/less functionality
 * @param {string} description - Product description text
 * @param {boolean} showFull - Whether to show full description
 * @param {Function} onToggle - Callback to toggle description
 * @param {Array} features - Array of feature strings
 */
const DescriptionCard = ({
  description,
  showFull = false,
  onToggle,
  features = [],
}) => {
  const { COLORS } = useTheme();

  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.white }]}>
      <Text style={[TYPOGRAPHY.h3, styles.title, { color: COLORS.dark }]}>
        Description
      </Text>

      <Text
        style={[
          TYPOGRAPHY.body1,
          styles.description,
          { color: COLORS.gray700 },
        ]}
      >
        {showFull ? description : truncateText(description)}
      </Text>

      {description && description.length > 150 && (
        <TouchableOpacity onPress={onToggle} style={styles.showMoreButton}>
          <Text
            style={[
              TYPOGRAPHY.body2,
              { color: COLORS.primary, fontWeight: "600" },
            ]}
          >
            {showFull ? "Show Less" : "Show More"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Features Section */}
      {features && features.length > 0 && (
        <View style={styles.featuresSection}>
          <Text
            style={[
              TYPOGRAPHY.h4,
              styles.featuresTitle,
              { color: COLORS.dark },
            ]}
          >
            Key Features
          </Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={COLORS.success}
              />
              <Text
                style={[
                  TYPOGRAPHY.body2,
                  styles.featureText,
                  { color: COLORS.gray700 },
                ]}
              >
                {feature}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    marginBottom: 12,
  },
  description: {
    lineHeight: 24,
    marginBottom: 12,
  },
  showMoreButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  featuresSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  featuresTitle: {
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  featureText: {
    flex: 1,
    lineHeight: 20,
  },
});

export default DescriptionCard;
