import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";
import { TYPOGRAPHY } from "../../constants/Typography";

/**
 * ProductInfo - Product title, price, stock, and quality information
 * @param {Object} product - Product data
 * @param {boolean} isFavorite - Favorite status
 * @param {Function} onToggleFavorite - Callback for favorite toggle
 * @param {Function} formatPrice - Price formatting function
 * @param {Function} formatDate - Date formatting function
 */
const ProductInfo = ({
  product,
  isFavorite,
  onToggleFavorite,
  formatPrice,
  formatDate,
}) => {
  const { COLORS } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: COLORS.white }]}>
      {/* Title Section */}
      <View style={styles.titleSection}>
        <View style={styles.titleRow}>
          <Text
            style={[TYPOGRAPHY.h2, styles.productTitle, { color: COLORS.dark }]}
          >
            {product.title}
          </Text>
          <TouchableOpacity
            onPress={onToggleFavorite}
            style={styles.favoriteBtn}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? COLORS.error : COLORS.gray400}
            />
          </TouchableOpacity>
        </View>

        {/* Category Row */}
        <View style={styles.categoryRow}>
          <View
            style={[
              styles.categoryChip,
              { backgroundColor: COLORS.primary + "15" },
            ]}
          >
            <Text style={[styles.categoryText, { color: COLORS.primary }]}>
              {product.category}
            </Text>
          </View>
          {product.grade && (
            <View
              style={[
                styles.gradeChip,
                { backgroundColor: COLORS.warning + "15" },
              ]}
            >
              <Ionicons name="star" size={12} color={COLORS.warning} />
              <Text style={[styles.gradeText, { color: COLORS.warning }]}>
                {product.grade}
              </Text>
            </View>
          )}
          {product.priceType && (
            <View
              style={[
                styles.priceTypeChip,
                { backgroundColor: COLORS.primary + "15" },
              ]}
            >
              <Text style={[styles.priceTypeText, { color: COLORS.primary }]}>
                {product.priceType}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Price Section */}
      <View style={styles.priceSection}>
        <View style={styles.mainPriceRow}>
          <View style={styles.priceContainer}>
            <Text
              style={[TYPOGRAPHY.h1, { color: COLORS.success, fontSize: 28 }]}
            >
              {formatPrice(product.price)}
            </Text>
            <Text style={[TYPOGRAPHY.body1, { color: COLORS.gray }]}>
              per {product.unit}
            </Text>
          </View>
        </View>

        {/* Stock and Order Info */}
        <View style={styles.stockInfoCard}>
          <View style={styles.stockItem}>
            <Text style={[TYPOGRAPHY.caption, { color: COLORS.gray600 }]}>
              Available
            </Text>
            <Text style={[TYPOGRAPHY.h3, { color: COLORS.success }]}>
              {product.quantity?.toLocaleString()} {product.unit}
            </Text>
          </View>
          {product.minOrderQty && (
            <View style={styles.stockItem}>
              <Text style={[TYPOGRAPHY.caption, { color: COLORS.gray600 }]}>
                Min Order
              </Text>
              <Text style={[TYPOGRAPHY.h4, { color: COLORS.dark }]}>
                {product.minOrderQty} {product.unit}
              </Text>
            </View>
          )}
          {product.maxOrderQty && (
            <View style={styles.stockItem}>
              <Text style={[TYPOGRAPHY.caption, { color: COLORS.gray600 }]}>
                Max Order
              </Text>
              <Text style={[TYPOGRAPHY.h4, { color: COLORS.dark }]}>
                {product.maxOrderQty} {product.unit}
              </Text>
            </View>
          )}
        </View>

        {/* Quality Quick View */}
        {(product.moisture || product.purity || product.grade) && (
          <View style={styles.qualityQuickView}>
            {product.moisture && (
              <View style={styles.qualityParam}>
                <Text style={[TYPOGRAPHY.caption, { color: COLORS.gray600 }]}>
                  Moisture
                </Text>
                <Text
                  style={[
                    TYPOGRAPHY.body1,
                    { color: COLORS.success, fontWeight: "600" },
                  ]}
                >
                  {product.moisture}%
                </Text>
              </View>
            )}
            {product.purity && (
              <View style={styles.qualityParam}>
                <Text style={[TYPOGRAPHY.caption, { color: COLORS.gray600 }]}>
                  Purity
                </Text>
                <Text
                  style={[
                    TYPOGRAPHY.body1,
                    { color: COLORS.success, fontWeight: "600" },
                  ]}
                >
                  {product.purity}%
                </Text>
              </View>
            )}
            {product.grade && (
              <View style={styles.qualityParam}>
                <Text style={[TYPOGRAPHY.caption, { color: COLORS.gray600 }]}>
                  Grade
                </Text>
                <Text
                  style={[
                    TYPOGRAPHY.body1,
                    { color: COLORS.warning, fontWeight: "600" },
                  ]}
                >
                  {product.grade}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Origin Info */}
      <View style={styles.originInfo}>
        {product.user?.city && (
          <View style={styles.originItem}>
            <Ionicons
              name="location-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={[TYPOGRAPHY.body2, { color: COLORS.dark }]}>
              {product.user.city}
            </Text>
          </View>
        )}
        {product.harvestDate && (
          <View style={styles.originItem}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={COLORS.success}
            />
            <Text style={[TYPOGRAPHY.body2, { color: COLORS.dark }]}>
              Harvest: {formatDate(product.harvestDate)}
            </Text>
          </View>
        )}
        {product.farmingMethod && (
          <View style={styles.originItem}>
            <Ionicons name="leaf-outline" size={16} color={COLORS.success} />
            <Text style={[TYPOGRAPHY.body2, { color: COLORS.dark }]}>
              {product.farmingMethod} Farming
            </Text>
          </View>
        )}
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
  titleSection: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  productTitle: {
    flex: 1,
    lineHeight: 32,
  },
  favoriteBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  gradeChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  gradeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  priceTypeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 0,
  },
  priceTypeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  priceSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  mainPriceRow: {
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 8,
  },
  stockInfoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.03)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  stockItem: {
    alignItems: "center",
    flex: 1,
  },
  qualityQuickView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  qualityParam: {
    alignItems: "center",
    flex: 1,
  },
  originInfo: {
    marginTop: 12,
    gap: 8,
  },
  originItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

export default ProductInfo;
