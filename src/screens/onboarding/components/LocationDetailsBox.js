import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../constants/Theme";
import { useTranslation } from "react-i18next";

const LocationDetailsBox = ({ selectedMarker }) => {
  const { COLORS, SIZES } = useTheme();
  const { t } = useTranslation();

  if (!selectedMarker) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.lightGray,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View
          style={[styles.badge, { backgroundColor: COLORS.primary + "15" }]}
        >
          <Ionicons name="location-sharp" size={16} color={COLORS.primary} />
        </View>
        <Text style={[styles.title, { color: COLORS.dark }]}>
          {"Selected Location"}
        </Text>
      </View>

      {/* Details Content */}
      <View style={styles.content}>
        {/* City */}
        <View
          style={[styles.detailRow, { backgroundColor: COLORS.background }]}
        >
          <View style={styles.labelContainer}>
            <Ionicons
              name="business-outline"
              size={18}
              color={COLORS.primary}
            />
            <Text style={[styles.label, { color: COLORS.gray }]}>{"City"}</Text>
          </View>
          <Text style={[styles.value, { color: COLORS.dark }]}>
            {selectedMarker.cityLabel}
          </Text>
        </View>

        {/* Address */}
        <View
          style={[styles.detailRow, { backgroundColor: COLORS.background }]}
        >
          <View style={styles.labelContainer}>
            <Ionicons
              name="navigate-outline"
              size={18}
              color={COLORS.primary}
            />
            <Text style={[styles.label, { color: COLORS.gray }]}>
              {"Mandi Address"}
            </Text>
          </View>
          <Text
            style={[styles.value, { color: COLORS.dark, flex: 1 }]}
            numberOfLines={2}
          >
            {selectedMarker.address || "Location selected"}
          </Text>
        </View>

        {/* Coordinates */}
        <View
          style={[styles.detailRow, { backgroundColor: COLORS.background }]}
        >
          <View style={styles.labelContainer}>
            <Ionicons
              name="location-outline"
              size={18}
              color={COLORS.primary}
            />
            <Text style={[styles.label, { color: COLORS.gray }]}>
              {"Coordinates"}
            </Text>
          </View>
          <Text style={[styles.value, { color: COLORS.gray, fontSize: 13 }]}>
            {selectedMarker.latitude.toFixed(6)},{" "}
            {selectedMarker.longitude.toFixed(6)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  content: {
    gap: 14,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    minWidth: 100,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 8,
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
  },
});

export default LocationDetailsBox;
