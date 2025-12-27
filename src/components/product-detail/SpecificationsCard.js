import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";
import { TYPOGRAPHY } from "../../constants/Typography";

/**
 * SpecificationsCard - Product specifications with tabs
 * @param {Object} product - Product data with specifications
 * @param {number} activeTab - Currently active tab index
 * @param {Function} onTabChange - Callback when tab changes
 */
const SpecificationsCard = ({ product, activeTab = 0, onTabChange }) => {
  const { COLORS } = useTheme();

  const tabs = ["Basic Info", "Quality", "Certifications"];

  const renderBasicInfo = () => (
    <View style={styles.specsContent}>
      <SpecRow label="Category" value={product.category} />
      <SpecRow label="Unit" value={product.unit} />
      <SpecRow label="Quantity" value={`${product.quantity} ${product.unit}`} />
      {product.minOrderQty && (
        <SpecRow
          label="Min Order"
          value={`${product.minOrderQty} ${product.unit}`}
        />
      )}
      {product.maxOrderQty && (
        <SpecRow
          label="Max Order"
          value={`${product.maxOrderQty} ${product.unit}`}
        />
      )}
      {product.harvestDate && (
        <SpecRow
          label="Harvest Date"
          value={new Date(product.harvestDate).toLocaleDateString()}
        />
      )}
      {product.farmingMethod && (
        <SpecRow label="Farming Method" value={product.farmingMethod} />
      )}
    </View>
  );

  const renderQualityParams = () => (
    <View style={styles.specsContent}>
      {product.moisture && (
        <SpecRow label="Moisture" value={`${product.moisture}%`} />
      )}
      {product.purity && (
        <SpecRow label="Purity" value={`${product.purity}%`} />
      )}
      {product.grade && <SpecRow label="Grade" value={product.grade} />}
      {product.foreignMatter && (
        <SpecRow label="Foreign Matter" value={`${product.foreignMatter}%`} />
      )}
      {product.brokenGrains && (
        <SpecRow label="Broken Grains" value={`${product.brokenGrains}%`} />
      )}
    </View>
  );

  const renderCertifications = () => (
    <View style={styles.specsContent}>
      <SpecRow
        label="Organic Certified"
        value={product.isOrganic ? "Yes" : "No"}
        valueColor={product.isOrganic ? COLORS.success : COLORS.gray}
      />
      <SpecRow
        label="Export Quality"
        value={product.isExportQuality ? "Yes" : "No"}
        valueColor={product.isExportQuality ? COLORS.success : COLORS.gray}
      />
      {product.certifications && product.certifications.length > 0 && (
        <SpecRow
          label="Certifications"
          value={product.certifications.join(", ")}
        />
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: COLORS.white }]}>
      <Text style={[TYPOGRAPHY.h3, styles.title, { color: COLORS.dark }]}>
        Specifications
      </Text>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tab,
              activeTab === index && { backgroundColor: COLORS.primary },
            ]}
            onPress={() => onTabChange(index)}
          >
            <Text
              style={[
                TYPOGRAPHY.body2,
                styles.tabText,
                {
                  color: activeTab === index ? COLORS.white : COLORS.gray600,
                },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {activeTab === 0 && renderBasicInfo()}
      {activeTab === 1 && renderQualityParams()}
      {activeTab === 2 && renderCertifications()}
    </View>
  );
};

/**
 * SpecRow - Individual specification row
 */
const SpecRow = ({ label, value, valueColor }) => {
  const { COLORS } = useTheme();

  return (
    <View style={styles.specRow}>
      <Text style={[TYPOGRAPHY.body2, { color: COLORS.gray600 }]}>{label}</Text>
      <Text
        style={[
          TYPOGRAPHY.body2,
          styles.specValue,
          { color: valueColor || COLORS.dark },
        ]}
      >
        {value || "N/A"}
      </Text>
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
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  tabText: {
    fontWeight: "600",
  },
  specsContent: {
    gap: 16,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  specValue: {
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
});

export default SpecificationsCard;
