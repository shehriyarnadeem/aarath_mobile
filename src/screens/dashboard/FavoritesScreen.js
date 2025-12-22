import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  FlatList,
  TextInput,
  Animated,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../constants/Theme";
import { TYPOGRAPHY } from "../../constants/Typography";
import { ProductCard, SearchHeader } from "../../components/marketplace";

const { width: screenWidth } = Dimensions.get("window");

const FavoritesScreen = ({ navigation }) => {
  const { COLORS, SIZES, GRADIENTS, SHADOWS } = useTheme();

  // Fallback colors in case theme is not loaded
  const safeColors = {
    primary: "#22c55e",
    primaryDark: "#16a34a",
    white: "#ffffff",
    dark: "#0f172a",
    gray: "#64748b",
    background: "#f8fafc",
    success: "#22c55e",
    error: "#ef4444",
    warning: "#f59e0b",
    border: "#e2e8f0",
    ...COLORS,
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Mock favorite products data - using same structure as MarketplaceTab
  const favoriteProducts = [
    {
      id: "1",
      serialNumber: "10001",
      userId: "user123",
      category: "Rice",
      title: "Premium 1509 Sella Rice",
      description:
        "High-quality premium Sella rice with excellent grain length and aroma. Perfect for export and domestic markets.",
      quantity: 1000,
      unit: "Kg",
      images: [
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&auto=format",
      ],
      price: 110.0,
      priceType: "Fixed",
      environment: "MARKETPLACE",
      user: {
        id: "user123",
        name: "Ahmed Rice Traders",
        businessName: "Premium Grains Co.",
        city: "Okara",
        state: "Punjab",
        whatsapp: "+92301234567",
        whatsappVerified: true,
      },
      rating: 4.8,
      featured: true,
    },
    {
      id: "2",
      serialNumber: "10002",
      userId: "user456",
      category: "Rice",
      title: "Super Kernel Basmati",
      description:
        "Premium Super Kernel Basmati rice with extra-long grains and rich aroma. Ideal for biryanis and special occasions.",
      quantity: 500,
      unit: "Kg",
      images: [
        "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&h=400&fit=crop&auto=format",
      ],
      price: 370.0,
      priceType: "Negotiable",
      environment: "MARKETPLACE",
      user: {
        id: "user456",
        name: "Basmati Experts Ltd.",
        businessName: "Golden Grains Trading",
        city: "Lahore",
        state: "Punjab",
        whatsapp: "+92321234567",
        whatsappVerified: true,
      },
      rating: 4.9,
      featured: true,
    },
    {
      id: "3",
      serialNumber: "10003",
      userId: "user789",
      category: "Wheat",
      title: "Organic Wheat Grade A",
      description:
        "Certified organic wheat grown without chemicals or pesticides. High protein content and perfect for health-conscious consumers.",
      quantity: 2000,
      unit: "Kg",
      images: [
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop&auto=format",
      ],
      price: 125.0,
      priceType: "Fixed",
      environment: "MARKETPLACE",
      user: {
        id: "user789",
        name: "Organic Farms Co.",
        businessName: "Green Fields Ltd.",
        city: "Faisalabad",
        state: "Punjab",
        whatsapp: "+92331234567",
        whatsappVerified: true,
      },
      rating: 4.7,
      featured: false,
    },
    {
      id: "4",
      serialNumber: "10004",
      userId: "user101",
      category: "Corn",
      title: "Yellow Corn Kernels",
      description:
        "Premium quality yellow corn kernels suitable for animal feed and food processing. Moisture content optimized.",
      quantity: 1500,
      unit: "Kg",
      images: [
        "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&h=400&fit=crop&auto=format",
      ],
      price: 95.0,
      priceType: "Fixed",
      environment: "MARKETPLACE",
      user: {
        id: "user101",
        name: "Corn Valley Traders",
        businessName: "Harvest Gold Co.",
        city: "Multan",
        state: "Punjab",
        whatsapp: "+92341234567",
        whatsappVerified: true,
      },
      rating: 4.5,
      featured: false,
    },
  ];

  // Navigation handlers - same as MarketplaceTab
  const handleProductPress = (product) => {
    navigation?.navigate("ProductDetail", { product });
  };

  const handleContactPress = (product) => {
    // Handle contact action - could open WhatsApp, show contact modal, etc.
    console.log("Contact seller for product:", product.serialNumber);
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View
        style={[
          styles.emptyIconContainer,
          { backgroundColor: safeColors.primary + "10" },
        ]}
      >
        <Ionicons name="heart-outline" size={64} color={safeColors.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: safeColors.dark }]}>
        No Favorites Yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: safeColors.gray }]}>
        Start exploring the marketplace and add products to your favorites
      </Text>
      <TouchableOpacity
        style={[styles.exploreButton, { backgroundColor: safeColors.primary }]}
        onPress={() =>
          navigation?.navigate && navigation.navigate("Marketplace")
        }
      >
        <Text style={[styles.exploreButtonText, { color: safeColors.white }]}>
          Explore Marketplace
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: safeColors.background }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={safeColors.white} />

      {/* Header with Back Button */}
      <SafeAreaView style={{ backgroundColor: safeColors.white }}>
        <View
          style={[
            styles.header,
            {
              backgroundColor: safeColors.white,
              borderBottomColor: safeColors.border,
            },
          ]}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation?.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={safeColors.dark} />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text
                style={[
                  TYPOGRAPHY.h2,
                  { color: safeColors.dark, fontWeight: "700" },
                ]}
              >
                My Favorites
              </Text>
              <Text
                style={[
                  TYPOGRAPHY.bodySmall,
                  { color: safeColors.gray, marginTop: 2 },
                ]}
              >
                {favoriteProducts.length} saved products
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Products List */}
      <View style={styles.content}>
        <FlatList
          data={favoriteProducts}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={handleProductPress}
              onContact={handleContactPress}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState />}
        />
      </View>

      {/* Simple Search Modal */}
      {showSearchModal && (
        <View style={styles.searchModal}>
          <TouchableOpacity
            style={styles.searchBackdrop}
            onPress={() => setShowSearchModal(false)}
            activeOpacity={1}
          />
          <View
            style={[
              styles.searchContainer,
              { backgroundColor: safeColors.white },
            ]}
          >
            <View style={styles.searchHeader}>
              <Text
                style={[
                  TYPOGRAPHY.h4,
                  { color: safeColors.dark, fontWeight: "600" },
                ]}
              >
                Search Favorites
              </Text>
              <TouchableOpacity onPress={() => setShowSearchModal(false)}>
                <Ionicons name="close" size={24} color={safeColors.gray} />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.searchInputContainer,
                {
                  backgroundColor: safeColors.background,
                  borderColor: safeColors.border,
                },
              ]}
            >
              <Ionicons name="search" size={20} color={safeColors.gray} />
              <TextInput
                style={[
                  TYPOGRAPHY.body,
                  styles.searchInput,
                  { color: safeColors.dark },
                ]}
                placeholder="Search products, categories, sellers..."
                placeholderTextColor={safeColors.gray}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={safeColors.gray}
                  />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.searchButton,
                { backgroundColor: safeColors.primary },
              ]}
              onPress={() => {
                setShowSearchModal(false);
                // Search is already reactive
              }}
            >
              <Text
                style={[
                  TYPOGRAPHY.body,
                  { color: safeColors.white, fontWeight: "600" },
                ]}
              >
                Search
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },

  // Products List
  productsList: {
    paddingVertical: 16,
    paddingBottom: 100, // Extra padding for tab bar
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  exploreButtonText: {
    ...TYPOGRAPHY.body,
    fontWeight: "700",
  },

  // Search Modal
  searchModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  searchContainer: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
  },
  searchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
  },
  searchButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
});

export default FavoritesScreen;
