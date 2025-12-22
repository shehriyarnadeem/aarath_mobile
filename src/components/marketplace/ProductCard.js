import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../constants/Theme";
import { TYPOGRAPHY } from "../../constants/Typography";

const ProductCard = ({ product, onPress, onContact, onFavoriteToggle }) => {
  const { COLORS, SHADOWS } = useTheme();
  const [isFavorited, setIsFavorited] = useState(product?.favorited || false);

  const handleFavoritePress = () => {
    setIsFavorited(!isFavorited);
    onFavoriteToggle?.(product, !isFavorited);
  };

  return (
    <TouchableOpacity
      style={[
        styles.productCard,
        SHADOWS.md,
        { backgroundColor: COLORS.white },
      ]}
      activeOpacity={0.97}
      onPress={() => onPress?.(product)}
    >
      <View style={styles.cardContainer}>
        {/* Left Side - Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.images[0] }}
            style={styles.productImage}
            resizeMode="cover"
          />

          {/* Favorite Heart Icon */}
          <TouchableOpacity
            style={[
              styles.favoriteButton,
              { backgroundColor: COLORS.white + "E6" },
            ]}
            onPress={handleFavoritePress}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={18}
              color={isFavorited ? "#ff4757" : COLORS.gray600}
            />
          </TouchableOpacity>

          {product.featured && (
            <View
              style={[
                styles.featuredBadge,
                { backgroundColor: COLORS.primary },
              ]}
            >
              <Ionicons name="star" size={10} color={COLORS.white} />
              <Text
                style={[
                  TYPOGRAPHY.caption,
                  { color: COLORS.white, fontSize: 10, marginLeft: 2 },
                ]}
              >
                Featured
              </Text>
            </View>
          )}
        </View>

        {/* Right Side - Content */}
        <View style={styles.contentContainer}>
          {/* Header - Category Badge */}
          <View style={styles.headerRow}>
            <View
              style={[
                styles.categoryPill,
                { backgroundColor: COLORS.primary + "15" },
              ]}
            >
              <Text
                style={[
                  TYPOGRAPHY.caption,
                  { color: COLORS.primary, fontWeight: "600" },
                ]}
              >
                {product.category}
              </Text>
            </View>
          </View>

          {/* Product Title - Medium Weight */}
          <Text
            style={[
              TYPOGRAPHY.body,
              {
                color: COLORS.textPrimary,
                fontWeight: "600",
                marginBottom: 4,
                lineHeight: 20,
              },
            ]}
            numberOfLines={2}
          >
            {product.title}
          </Text>

          {/* Price - Highlighted, Larger Font */}
          <Text
            style={[
              TYPOGRAPHY.h4,
              {
                color: COLORS.primary,
                fontWeight: "700",
                marginBottom: 8,
              },
            ]}
          >
            ₨{product.price.toLocaleString()}
            <Text
              style={[
                TYPOGRAPHY.caption,
                { color: COLORS.gray500, fontWeight: "500" },
              ]}
            >
              /{product.unit}
            </Text>
          </Text>

          {/* Product Details */}
          <View style={styles.productDetails}>
            {/* Harvest Year */}
            <View style={styles.detailItem}>
              <Ionicons
                name="calendar-outline"
                size={12}
                color={COLORS.gray500}
              />
              <Text
                style={[
                  TYPOGRAPHY.caption,
                  { color: COLORS.textSecondary, marginLeft: 4 },
                ]}
              >
                Harvested: {product.harvestYear || "2023"}
              </Text>
            </View>

            {/* Location */}
            <View style={styles.detailItem}>
              <Ionicons
                name="location-outline"
                size={12}
                color={COLORS.gray500}
              />
              <Text
                style={[
                  TYPOGRAPHY.caption,
                  { color: COLORS.textSecondary, marginLeft: 4 },
                ]}
              >
                {product.user.city}, {product.user.state}
              </Text>
            </View>

            {/* Quantity */}
            <View style={styles.detailItem}>
              <Ionicons name="cube-outline" size={12} color={COLORS.gray500} />
              <Text
                style={[
                  TYPOGRAPHY.caption,
                  { color: COLORS.textSecondary, marginLeft: 4 },
                ]}
              >
                {product.quantity} {product.unit} available
              </Text>
            </View>
          </View>

          {/* Seller Information Section */}
          <View
            style={[
              styles.sellerSection,
              { backgroundColor: COLORS.gray50, borderColor: COLORS.gray200 },
            ]}
          >
            <View style={styles.sellerInfo}>
              <View
                style={[
                  styles.sellerAvatar,
                  { backgroundColor: COLORS.primary },
                ]}
              >
                <Text
                  style={[
                    TYPOGRAPHY.caption,
                    { color: COLORS.white, fontWeight: "600" },
                  ]}
                >
                  {(
                    product.user.businessName ||
                    product.user.name ||
                    "U"
                  ).charAt(0)}
                </Text>
              </View>
              <View style={styles.sellerDetails}>
                <Text
                  style={[
                    TYPOGRAPHY.bodySmall,
                    { color: COLORS.textPrimary, fontWeight: "600" },
                  ]}
                  numberOfLines={1}
                >
                  {product.user.businessName || product.user.name}
                </Text>
                <View style={styles.sellerMeta}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={10} color="#fbbf24" />
                    <Text
                      style={[
                        TYPOGRAPHY.caption,
                        {
                          color: COLORS.textSecondary,
                          marginLeft: 2,
                          fontSize: 10,
                        },
                      ]}
                    >
                      {product.rating || "4.5"}
                    </Text>
                  </View>
                  {product.user.whatsappVerified && (
                    <View style={styles.verifiedBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={10}
                        color="#10b981"
                      />
                      <Text
                        style={[
                          TYPOGRAPHY.caption,
                          { color: "#10b981", marginLeft: 2, fontSize: 9 },
                        ]}
                      >
                        Verified
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Contact Button */}
            <TouchableOpacity
              style={[
                styles.contactButton,
                { backgroundColor: COLORS.primary },
              ]}
              onPress={() => onContact?.(product)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="chatbubble-outline"
                size={14}
                color={COLORS.white}
              />
              <Text
                style={[
                  TYPOGRAPHY.caption,
                  {
                    color: COLORS.white,
                    fontWeight: "600",
                    marginLeft: 4,
                    fontSize: 11,
                  },
                ]}
              >
                Contact
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    marginTop: 12,
    marginHorizontal: 2,
    borderRadius: 16,
    overflow: "hidden",
  },

  cardContainer: {
    flexDirection: "row",
    height: 150,
  },

  // Image Section
  imageContainer: {
    position: "relative",
  },
  productImage: {
    width: 120,
    height: 150,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 3,
    flexDirection: "row",
    alignItems: "center",
  },

  // Content Section
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-between",
  },

  headerRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  // Product Details
  productDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  // Seller Section
  sellerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  sellerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  sellerDetails: {
    marginLeft: 8,
    flex: 1,
  },
  sellerMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
});

export default ProductCard;
