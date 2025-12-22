import React, { useState, useRef } from "react";
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
  Dimensions,
  FlatList,
  Animated,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../constants/Theme";

const { width: screenWidth } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const { COLORS, SIZES, GRADIENTS, SHADOWS, modernColors, TYPOGRAPHY } =
    useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterTab, setSelectedFilterTab] = useState("category");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedHarvest, setSelectedHarvest] = useState("all");

  // Filter data
  const filterTabs = [
    { id: "category", name: "Categories", icon: "grid" },
    { id: "harvested", name: "Harvested", icon: "calendar" },
  ];

  const categoryFilters = [
    { id: "rice", name: "Rice", icon: "leaf" },
    { id: "paddy", name: "Paddy", icon: "nutrition" },
    { id: "wheat", name: "Wheat", icon: "flower" },
    { id: "maize", name: "Maize", icon: "sparkles" },
    { id: "barley", name: "Barley", icon: "restaurant" },
  ];

  const harvestFilters = [
    { id: "rabi2024", name: "Rabi 2024", icon: "sunny" },
    { id: "kharif2024", name: "Kharif 2024", icon: "rainy" },
    { id: "rabi2023", name: "Rabi 2023", icon: "rainy" },
    { id: "kharif2023", name: "Kharif 2023", icon: "cloud" },
  ];

  // Featured products data
  const featuredProducts = [
    {
      id: "1",
      name: "Premium Basmati Rice",
      price: "120",
      location: "Punjab, Pakistan",
      image:
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop&auto=format",
    },
    {
      id: "2",
      name: "Organic Wheat",
      price: "95",
      location: "Sindh, Pakistan",
      image:
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop&auto=format",
    },
    {
      id: "3",
      name: "Golden Maize",
      price: "85",
      location: "KPK, Pakistan",
      image:
        "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&h=200&fit=crop&auto=format",
    },
    {
      id: "4",
      name: "Fresh Paddy",
      price: "75",
      location: "Balochistan, Pakistan",
      image:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop&auto=format",
    },
  ];

  // Price trends data
  const priceData = [
    {
      id: "1",
      name: "Basmati Rice",
      price: "120",
      change: "+2.5",
      trend: "up",
      icon: "leaf",
      color: modernColors.textPrimary,
    },
    {
      id: "2",
      name: "Wheat",
      price: "95",
      change: "-1.2",
      trend: "down",
      icon: "nutrition",
      color: modernColors.textPrimary,
    },
    {
      id: "3",
      name: "Maize",
      price: "85",
      change: "+0.8",
      trend: "up",
      icon: "sparkles",
      color: modernColors.textPrimary,
    },
    {
      id: "4",
      name: "Paddy",
      price: "75",
      change: "+1.5",
      trend: "up",
      icon: "flower",
      color: modernColors.textPrimary,
    },
    {
      id: "5",
      name: "Barley",
      price: "65",
      change: "-0.5",
      trend: "down",
      icon: "restaurant",
      color: modernColors.textPrimary,
    },
  ];

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
      >
        {/* Header Section */}
        <LinearGradient
          colors={[modernColors.primary, modernColors.primaryLight]}
          style={styles.header}
        >
          {/* Logo and Title Row */}
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../../assets/logo.png")}
                style={{
                  width: 65,
                  height: 65,
                  resizeMode: "contain",
                  marginRight: 15,
                  backgroundColor: "transparent",
                }}
              />
              <View style={styles.titleContainer}>
                <Text
                  style={[
                    TYPOGRAPHY.h1,
                    { opacity: 0.9 },
                    { color: modernColors.white },
                  ]}
                >
                  Pakistan Grain Marketplace
                </Text>
                <Text
                  style={[
                    TYPOGRAPHY.body,
                    {
                      color: modernColors.white,
                      opacity: 0.9,
                    },
                  ]}
                >
                  Connecting farmers & buyers
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Meta Ad Banner */}
        <View style={styles.adBannerContainer}>
          <View
            style={[
              styles.adBanner,
              { backgroundColor: modernColors.backgroundSection },
            ]}
          >
            <View style={styles.adContent}>
              <MaterialIcons
                name="ads-click"
                size={32}
                color={modernColors.textMuted}
              />
              <View style={styles.adTextContainer}>
                <Text
                  style={[styles.adTitle, { color: modernColors.textPrimary }]}
                >
                  Featured Advertisement
                </Text>
                <Text
                  style={[
                    styles.adSubtitle,
                    { color: modernColors.textSecondary },
                  ]}
                >
                  Meta Ads Placement
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.adButton,
                  { backgroundColor: modernColors.primary },
                ]}
              >
                <Text
                  style={[
                    TYPOGRAPHY.bodySmall,
                    {
                      color: modernColors.white,
                      fontWeight: "600",
                    },
                  ]}
                >
                  Learn More
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Filter Tabs Section */}
        <LinearGradient
          colors={[modernColors.backgroundSection, modernColors.background]}
          style={styles.filtersSection}
        >
          {/* Tab Headers */}
          <View style={styles.tabHeaders}>
            {filterTabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabHeader,

                  selectedFilterTab === tab.id
                    ? modernColors.primaryDark
                    : modernColors.textSecondary,
                ]}
                onPress={() => setSelectedFilterTab(tab.id)}
              >
                <Ionicons
                  name={tab.icon}
                  size={18}
                  color={
                    selectedFilterTab === tab.id
                      ? modernColors.primaryDark
                      : modernColors.textSecondary
                  }
                />
                <Text
                  style={[
                    TYPOGRAPHY.bodySmall,
                    {
                      color:
                        selectedFilterTab === tab.id
                          ? modernColors.primaryDark
                          : modernColors.textSecondary,
                      fontWeight: "500",
                    },
                  ]}
                >
                  {tab.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Filter Buttons */}
          <View style={styles.filterContent}>
            {selectedFilterTab === "category" && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterSlider}
              >
                {categoryFilters.map((filter, index) => (
                  <TouchableOpacity
                    key={filter.id}
                    style={[
                      styles.filterSliderItem,
                      {
                        backgroundColor: "transparent",
                        borderColor: "rgba(255,255,255,0.3)",
                        borderWidth: selectedCategory === filter.id ? 2 : 1,
                      },
                      index === 0 && { marginLeft: 20 },
                      index === categoryFilters.length - 1 && {
                        marginRight: 20,
                      },
                    ]}
                    onPress={() => {
                      setSelectedCategory(filter.id);
                      navigation.navigate("Marketplace", {
                        presetFilter: {
                          type: "category",
                          value: filter.name,
                          id: filter.id,
                        },
                      });
                    }}
                  >
                    <View style={styles.filterSliderIconContainer}>
                      <Ionicons
                        name={filter.icon + "-outline"}
                        size={28}
                        color={
                          selectedCategory === filter.id
                            ? modernColors.primary
                            : modernColors.gray600
                        }
                      />
                    </View>
                    <Text
                      style={[
                        TYPOGRAPHY.bodySmall,
                        {
                          color:
                            selectedCategory === filter.id
                              ? modernColors.primary
                              : modernColors.gray600,
                          fontWeight:
                            selectedCategory === filter.id ? "600" : "500",
                        },
                      ]}
                    >
                      {filter.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {selectedFilterTab === "harvested" && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterSlider}
              >
                {harvestFilters.map((filter, index) => (
                  <TouchableOpacity
                    key={filter.id}
                    style={[
                      styles.filterSliderItem,
                      {
                        backgroundColor: "transparent",
                        borderColor: "rgba(255,255,255,0.3)",
                        borderWidth: selectedHarvest === filter.id ? 2 : 1,
                      },
                      index === 0 && { marginLeft: 20 },
                      index === harvestFilters.length - 1 && {
                        marginRight: 20,
                      },
                    ]}
                    onPress={() => {
                      setSelectedHarvest(filter.id);
                      navigation.navigate("Marketplace", {
                        presetFilter: {
                          type: "harvest",
                          value: filter.name,
                          id: filter.id,
                        },
                      });
                    }}
                  >
                    <View style={styles.filterSliderIconContainer}>
                      <Ionicons
                        name={filter.icon + "-outline"}
                        size={28}
                        color={
                          selectedHarvest === filter.id
                            ? modernColors.primary
                            : modernColors.gray600
                        }
                      />
                    </View>
                    <Text
                      style={[
                        TYPOGRAPHY.bodySmall,
                        {
                          color:
                            selectedHarvest === filter.id
                              ? modernColors.primary
                              : modernColors.gray600,
                          fontWeight:
                            selectedHarvest === filter.id ? "600" : "500",
                        },
                      ]}
                    >
                      {filter.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </LinearGradient>

        {/* Featured Products Slider */}
        <LinearGradient
          colors={[modernColors.background, modernColors.backgroundSection]}
          style={styles.featuredSection}
        >
          <View style={styles.sectionHeader}>
            <Text
              style={[
                TYPOGRAPHY.h2,
                {
                  color: modernColors.textPrimary,
                  textShadowColor: "rgba(0,0,0,0.12)",
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 2,
                },
              ]}
            >
              Featured Products
            </Text>
            <TouchableOpacity
              onPress={() => navigation?.navigate("Marketplace")}
            >
              <Text
                style={[
                  TYPOGRAPHY.bodySmall,
                  {
                    color: modernColors.textPrimary,
                    fontWeight: "600",
                  },
                ]}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={featuredProducts}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.productCard,
                  { backgroundColor: modernColors.backgroundCard },
                ]}
                onPress={() =>
                  navigation?.navigate("ProductDetail", { product: item })
                }
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.6)"]}
                  style={styles.productOverlay}
                >
                  <View style={styles.productInfo}>
                    <Text
                      style={[
                        styles.productName,
                        { color: modernColors.white },
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.productPrice,
                        { color: modernColors.white },
                      ]}
                    >
                      Rs. {item.price}/kg
                    </Text>
                    <Text
                      style={[
                        styles.productLocation,
                        { color: modernColors.white },
                      ]}
                    >
                      📍 {item.location}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          />
        </LinearGradient>

        {/* CEO Video Message Section */}
        <LinearGradient
          colors={[modernColors.backgroundSection, modernColors.background]}
          style={styles.videoSection}
        >
          <View style={styles.sectionHeaderCenter}>
            <Text
              style={[
                TYPOGRAPHY.h2,
                {
                  color: modernColors.white,
                  textShadowColor: "rgba(0,0,0,0.12)",
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 2,
                },
              ]}
            >
              Message from Our CEO
            </Text>
            <Text
              style={[
                styles.sectionSubtitle,
                {
                  color: modernColors.textPrimary,
                  textShadowColor: "rgba(0,0,0,0.2)",
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 2,
                },
              ]}
            >
              Welcome to Pakistan's first agricultural marketplace
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.videoContainer,
              { backgroundColor: modernColors.backgroundCard },
            ]}
            onPress={() => {
              // Handle video play - could open video player, YouTube, etc.
              console.log("Play CEO video");
            }}
          >
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&auto=format&face=center",
              }}
              style={styles.videoThumbnail}
              resizeMode="cover"
            />
            <View style={styles.videoOverlay}>
              <LinearGradient
                colors={[modernColors.primary, modernColors.primaryDark]}
                style={styles.playButton}
              >
                <Ionicons name="play" size={28} color={modernColors.white} />
              </LinearGradient>
            </View>
            <View style={styles.videoInfo}>
              <Text
                style={[styles.videoTitle, { color: modernColors.textPrimary }]}
              >
                "Transforming Agriculture Together"
              </Text>
              <Text
                style={[
                  styles.videoDuration,
                  { color: modernColors.textSecondary },
                ]}
              >
                ⏱️ 3:45 mins
              </Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>

        {/* Price Trends Section */}
        <LinearGradient
          colors={[modernColors.background, modernColors.backgroundSection]}
          style={styles.priceSection}
        >
          <View style={styles.sectionHeaderCenter}>
            <Text
              style={[
                TYPOGRAPHY.h2,
                {
                  color: modernColors.white,
                  textShadowColor: "rgba(0,0,0,0.12)",
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 2,
                },
              ]}
            >
              Current Grain Prices
            </Text>
            <Text
              style={[
                styles.sectionSubtitle,
                {
                  color: modernColors.textPrimary,
                  textShadowColor: "rgba(0,0,0,0.2)",
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 2,
                },
              ]}
            >
              Live market rates updated daily
            </Text>
          </View>

          <View
            style={[
              styles.priceTable,
              { backgroundColor: modernColors.backgroundCard },
            ]}
          >
            {/* Table Header */}
            <View
              style={[
                styles.tableHeader,
                { backgroundColor: modernColors.backgroundSection },
              ]}
            >
              <Text
                style={[
                  styles.tableHeaderText,
                  { color: modernColors.textPrimary },
                ]}
              >
                Type
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  { color: modernColors.textPrimary },
                ]}
              >
                Price per Kg
              </Text>
            </View>

            {/* Table Rows */}
            {priceData.map((item, index) => (
              <View key={item.id} style={[styles.tableRow]}>
                <View style={styles.grainInfo}>
                  <View style={[styles.grainIcon]}>
                    <Ionicons name={item.icon} size={24} color={item.color} />
                  </View>
                  <Text
                    style={[
                      styles.grainName,
                      { color: modernColors.textPrimary },
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>
                <View style={styles.priceInfo}>
                  <Text
                    style={[
                      TYPOGRAPHY.price,
                      {
                        color: modernColors.primary,
                        fontFamily: TYPOGRAPHY.price,
                        fontWeight: "600",
                      },
                    ]}
                  >
                    Rs. {item.price}
                  </Text>
                  <View style={styles.trendContainer}>
                    <Ionicons
                      name={
                        item.trend === "up" ? "trending-up" : "trending-down"
                      }
                      size={12}
                      color={
                        item.trend === "up"
                          ? modernColors.success
                          : modernColors.error
                      }
                    />
                    <Text
                      style={[
                        styles.trendText,
                        {
                          color:
                            item.trend === "up"
                              ? modernColors.success
                              : modernColors.error,
                        },
                      ]}
                    >
                      {item.change}%
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Powered by Footer */}
            <View
              style={[
                styles.tableFooter,
                { borderTopColor: modernColors.border },
              ]}
            >
              <View style={styles.poweredByContainer}>
                <Text
                  style={[
                    styles.poweredByText,
                    { color: modernColors.textSecondary },
                  ]}
                >
                  Powered by
                </Text>

                <Image
                  source={require("../../../assets/logo.png")}
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </LinearGradient>
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
    paddingHorizontal: 20,
    paddingVertical: 24,
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
  productCard: {
    width: 200,
    height: 120,
    marginRight: 16,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "70%",
    justifyContent: "flex-end",
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 2,
  },
  productLocation: {
    fontSize: 11,
    opacity: 0.9,
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  videoInfo: {
    padding: 16,
    alignItems: "center",
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  videoDuration: {
    fontSize: 12,
    fontWeight: "500",
  },

  // Price Trends Section
  priceSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  priceTable: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: "700",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e2e8f0",
  },
  grainInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  grainIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  grainName: {
    fontSize: 16,
    fontWeight: "600",
  },
  priceInfo: {
    alignItems: "flex-end",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: "600",
  },
  tableFooter: {
    paddingVertical: 16,
    borderTopWidth: 1,
    alignItems: "center",
  },
  poweredByContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  poweredByText: {
    fontSize: 12,
    fontWeight: "500",
  },
  footerLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  footerLogoText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#ffffff",
  },
  brandText: {
    fontSize: 14,
    fontWeight: "700",
  },

  // Content
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
});

export default HomeScreen;
