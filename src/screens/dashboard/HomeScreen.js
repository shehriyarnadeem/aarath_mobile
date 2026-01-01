import React from "react";
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from "react-native";
import { useTheme } from "../../constants/Theme";
import {
  HomeHeader,
  AdBanner,
  CategorySlider,
  FeaturedProducts,
} from "../../components/home";
import { useFeaturedProducts } from "../../hooks/useFeaturedProducts";
import { useHomeCategories } from "../../hooks/useHomeCategories";

/**
 * HomeScreen - Main landing page for agricultural marketplace
 * Features: Categories, Featured Products, Price Trends
 */

const screenWidth = Math.round(
  require("react-native").Dimensions.get("window").width
);

const HomeScreen = ({ navigation }) => {
  const { modernColors } = useTheme();

  // Custom hooks for data management
  const { products, loading, refetch } = useFeaturedProducts(10);
  const categories = useHomeCategories();

  /**
   * Handle category selection
   * Navigate to marketplace with category filter
   */
  const handleCategoryPress = (category) => {
    navigation.navigate("Marketplace", {
      presetFilter: {
        type: "category",
        value: category.id,
        name: category.name,
        id: category.id,
      },
    });
  };

  /**
   * Handle product card press
   * Navigate to product detail screen
   */
  const handleProductPress = (product) => {
    navigation?.navigate("ProductDetail", { product });
  };

  /**
   * Handle "See All" press
   * Navigate to marketplace without filters
   */
  const handleSeeAll = () => {
    navigation?.navigate("Marketplace", {
      presetFilter: { type: "category", value: "all", id: "all" },
    });
  };

  /**
   * Handle ad banner press
   * TODO: Implement ad click tracking
   */
  const handleAdPress = () => {
    console.log("Ad banner pressed");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: modernColors.background }]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={modernColors.background}
      />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      >
        {/* Header with Logo and Welcome */}
        <HomeHeader />

        {/* Advertisement Banner */}
        <AdBanner onPress={handleAdPress} />

        {/* Category Slider */}
        <CategorySlider
          categories={categories}
          onCategoryPress={handleCategoryPress}
        />

        {/* Featured Products */}
        <FeaturedProducts
          products={products}
          loading={loading}
          onProductPress={handleProductPress}
          onSeeAll={handleSeeAll}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header Section
  header: {
    paddingHorizontal: 20,
    paddingVertical: 50,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    width: "80%",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logoGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#ffffff",
  },
  titleContainer: {
    width: "100%",
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  // Search Bar
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
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

  // Meta Ad Banner
  adBannerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  adBanner: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
  },
  adContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  adTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  adSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  adButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  adButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Filter Tabs Section
  filtersSection: {
    paddingVertical: 1,
  },
  tabHeaders: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 12,
  },
  tabHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 2,
    borderWidth: 0,
    gap: 8,
  },
  tabHeaderText: {
    fontSize: 15,
    fontWeight: "600",
  },
  filterContent: {
    flex: 1,
  },
  filterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  filterButton: {
    width: (screenWidth - 64) / 2, // 2 columns with padding and gap
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    minHeight: 100,
  },
  filterIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  // New filter slider styles
  filterSlider: {
    paddingVertical: 10,
  },
  filterSliderItem: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  filterSliderIconContainer: {
    marginBottom: 8,
  },
  filterSliderText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 14,
  },
  // Modern category image card styles
  categoryImageCard: {
    width: 140,
    height: 90,
    borderRadius: 14,
    marginHorizontal: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryImageCardSelected: {
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    transform: [{ scale: 1.05 }],
  },
  categoryImageBackground: {
    width: "100%",
    height: "100%",
  },
  categoryBackgroundImage: {
    borderRadius: 14,
  },
  categoryGradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 10,
  },
  categoryImageName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "left",
    lineHeight: 15,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // Featured Products Section
  featuredSection: {
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  productsList: {
    paddingLeft: 20,
  },
  featuredProductCard: {
    width: 150,
    marginRight: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  featuredProductImage: {
    width: "100%",
    height: 110,
  },
  featuredProductInfo: {
    padding: 12,
  },
  featuredLocationRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  // CEO Video Section
  videoSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionHeaderCenter: {
    alignItems: "center",
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 17,
    textAlign: "center",
    marginTop: 4,
  },
  videoContainer: {
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  videoThumbnail: {
    width: "100%",
    height: 200,
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
