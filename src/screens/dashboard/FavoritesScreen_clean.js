import React, { useState } from "react";
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
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../constants/Theme";
import { ProductCard } from "../../components/marketplace";

const { width: screenWidth } = Dimensions.get("window");

const FavoritesScreen = ({ navigation }) => {
  const { COLORS } = useTheme() || {};

  // Fallback colors in case theme is not loaded
  const safeColors = {
    primary: "#22c55e",
    primaryDark: "#16a34a",
    white: "#ffffff",
    dark: "#0f172a",
    gray: "#64748b",
    background: "#ffffff",
    success: "#22c55e",
    error: "#ef4444",
    warning: "#f59e0b",
    border: "#e2e8f0",
    ...COLORS,
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const categories = ["All", "Rice", "Wheat", "Cotton", "Corn"];

  const filteredProducts = (favoriteProducts || []).filter((product) => {
    if (!product) return false;

    const matchesSearch =
      (product.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.user?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Navigation handlers - same as MarketplaceTab
  const handleProductPress = (product) => {
    navigation?.navigate("ProductDetail", { product });
  };

  const handleContactPress = (product) => {
    // Handle contact action - could open WhatsApp, show contact modal, etc.
    console.log("Contact seller for product:", product.serialNumber);
  };

  const removeFavorite = (productId) => {
    // Handle remove from favorites
    console.log("Remove favorite:", productId);
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: safeColors.background }]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={safeColors.background}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: safeColors.white }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, { color: safeColors.dark }]}>
              My Favorites
            </Text>
            <Text style={[styles.headerSubtitle, { color: safeColors.gray }]}>
              {(favoriteProducts || []).length} saved products
            </Text>
          </View>

          <LinearGradient
            colors={[safeColors.primary, safeColors.primaryDark]}
            style={styles.favoriteIcon}
          >
            <Ionicons name="heart" size={24} color={safeColors.white} />
          </LinearGradient>
        </View>

        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: safeColors.background },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={safeColors.gray}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: safeColors.dark }]}
            placeholder="Search your favorites..."
            placeholderTextColor={safeColors.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color={safeColors.gray} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContainer}
        >
          {(categories || []).map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedCategory === category
                      ? safeColors.primary
                      : safeColors.white,
                  borderColor:
                    selectedCategory === category
                      ? safeColors.primary
                      : safeColors.border,
                },
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      selectedCategory === category
                        ? safeColors.white
                        : safeColors.dark,
                  },
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      {(filteredProducts || []).length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filteredProducts || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={handleProductPress}
              onContact={handleContactPress}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
  },
  favoriteIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  clearButton: {
    marginLeft: 8,
  },
  categoriesScroll: {
    marginHorizontal: -20,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    padding: 20,
  },
  separator: {
    height: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    fontWeight: "500",
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
    fontSize: 16,
    fontWeight: "700",
  },
});

export default FavoritesScreen;
