import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  Alert,
  Linking,
} from "react-native";
import { useTheme } from "../../constants/Theme";

const { width: screenWidth } = Dimensions.get("window");

const ProductDetailScreen = ({ navigation, route }) => {
  const { COLORS } = useTheme();
  const { product } = route.params;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleContactSeller = () => {
    if (product.user.whatsapp) {
      const message = `Hi, I'm interested in your ${product.title} (Serial: ${product.serialNumber}). Could you provide more details?`;
      const whatsappUrl = `whatsapp://send?phone=${
        product.user.whatsapp
      }&text=${encodeURIComponent(message)}`;

      Linking.canOpenURL(whatsappUrl)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(whatsappUrl);
          } else {
            Alert.alert(
              "WhatsApp not installed",
              "Please install WhatsApp to contact the seller"
            );
          }
        })
        .catch((err) => console.error("Error opening WhatsApp:", err));
    } else {
      Alert.alert("Contact Info", "Seller contact information not available");
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.gray50 }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.gray50} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.white }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backButtonText, { color: COLORS.primary600 }]}>
            ← Back
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: COLORS.dark }]}>
          Product Details
        </Text>
        <TouchableOpacity style={styles.shareButton}>
          <Text style={[styles.shareButtonText, { color: COLORS.primary600 }]}>
            Share
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Images Gallery */}
        <View style={styles.imageGalleryContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / screenWidth
              );
              setSelectedImageIndex(index);
            }}
          >
            {product.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Image Indicator */}
          <View style={styles.imageIndicator}>
            {product.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicatorDot,
                  {
                    backgroundColor:
                      index === selectedImageIndex
                        ? COLORS.primary600
                        : COLORS.gray300,
                  },
                ]}
              />
            ))}
          </View>

          {/* Badges */}
          <View style={styles.badgeContainer}>
            {product.featured && (
              <View style={[styles.badge, { backgroundColor: "#fbbf24" }]}>
                <Text style={styles.badgeText}>⭐ Featured</Text>
              </View>
            )}
            <View style={[styles.badge, { backgroundColor: "#3b82f6" }]}>
              <Text style={styles.badgeText}>🏪 {product.environment}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: "#64748b" }]}>
              <Text style={styles.badgeText}>#{product.serialNumber}</Text>
            </View>
          </View>
        </View>

        {/* Product Basic Info */}
        <View style={[styles.section, { backgroundColor: COLORS.white }]}>
          <View style={styles.titleCategoryRow}>
            <Text style={[styles.productTitle, { color: COLORS.dark }]}>
              {product.title}
            </Text>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: COLORS.primary100 },
              ]}
            >
              <Text style={[styles.categoryText, { color: COLORS.primary700 }]}>
                {product.category}
              </Text>
            </View>
          </View>

          {/* Price Information */}
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: COLORS.success600 }]}>
                PKR {product.price}
              </Text>
              <Text style={[styles.priceUnit, { color: COLORS.gray600 }]}>
                per {product.unit}
              </Text>
            </View>
            <View
              style={[
                styles.priceTypeBadge,
                { backgroundColor: COLORS.gray100 },
              ]}
            >
              <Text style={[styles.priceTypeText, { color: COLORS.gray700 }]}>
                {product.priceType} Price
              </Text>
            </View>
          </View>

          {/* Quantity & Availability */}
          <View style={styles.quantitySection}>
            <View style={styles.quantityCard}>
              <Text
                style={[styles.quantityNumber, { color: COLORS.primary600 }]}
              >
                {product.quantity.toLocaleString()}
              </Text>
              <Text style={[styles.quantityLabel, { color: COLORS.gray600 }]}>
                {product.unit} Available
              </Text>
            </View>
            <View style={styles.statusCard}>
              <Text style={[styles.statusIcon, { color: COLORS.success600 }]}>
                ✅
              </Text>
              <Text style={[styles.statusText, { color: COLORS.success600 }]}>
                In Stock
              </Text>
            </View>
          </View>
        </View>

        {/* Product Description */}
        <View style={[styles.section, { backgroundColor: COLORS.white }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>
            📝 Product Description
          </Text>
          <Text style={[styles.description, { color: COLORS.gray700 }]}>
            {product.description}
          </Text>
        </View>

        {/* Product Details */}
        <View style={[styles.section, { backgroundColor: COLORS.white }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>
            📋 Product Details
          </Text>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: COLORS.gray600 }]}>
                Serial Number
              </Text>
              <Text style={[styles.detailValue, { color: COLORS.dark }]}>
                #{product.serialNumber}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: COLORS.gray600 }]}>
                Category
              </Text>
              <Text style={[styles.detailValue, { color: COLORS.dark }]}>
                {product.category}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: COLORS.gray600 }]}>
                Unit Type
              </Text>
              <Text style={[styles.detailValue, { color: COLORS.dark }]}>
                {product.unit}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: COLORS.gray600 }]}>
                Price Type
              </Text>
              <Text style={[styles.detailValue, { color: COLORS.dark }]}>
                {product.priceType}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: COLORS.gray600 }]}>
                Environment
              </Text>
              <Text style={[styles.detailValue, { color: COLORS.dark }]}>
                {product.environment}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: COLORS.gray600 }]}>
                Listed Date
              </Text>
              <Text style={[styles.detailValue, { color: COLORS.dark }]}>
                {formatDate(product.createdAt).split(",")[0]}
              </Text>
            </View>
          </View>
        </View>

        {/* Seller Information */}
        <View style={[styles.section, { backgroundColor: COLORS.white }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>
            👤 Seller Information
          </Text>

          <View style={styles.sellerCard}>
            <View
              style={[
                styles.sellerAvatar,
                { backgroundColor: COLORS.primary600 },
              ]}
            >
              <Text style={[styles.sellerInitial, { color: COLORS.white }]}>
                {product.user?.businessName
                  ? product.user?.businessName.charAt(0)
                  : product.user?.name?.charAt(0) || "U"}
              </Text>
            </View>

            <View style={styles.sellerInfo}>
              <View style={styles.sellerNameRow}>
                <Text style={[styles.sellerName, { color: COLORS.dark }]}>
                  {product.user?.businessName ||
                    product.user?.name ||
                    "Unknown Seller"}
                </Text>
              </View>

              {product.user?.name && product.user?.businessName && (
                <Text style={[styles.personalName, { color: COLORS.gray600 }]}>
                  Contact: {product.user?.name}
                </Text>
              )}

              <Text style={[styles.sellerLocation, { color: COLORS.gray600 }]}>
                📍 {product.user?.city}, {product.user?.state}
              </Text>

              {product?.user?.whatsapp && (
                <Text
                  style={[styles.whatsappNumber, { color: COLORS.success600 }]}
                >
                  📱 {product.user?.whatsapp}
                  {product.user.whatsappVerified && " (Verified)"}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Timestamps */}
        <View style={[styles.section, { backgroundColor: COLORS.white }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>
            🕒 Timeline
          </Text>

          <View style={styles.timelineItem}>
            <Text style={[styles.timelineLabel, { color: COLORS.gray600 }]}>
              Listed On:
            </Text>
            <Text style={[styles.timelineValue, { color: COLORS.dark }]}>
              {formatDate(product.createdAt)}
            </Text>
          </View>

          <View style={styles.timelineItem}>
            <Text style={[styles.timelineLabel, { color: COLORS.gray600 }]}>
              Last Updated:
            </Text>
            <Text style={[styles.timelineValue, { color: COLORS.dark }]}>
              {formatDate(product.updatedAt)}
            </Text>
          </View>
        </View>

        {/* Rating Section (if available) */}
        {product.rating && (
          <View style={[styles.section, { backgroundColor: COLORS.white }]}>
            <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>
              ⭐ Rating & Reviews
            </Text>

            <View style={styles.ratingCard}>
              <View style={styles.ratingScore}>
                <Text
                  style={[styles.ratingNumber, { color: COLORS.warning600 }]}
                >
                  {product.rating}
                </Text>
                <Text
                  style={[styles.ratingStars, { color: COLORS.warning600 }]}
                >
                  {"⭐".repeat(Math.floor(product.rating))}
                </Text>
              </View>
              <Text style={[styles.reviewCount, { color: COLORS.gray600 }]}>
                Based on {product.reviews} reviews
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: COLORS.white }]}>
        <TouchableOpacity
          style={[styles.favoriteButton, { backgroundColor: COLORS.gray100 }]}
        >
          <Text style={[styles.favoriteIcon, { color: COLORS.gray600 }]}>
            🤍
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.contactSellerButton,
            { backgroundColor: COLORS.success600 },
          ]}
          onPress={handleContactSeller}
        >
          <Text style={[styles.contactSellerText, { color: COLORS.white }]}>
            💬 Contact Seller
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  shareButton: {
    padding: 4,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },

  // Image Gallery
  imageGalleryContainer: {
    position: "relative",
    marginBottom: 16,
  },
  productImage: {
    width: screenWidth,
    height: 300,
  },
  imageIndicator: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },

  // Sections
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },

  // Basic Info
  titleCategoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 32,
    flex: 1,
    marginRight: 16,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Price Section
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
  },
  priceUnit: {
    fontSize: 16,
    fontWeight: "500",
  },
  priceTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceTypeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Quantity Section
  quantitySection: {
    flexDirection: "row",
    gap: 16,
  },
  quantityCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
  },
  quantityNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  statusCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
  },
  statusIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },

  // Description
  description: {
    fontSize: 16,
    lineHeight: 24,
  },

  // Details Grid
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  detailItem: {
    width: "48%",
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
  },

  // Seller Card
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  sellerInitial: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sellerInfo: {
    flex: 1,
  },
  sellerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedIcon: {
    fontSize: 12,
    fontWeight: "bold",
  },
  personalName: {
    fontSize: 14,
    marginBottom: 4,
  },
  sellerLocation: {
    fontSize: 14,
    marginBottom: 4,
  },
  whatsappNumber: {
    fontSize: 14,
    fontWeight: "500",
  },

  // Timeline
  timelineItem: {
    marginBottom: 12,
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  timelineValue: {
    fontSize: 16,
  },

  // Rating
  ratingCard: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fefce8",
    borderRadius: 12,
  },
  ratingScore: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  ratingNumber: {
    fontSize: 32,
    fontWeight: "bold",
  },
  ratingStars: {
    fontSize: 20,
  },
  reviewCount: {
    fontSize: 14,
  },

  // Bottom Bar
  bottomBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  favoriteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteIcon: {
    fontSize: 20,
  },
  contactSellerButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  contactSellerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProductDetailScreen;
