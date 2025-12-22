import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
} from "react-native";
import { useTheme } from "../../constants/Theme";

const MyProductsTab = ({ navigation }) => {
  const { COLORS, SIZES } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  // Enhanced mock user products data (50% information)
  const userProducts = [
    {
      id: 1,
      serialNumber: 12345,
      title: "Premium Basmati Rice",
      category: "Rice",
      description:
        "Premium quality Basmati rice sourced directly from Punjab fields. Export quality with natural aroma.",
      quantity: 1000,
      unit: "Kgs",
      price: 12000,
      priceType: "Fixed Price",
      status: "Active",
      environment: "MARKETPLACE",
      views: 1250,
      inquiries: 28,
      datePosted: "2 days ago",
      lastUpdated: "2 hours ago",
      images: [
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&auto=format",
      ],
      tags: ["Premium", "Export Quality"],
      seller: {
        name: "Premium Grains Ltd.",
        verified: true,
        rating: 4.8,
        location: "Lahore, Punjab",
        whatsapp: "+9201234567890",
      },
    },
    {
      id: 2,
      serialNumber: 12346,
      title: "Organic Wheat Flour",
      category: "Wheat",
      description:
        "100% organic wheat flour, stone ground for maximum nutrition. Perfect for healthy baking.",
      quantity: 500,
      unit: "Kgs",
      price: 3500,
      priceType: "Negotiable",
      status: "Sold",
      environment: "MARKETPLACE",
      views: 856,
      inquiries: 42,
      datePosted: "1 week ago",
      lastUpdated: "5 days ago",
      images: [
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&auto=format",
      ],
      tags: ["Organic", "Stone Ground"],
      seller: {
        name: "Organic Farms Pakistan",
        verified: true,
        rating: 4.6,
        location: "Faisalabad, Punjab",
      },
    },
    {
      id: 3,
      serialNumber: 12347,
      title: "Fresh Farm Tomatoes",
      category: "Vegetables",
      description:
        "Fresh, vine-ripened tomatoes harvested daily from our organic farm. Rich in vitamins.",
      quantity: 100,
      unit: "Kgs",
      price: 800,
      priceType: "Fixed Price",
      status: "Pending",
      environment: "MARKETPLACE",
      views: 234,
      inquiries: 15,
      datePosted: "3 days ago",
      lastUpdated: "1 day ago",
      images: [
        "https://images.unsplash.com/photo-1546470427-e26264be0b0e?w=400&h=300&fit=crop&auto=format",
      ],
      tags: ["Fresh", "Organic", "Daily Harvest"],
      seller: {
        name: "Green Valley Farms",
        verified: false,
        rating: 4.2,
        location: "Multan, Punjab",
      },
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return COLORS.primary600;
      case "Sold":
        return COLORS.gray500;
      case "Pending":
        return COLORS.secondary600;
      default:
        return COLORS.gray500;
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "Active":
        return COLORS.primary50;
      case "Sold":
        return COLORS.gray100;
      case "Pending":
        return COLORS.secondary50;
      default:
        return COLORS.gray100;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.gray50 }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.gray50} />
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: "#1e293b",
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            paddingBottom: 18,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 8,
          },
        ]}
      >
        {/* Gradient Banner */}
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            zIndex: -1,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#1e293b",
            }}
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "100%",
              backgroundColor: "#059669",
              opacity: 0.18,
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "100%",
              backgroundColor: "#6366f1",
              opacity: 0.1,
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
            }}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{
              uri: "https://img.icons8.com/fluency/48/box.png",
            }}
            style={{
              width: 32,
              height: 32,
              marginRight: 12,
              borderRadius: 8,
              backgroundColor: COLORS.primary50,
            }}
          />
          <Text
            style={[
              styles.title,
              {
                color: "white",
                fontSize: 24,
                fontWeight: "800",
                letterSpacing: 0.2,
              },
            ]}
          >
            My Products
          </Text>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: COLORS.primary600,
            paddingHorizontal: 18,
            paddingVertical: 10,
            borderRadius: 14,
            elevation: 2,
            shadowColor: COLORS.primary600,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          }}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("AddProduct")}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: 16,
              fontWeight: "700",
              marginRight: 6,
              letterSpacing: 0.1,
            }}
          >
            +
          </Text>
          <Text
            style={{
              color: COLORS.white,
              fontSize: 15,
              fontWeight: "600",
              letterSpacing: 0.1,
            }}
          >
            Upload
          </Text>
        </TouchableOpacity>
      </View>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: COLORS.white,
              borderColor: COLORS.gray200,
              color: COLORS.dark,
            },
          ]}
          placeholder="Search your products..."
          placeholderTextColor={COLORS.gray400}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {/* Summary Stats */}
      <View
        style={[styles.summaryContainer, { backgroundColor: COLORS.white }]}
      >
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: COLORS.primary600 }]}>
            {userProducts.filter((p) => p.status === "Active").length}
          </Text>
          <Text style={[styles.summaryLabel, { color: COLORS.gray600 }]}>
            Active
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: COLORS.gray600 }]}>
            {userProducts.filter((p) => p.status === "Sold").length}
          </Text>
          <Text style={[styles.summaryLabel, { color: COLORS.gray600 }]}>
            Sold
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: COLORS.secondary600 }]}>
            {userProducts.filter((p) => p.status === "Pending").length}
          </Text>
          <Text style={[styles.summaryLabel, { color: COLORS.gray600 }]}>
            Pending
          </Text>
        </View>
      </View>
      {/* Products List */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {userProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={[styles.productCard, { backgroundColor: COLORS.white }]}
            onPress={() => navigation.navigate("ProductDetail", { product })}
            activeOpacity={0.9}
          >
            {/* Product Image */}
            <View style={styles.productImageContainer}>
              <Image
                source={{ uri: product.images[0] }}
                style={styles.productCardImage}
                resizeMode="cover"
              />
              <View style={styles.cardBadges}>
                <View
                  style={[
                    styles.serialBadge,
                    { backgroundColor: COLORS.primary600 },
                  ]}
                >
                  <Text style={styles.serialText}>#{product.serialNumber}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusBgColor(product.status) },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(product.status) },
                    ]}
                  >
                    {product.status}
                  </Text>
                </View>
              </View>
            </View>

            {/* Product Info */}
            <View style={styles.productInfo}>
              <View style={styles.productHeader}>
                <Text style={[styles.productTitle, { color: COLORS.dark }]}>
                  {product.title}
                </Text>
                <Text
                  style={[styles.productCategory, { color: COLORS.gray500 }]}
                >
                  {product.category} • {product.datePosted}
                </Text>
              </View>

              {/* Description Preview */}
              <Text
                style={[styles.productDescription, { color: COLORS.gray600 }]}
                numberOfLines={2}
              >
                {product.description}
              </Text>

              {/* Tags */}
              <View style={styles.tagsContainer}>
                {product.tags.slice(0, 2).map((tag, index) => (
                  <View
                    key={index}
                    style={[
                      styles.productTag,
                      { backgroundColor: COLORS.gray100 },
                    ]}
                  >
                    <Text style={[styles.tagText, { color: COLORS.gray700 }]}>
                      {tag}
                    </Text>
                  </View>
                ))}
                {product.tags.length > 2 && (
                  <Text
                    style={[styles.moreTagsText, { color: COLORS.gray500 }]}
                  >
                    +{product.tags.length - 2} more
                  </Text>
                )}
              </View>

              {/* Price and Quantity */}
              <View style={styles.priceQuantityRow}>
                <View style={styles.priceSection}>
                  <Text
                    style={[styles.productPrice, { color: COLORS.primary600 }]}
                  >
                    PKR {product.price.toLocaleString()}
                  </Text>
                  <Text style={[styles.priceUnit, { color: COLORS.gray500 }]}>
                    per {product.unit}
                  </Text>
                </View>
                <View style={styles.quantitySection}>
                  <Text style={[styles.quantityText, { color: COLORS.dark }]}>
                    {product.quantity.toLocaleString()} {product.unit}
                  </Text>
                  <Text
                    style={[styles.availableText, { color: COLORS.gray500 }]}
                  >
                    Available
                  </Text>
                </View>
              </View>

              {/* Stats */}
              <View style={styles.productStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statEmoji}>�</Text>
                  <Text style={[styles.statText, { color: COLORS.gray600 }]}>
                    {product.lastUpdated}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.productActions}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.editButton,
                    { borderColor: COLORS.primary600 },
                  ]}
                  onPress={(e) => {
                    e.stopPropagation();
                    console.log("Edit product:", product.id);
                  }}
                >
                  <Text
                    style={[
                      styles.editButtonText,
                      { color: COLORS.primary600 },
                    ]}
                  >
                    ✏️ Edit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.viewButton,
                    { backgroundColor: COLORS.primary600 },
                  ]}
                  onPress={(e) => {
                    e.stopPropagation();
                    navigation.navigate("ProductDetail", { product });
                  }}
                >
                  <Text
                    style={[styles.viewButtonText, { color: COLORS.white }]}
                  >
                    👁️ View Details
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {userProducts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={[styles.emptyTitle, { color: COLORS.dark }]}>
              No Products Yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: COLORS.gray500 }]}>
              Start selling by adding your first product to the marketplace
            </Text>
            <TouchableOpacity
              style={[
                styles.emptyButton,
                { backgroundColor: COLORS.primary600 },
              ]}
              onPress={() => navigation.navigate("AddProduct")}
            >
              <Text style={[styles.emptyButtonText, { color: COLORS.white }]}>
                Add Your First Product
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 60,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    backgroundColor: "black",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  summaryContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  productCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: "hidden",
  },
  productImageContainer: {
    position: "relative",
  },
  productCardImage: {
    width: "100%",
    height: 180,
  },
  cardBadges: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  serialBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  serialText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#ffffff",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  productInfo: {
    padding: 16,
  },
  productHeader: {
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    lineHeight: 24,
  },
  productCategory: {
    fontSize: 13,
  },
  productDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  productTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "500",
  },
  moreTagsText: {
    fontSize: 11,
    fontStyle: "italic",
  },
  priceQuantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f1f5f9",
  },
  priceSection: {
    flex: 1,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
  },
  priceUnit: {
    fontSize: 12,
  },
  quantitySection: {
    alignItems: "flex-end",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  availableText: {
    fontSize: 12,
  },
  productStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  statText: {
    fontSize: 12,
  },
  sellerSection: {
    marginBottom: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#f1f5f9",
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 6,
  },
  verifiedIcon: {
    fontSize: 12,
    color: "#10b981",
  },
  sellerLocation: {
    fontSize: 12,
  },
  productActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  editButton: {
    borderWidth: 1.5,
    backgroundColor: "transparent",
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  viewButton: {
    // backgroundColor set via style prop
  },
  viewButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MyProductsTab;
