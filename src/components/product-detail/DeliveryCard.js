import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";
import { TYPOGRAPHY } from "../../constants/Typography";

/**
 * DeliveryCard - Product delivery information
 * @param {Object} deliveryInfo - Delivery details
 */
const DeliveryCard = ({ deliveryInfo = {} }) => {
  const { COLORS } = useTheme();

  const deliveryOptions = [
    {
      icon: "cube-outline",
      iconBg: COLORS.primary + "20",
      iconColor: COLORS.primary,
      title: "Packaging",
      text: deliveryInfo.packaging || "Standard agricultural packaging",
    },
    {
      icon: "car-outline",
      iconBg: COLORS.success + "20",
      iconColor: COLORS.success,
      title: "Delivery",
      text: deliveryInfo.deliveryMethod || "Seller coordinates delivery",
    },
    {
      icon: "location-outline",
      iconBg: COLORS.warning + "20",
      iconColor: COLORS.warning,
      title: "Available From",
      text: deliveryInfo.location || "Check with seller",
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: COLORS.white }]}>
      <Text style={[TYPOGRAPHY.h3, styles.title, { color: COLORS.dark }]}>
        Delivery & Packaging
      </Text>

      <View style={styles.deliveryInfo}>
        {deliveryOptions.map((option, index) => (
          <View key={index} style={styles.deliveryItem}>
            <View
              style={[styles.deliveryIcon, { backgroundColor: option.iconBg }]}
            >
              <Ionicons name={option.icon} size={20} color={option.iconColor} />
            </View>
            <View style={styles.deliveryContent}>
              <Text
                style={[
                  TYPOGRAPHY.body2,
                  { color: COLORS.gray600, fontWeight: "600" },
                ]}
              >
                {option.title}
              </Text>
              <Text style={[TYPOGRAPHY.body2, { color: COLORS.dark }]}>
                {option.text}
              </Text>
            </View>
          </View>
        ))}
      </View>
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
    marginBottom: 16,
  },
  deliveryInfo: {
    gap: 16,
  },
  deliveryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  deliveryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  deliveryContent: {
    flex: 1,
  },
});

export default DeliveryCard;
