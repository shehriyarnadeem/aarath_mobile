import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../constants/Theme";
import { TYPOGRAPHY } from "../../constants/Typography";

const ProductCard = ({ product, onPress, onContact, onFavoriteToggle }) => {
  const { COLORS, SIZES, GRADIENTS, SHADOWS } = useTheme();
  const [isFavorited, setIsFavorited] = useState(product?.favorited || false);

  const handleFavoritePress = () => {
    setIsFavorited(!isFavorited);
    onFavoriteToggle?.(product, !isFavorited);
  };

  return (
    <TouchableOpacity
      style={styles.productCard, SHADOWS.lg}
      activeOpacity={0.97}
      onPress={() => onPress?.(product)}
    >
      {/* Modern Horizontal Layout */}
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
            <LinearGradient
              colors={["rgba(255, 193, 7, 0.9)", "rgba(255, 152, 0, 0.9)"]}
              style={styles.featuredBadge}
            >
              <Ionicons name="star" size={10} color="#fff" />
            </LinearGradient>
          )}
        </View>

        {/* Right Side - Content */}
        <View style={styles.contentContainer}>
          {/* Header Row - Serial & Category */}
          <View style={styles.headerRow}>
            <View
              style={[
                styles.serialPill,
                { backgroundColor: COLORS.primary + "20" },
              ]}
            >
              <Text style={StyleSheet.flatten([styles.serialNumber, { color: COLORS.primary }])}>
                #{product.serialNumber}
              </Text>
            </View>
            <View
              style={[
                styles.categoryPill,
                { backgroundColor: COLORS.primary + "15" },
              ]}
            >
              <Text style={StyleSheet.flatten([styles.categoryText, { color: COLORS.primary }])}>
                {product.category}
              </Text>
            </View>
          </View>

          {/* Product Title - Medium Weight */}
          <Text
            style={[
              TYPOGRAPHY.h4,
              {
                color: COLORS.textPrimary,
                fontWeight: "600",
                marginBottom: 4,
              },
            ]}
            numberOfLines={2}
          >
            {product.title}
          </Text>

          {/* Price - Highlighted, Larger Font */}
          <Text
            style={[
              TYPOGRAPHY.h3,
              {
                color: COLORS.primary,
                fontWeight: "700",
                marginBottom: 6,
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
                size={14}
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
                size={14}
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
              <Ionicons name="cube-outline" size={14} color={COLORS.gray500} />
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
          <View style={StyleSheet.flatten([styles.sellerSection, { backgroundColor: COLORS.gray50, borderColor: COLORS.gray200 }])}>
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
                    { color: COLORS.textPrimary, fontWeight: "600" }
                  ]}
                  numberOfLines={1}
                >
                  {product.user.businessName || product.user.name}
                </Text>
                <View style={styles.sellerMeta}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={12} color="#fbbf24" />
                    <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary, marginLeft: 2 }]}>
                      {product.rating || "4.5"}
                    </Text>
                  </View>
                  {product.user.whatsappVerified && (
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark-circle" size={12} color="#10b981" />
                      <Text style={[TYPOGRAPHY.caption, { color: "#10b981", marginLeft: 2, fontSize: 10 }]}>
                        Verified
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            
            {/* Contact Button */}
            <TouchableOpacity
              style={StyleSheet.flatten([styles.contactButton, { backgroundColor: COLORS.primary }])}
              onPress={() => onContact?.(product)}
              activeOpacity={0.8}
            >
              <Ionicons name="chatbubble-outline" size={16} color={COLORS.white} />
              <Text style={[TYPOGRAPHY.caption, { color: COLORS.white, fontWeight: "600", marginLeft: 4 }]}>
                Contact
              </Text>
            </TouchableOpacity>
          </View>
                  style={StyleSheet.flatten([styles.sellerName, { color: COLORS.textSecondary }])}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {product.user.businessName || product.user.name}
                </Text>
                <Text
                  style={StyleSheet.flatten([styles.location, { color: COLORS.textSecondary }])}
                  numberOfLines={1}
                >
                  {product.user.city}, {product.user.state}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    marginBottom: 16,
    marginHorizontal: 2, // Prevents shadow clipping
    borderRadius: 20,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 4, // Android shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  cardContainer: {
    flexDirection: "row",
    height: 150,
  },

  // Image Section
  imageContainer: {
    width: 120,
    height: "100%",
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  featuredBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    borderRadius: 10,
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

  // Header Row
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  serialPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  serialNumber: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Title
  title: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 18,
    marginBottom: 6,
  },

  // Price Row
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  price: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  unit: {
    fontSize: 12,
    fontWeight: "600",
  },
  quantity: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Dark Seller Section
  sellerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 0,
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
    marginRight: 10,
  },
  sellerInitial: {
    fontSize: 13,
    fontWeight: "700",
  },
  sellerDetails: {
    flex: 1,
    minWidth: 0, // Prevents text overflow
  },
  sellerName: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 2,
  },
  location: {
    fontSize: 11,
    fontWeight: "500",
  },

  // Ranking & Verification
  rankingSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rankingBadge: {
    backgroundColor: "#FFD700",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rankingNumber: {
    fontSize: 11,
    fontWeight: "800",
    color: "#000",
  },
  verifiedBadge: {
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
});

export default ProductCard;
