import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  AntDesign,
  FontAwesome,
} from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";

const { width: screenWidth } = Dimensions.get("window");

const MarketplaceTab = ({ navigation }) => {
  const { COLORS, SIZES } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Modern category system
  const categories = [
    {
      id: "all",
      name: "All",
      iconName: "storefront",
      iconFamily: "MaterialIcons",
      color: "#6366f1",
    },
    {
      id: "Rice",
      name: "Rice",
      iconName: "grain",
      iconFamily: "MaterialIcons",
      color: "#10b981",
    },
    {
      id: "Wheat",
      name: "Wheat",
      iconName: "grass",
      iconFamily: "MaterialIcons",
      color: "#f59e0b",
    },
    {
      id: "Pulses",
      name: "Pulses",
      iconName: "nature",
      iconFamily: "MaterialIcons",
      color: "#ef4444",
    },
    {
      id: "Spices",
      name: "Spices",
      iconName: "local-florist",
      iconFamily: "MaterialIcons",
      color: "#8b5cf6",
    },
    {
      id: "Vegetables",
      name: "Vegetables",
      iconName: "eco",
      iconFamily: "MaterialIcons",
      color: "#059669",
    },
  ];

  const sortOptions = [
    { id: "featured", name: "Featured", icon: "⭐" },
    { id: "price_low", name: "Price: Low to High", icon: "📈" },
    { id: "price_high", name: "Price: High to Low", icon: "📉" },
    { id: "newest", name: "Newest First", icon: "🆕" },
    { id: "rating", name: "Top Rated", icon: "�" },
  ];

  // Modern product data structure based on schema
  const sampleProducts = [
    {
      serialNumber: 1001,
      userId: "user123",
      category: "Rice",
      title: "Premium 1509 Sella Rice",
      description:
        "High-quality premium Sella rice with excellent grain length and aroma. Perfect for export and domestic markets. Aged for optimal taste and texture.",
      quantity: 1000,
      unit: "Kg",
      images: [
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&h=400&fit=crop&auto=format",
      ],
      createdAt: "2024-11-20T10:30:00Z",
      updatedAt: "2024-11-25T15:45:00Z",
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
      auctionRoom: null,
      // Additional display data
      rating: 4.8,
      reviews: 124,
      featured: true,
    },
    {
      serialNumber: 1002,
      userId: "user456",
      category: "Rice",
      title: "Super Kernel Basmati",
      description:
        "Premium Super Kernel Basmati rice with extra-long grains and rich aroma. Ideal for biryanis and special occasions. Export quality guaranteed.",
      quantity: 500,
      unit: "Kg",
      images: [
        "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=600&h=400&fit=crop&auto=format",
      ],
      createdAt: "2024-11-18T08:15:00Z",
      updatedAt: "2024-11-24T12:30:00Z",
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
      auctionRoom: null,
      // Additional display data
      rating: 4.9,
      reviews: 89,
      featured: true,
    },
    {
      serialNumber: 1003,
      userId: "user789",
      category: "Wheat",
      title: "Organic Wheat Grade A",
      description:
        "Certified organic wheat grown without chemicals or pesticides. High protein content and perfect for health-conscious consumers. Grade A quality.",
      quantity: 2000,
      unit: "Kg",
      images: [
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1628690082687-4d6f1b5ba53e?w=600&h=400&fit=crop&auto=format",
      ],
      createdAt: "2024-11-15T14:20:00Z",
      updatedAt: "2024-11-23T09:15:00Z",
      price: 125.0,
      priceType: "Fixed",
      environment: "MARKETPLACE",
      user: {
        id: "user789",
        name: "Organic Farms Pakistan",
        businessName: "Green Valley Organics",
        city: "Faisalabad",
        state: "Punjab",
        whatsapp: "+92311234567",
        whatsappVerified: true,
      },
      auctionRoom: null,
      // Additional display data
      rating: 4.7,
      reviews: 67,
      featured: false,
    },
    {
      serialNumber: 1004,
      userId: "user101",
      category: "Pulses",
      title: "Red Kidney Beans",
      description:
        "Premium quality red kidney beans, rich in protein and fiber. Perfect for traditional dishes and healthy cooking. Carefully sorted and cleaned.",
      quantity: 300,
      unit: "Kg",
      images: [
        "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=600&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=400&fit=crop&auto=format",
      ],
      createdAt: "2024-11-22T11:45:00Z",
      updatedAt: "2024-11-25T16:20:00Z",
      price: 450.0,
      priceType: "Fixed",
      environment: "MARKETPLACE",
      user: {
        id: "user101",
        name: "Health Grains Co.",
        businessName: "Nutrition Plus Trading",
        city: "Islamabad",
        state: "Federal",
        whatsapp: "+92331234567",
        whatsappVerified: true,
      },
      auctionRoom: null,
      // Additional display data
      rating: 4.5,
      reviews: 43,
      featured: true,
    },
  ];

  // Helper functions
  const formatPrice = (price) => `PKR ${price?.toLocaleString() || "0"}`;
  const getDiscountPercentage = (price, originalPrice) => {
    if (!originalPrice) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const filteredProducts = sampleProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.user.businessName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      product.user.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Modern Product Card Component - 50% Information Display
  const ProductCard = ({ product, index }) => {
    const cardWidth = screenWidth - 32;

    // Format date for display
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    };

    return (
      <TouchableOpacity
        style={[
          styles.modernCard,
          { width: cardWidth },
          viewMode === "list" && styles.listCard,
        ]}
        activeOpacity={0.9}
      >
        {/* Product Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: product.images[0] }}
            style={[
              styles.modernImage,
              viewMode === "list" && styles.listImage,
            ]}
            resizeMode="cover"
          />

          {/* Badges */}
          <View style={styles.badgeContainer}>
            {product.featured && (
              <View style={[styles.badge, styles.featuredBadge]}>
                <Text style={styles.badgeText}>⭐ Featured</Text>
              </View>
            )}
            {product.environment === "MARKETPLACE" && (
              <View style={[styles.badge, styles.marketplaceBadge]}>
                <Text style={styles.badgeText}>� Market</Text>
              </View>
            )}
            <View style={[styles.badge, styles.serialBadge]}>
              <Text style={styles.badgeText}>#{product.serialNumber}</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>🤍</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Info - 50% Schema Information */}
        <View style={styles.cardContent}>
          {/* Title & Category */}
          <View style={styles.titleRow}>
            <Text style={styles.productTitle} numberOfLines={2}>
              {product.title}
            </Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
          </View>

          {/* Description Preview */}
          <Text style={styles.descriptionPreview} numberOfLines={2}>
            {product.description}
          </Text>

          {/* Price & Quantity Row */}
          <View style={styles.priceQuantityRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.currentPrice}>PKR {product.price}</Text>
              <Text style={styles.priceType}>
                {product.priceType} • per {product.unit}
              </Text>
            </View>
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityText}>
                {product.quantity} {product.unit}
              </Text>
              <Text style={styles.quantityLabel}>Available</Text>
            </View>
          </View>

          {/* Seller Info */}
          <View style={styles.sellerRow}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerInitial}>
                {product.user?.businessName
                  ? product.user?.businessName.charAt(0)
                  : product.user?.name?.charAt(0) || "U"}
              </Text>
            </View>
            <View style={styles.sellerInfo}>
              <View style={styles.sellerNameRow}>
                <Text style={styles.sellerName} numberOfLines={1}>
                  {product.user.businessName || product.user.name}
                </Text>
                {product.user.whatsappVerified && (
                  <Text style={styles.verifiedIcon}>✓</Text>
                )}
              </View>
              <Text style={styles.sellerLocation}>
                📍 {product.user.city}, {product.user.state}
              </Text>
            </View>
          </View>

          {/* Meta Info */}
          <View style={styles.metaRow}>
            <Text style={styles.dateText}>
              📅 Listed {formatDate(product.createdAt)}
            </Text>
            {product.rating && (
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingIcon}>⭐</Text>
                <Text style={styles.ratingText}>{product.rating}</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={() => navigation?.navigate("ProductDetail", { product })}
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonText}>💬 Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.modernContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Modern Header */}
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
        {/* App Title & Subtitle */}
        <View style={{ paddingVertical: 22, paddingHorizontal: 8 }}>
          <Text
            style={[
              styles.appTitle,
              {
                color: "#fff",
                fontSize: 30,
                fontWeight: "bold",
                letterSpacing: 1,
                textShadowColor: "#059669",
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 10,
              },
            ]}
          >
            Pakistan's First
          </Text>
          <Text
            style={[
              styles.appSubtitle,
              {
                color: "#a5b4fc",
                fontSize: 15,
                fontWeight: "700",
                marginTop: 6,
                textShadowColor: "#059669",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 6,
              },
            ]}
          >
            Agricultural Marketplace
          </Text>
        </View>
        {/* Search Bar */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: "#f1f5f9",
              borderRadius: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: "#6366f1",
            },
          ]}
        >
          <Text style={[styles.searchIcon, { color: "#6366f1" }]}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: "#1e293b" }]}
            placeholder="Search products, categories..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
          bounces={false}
          overScrollMode="never"
          nestedScrollEnabled={false}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                selectedCategory === category.id && {
                  backgroundColor: category.color,
                  borderColor: category.color,
                  shadowColor: category.color,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.18,
                  shadowRadius: 6,
                  elevation: 3,
                },
                { borderColor: category.color },
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <MaterialIcons
                name={category.iconName}
                size={18}
                color={
                  selectedCategory === category.id ? "#fff" : category.color
                }
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.categoryName,
                  {
                    color:
                      selectedCategory === category.id ? "#fff" : "#334155",
                    fontWeight:
                      selectedCategory === category.id ? "700" : "500",
                  },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Filter Row */}
        <View style={styles.filterRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContent}
            bounces={false}
            overScrollMode="never"
            nestedScrollEnabled={false}
          >
            <TouchableOpacity
              style={[
                styles.filterButton,
                {
                  backgroundColor: "#6366f1",
                  borderColor: "#6366f1",
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[styles.filterIcon, { color: "#fff" }]}>🎯</Text>
              <Text style={[styles.filterText, { color: "#fff" }]}>
                Sort: {sortOptions.find((s) => s.id === sortBy)?.name}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                {
                  backgroundColor: "#059669",
                  borderColor: "#059669",
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[styles.filterIcon, { color: "#fff" }]}>📍</Text>
              <Text style={[styles.filterText, { color: "#fff" }]}>
                Location
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                {
                  backgroundColor: "#f59e0b",
                  borderColor: "#f59e0b",
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[styles.filterIcon, { color: "#fff" }]}>💰</Text>
              <Text style={[styles.filterText, { color: "#fff" }]}>Price</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      <View style={[styles.filtersHeader, { backgroundColor: COLORS.white }]}>
        {/* Expandable Filters Section */}
        {showFilters && (
          <View style={styles.filtersSection}>
            {/* Categories Filter */}
            <View style={styles.filterGroup}>
              <Text style={[styles.filterLabel, { color: COLORS.dark }]}>
                📂 Categories
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
                bounces={false}
                overScrollMode="never"
                nestedScrollEnabled={false}
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor:
                          selectedCategory === category.name
                            ? COLORS.primary600
                            : COLORS.gray100,
                        borderWidth: selectedCategory === category.name ? 0 : 1,
                        borderColor: COLORS.gray300,
                      },
                    ]}
                    onPress={() => setSelectedCategory(category.name)}
                  >
                    <Text style={styles.categoryChipIcon}>{category.icon}</Text>
                    <Text
                      style={[
                        styles.categoryChipText,
                        {
                          color:
                            selectedCategory === category.name
                              ? COLORS.white
                              : COLORS.dark,
                        },
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Sort & Filter Row */}
            <View style={styles.sortFilterRow}>
              {/* Sort By */}
              <View style={styles.sortContainer}>
                <Text style={[styles.filterLabel, { color: COLORS.dark }]}>
                  📊 Sort by
                </Text>
                <TouchableOpacity
                  style={[
                    styles.sortButton,
                    {
                      backgroundColor: COLORS.gray100,
                      borderWidth: 1,
                      borderColor: COLORS.gray300,
                    },
                  ]}
                  onPress={() => {
                    const sortOptions = [
                      "Newest",
                      "Price: Low to High",
                      "Price: High to Low",
                      "Most Popular",
                    ];
                    const currentIndex = sortOptions.indexOf(sortBy);
                    const nextIndex = (currentIndex + 1) % sortOptions.length;
                    setSortBy(sortOptions[nextIndex]);
                  }}
                >
                  <Text style={[styles.sortText, { color: COLORS.dark }]}>
                    {sortBy}
                  </Text>
                  <Text style={[styles.sortArrow, { color: COLORS.gray600 }]}>
                    ▼
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Quick Actions */}
              <View style={styles.quickActions}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: COLORS.primary50,
                      borderWidth: 1,
                      borderColor: COLORS.primary200,
                    },
                  ]}
                  onPress={onRefresh}
                >
                  <Text
                    style={[styles.actionIcon, { color: COLORS.primary600 }]}
                  >
                    🔄
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: COLORS.success50,
                      borderWidth: 1,
                      borderColor: COLORS.success200,
                    },
                  ]}
                  onPress={() => console.log("Add product")}
                >
                  <Text
                    style={[styles.actionIcon, { color: COLORS.success600 }]}
                  >
                    ➕
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Products Grid/List */}
      <View style={styles.content}>
        {/* Results Summary */}
        <View style={styles.resultsSummary}>
          <Text style={styles.resultsText}>
            {filteredProducts.length} products found
          </Text>
          {selectedCategory !== "all" && (
            <TouchableOpacity
              style={styles.clearFilter}
              onPress={() => setSelectedCategory("all")}
            >
              <Text style={styles.clearFilterText}>Clear filter ✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredProducts}
          renderItem={({ item, index }) => (
            <ProductCard product={item} index={index} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={1}
          key={viewMode} // Force re-render when view mode changes
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptyText}>
                Try adjusting your search or filters
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Modern Container
  modernContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
    width: screenWidth,
    maxWidth: screenWidth,
  },

  // Header Styles
  header: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    alignSelf: "center",
    width: "100%",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#059669",
    letterSpacing: 0.5,
    textShadowColor: "#d1fae5",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  appSubtitle: {
    fontSize: 14,
    color: "#10b981",
    marginTop: 2,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0f2fe",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  notificationIcon: {
    fontSize: 20,
    color: "#0369a1",
  },

  // Search Bar
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
    color: "#64748b",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
  },
  micButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },
  micIcon: {
    fontSize: 14,
  },

  // Categories
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingRight: 16,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  categoryItemActive: {
    backgroundColor: "#f8fafc",
    borderWidth: 2,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
  },
  categoryNameActive: {
    color: "#1e293b",
    fontWeight: "600",
  },

  // Filter Row
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterContent: {
    paddingRight: 16,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  filterText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  viewToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  viewToggleIcon: {
    fontSize: 16,
    color: "#475569",
  },

  // Content Area
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultsSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  clearFilter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fee2e2",
    borderRadius: 16,
  },
  clearFilterText: {
    fontSize: 12,
    color: "#dc2626",
    fontWeight: "500",
  },

  // Products List
  productsList: {
    paddingBottom: 100,
  },

  // Modern Product Card
  modernCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  listCard: {
    width: "100%",
    marginHorizontal: 0,
    flexDirection: "row",
  },

  // Image Section
  imageWrapper: {
    position: "relative",
  },
  modernImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  listImage: {
    width: 120,
    height: 120,
  },
  badgeContainer: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  featuredBadge: {
    backgroundColor: "#fbbf24",
  },
  organicBadge: {
    backgroundColor: "#10b981",
  },
  discountBadge: {
    backgroundColor: "#ef4444",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#ffffff",
  },
  quickActions: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  quickAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionIcon: {
    fontSize: 16,
  },

  // Card Content
  cardContent: {
    padding: 16,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
    lineHeight: 22,
  },
  ratingRow: {
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginRight: 4,
  },
  reviewText: {
    fontSize: 12,
    color: "#64748b",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#059669",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: "#94a3b8",
    textDecorationLine: "line-through",
    marginRight: 4,
  },
  unitText: {
    fontSize: 12,
    color: "#64748b",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    color: "#64748b",
  },
  stockText: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "500",
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
  },
  sellerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sellerName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
    marginRight: 4,
  },
  verifiedIcon: {
    fontSize: 12,
    color: "#059669",
  },
  responseTime: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
  },
  contactButton: {
    backgroundColor: "#059669",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },

  // Enhanced Product Card Styles
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: "#e0f2fe",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#0369a1",
  },
  descriptionPreview: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
    marginBottom: 12,
  },
  priceQuantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  priceContainer: {
    flex: 1,
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#059669",
    marginBottom: 2,
  },
  priceType: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "500",
  },
  quantityContainer: {
    alignItems: "flex-end",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  quantityLabel: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 2,
  },
  sellerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  sellerInitial: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  sellerLocation: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  dateText: {
    fontSize: 11,
    color: "#64748b",
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  viewDetailsButton: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  contactButton: {
    flex: 1,
    backgroundColor: "#059669",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  contactButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff",
  },

  // New Badge Styles
  marketplaceBadge: {
    backgroundColor: "#3b82f6",
  },
  serialBadge: {
    backgroundColor: "#64748b",
  },
});

// const styles = StyleSheet.create({
//   container: {
//     paddingTop: 50,
//     paddingBottom: 25,
//     position: "relative",
//     overflow: "hidden",
//   },
//   bannerContent: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 15,
//   },
//   bannerTextContainer: {
//     flex: 1,
//     paddingRight: 15,
//   },
//   bannerTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 6,
//   },
//   bannerSubtitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 8,
//   },
//   bannerDescription: {
//     fontSize: 13,
//     lineHeight: 18,
//     opacity: 0.9,
//   },
//   filterButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   filterButtonIcon: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   bannerPattern: {
//     position: "absolute",
//     right: -10,
//     top: 10,
//     flexDirection: "row",
//     opacity: 0.1,
//   },
//   patternIcon: {
//     fontSize: 30,
//     marginHorizontal: 5,
//   },
//   // Filters Header
//   filtersHeader: {
//     paddingHorizontal: 16,
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   mainTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 2,
//   },
//   subtitle: {
//     fontSize: 14,
//     textAlign: "center",
//     lineHeight: 20,
//     marginBottom: 20,
//     paddingHorizontal: 10,
//   },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderRadius: 25,
//     marginBottom: 15,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   searchIcon: {
//     fontSize: 16,
//     marginRight: 12,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//   },
//   // Creative Filter Styles
//   titleContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   compactTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   filterToggle: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   filterIcon: {
//     fontSize: 16,
//   },
//   filtersSection: {
//     marginTop: 15,
//     paddingTop: 15,
//     borderTopWidth: 1,
//     borderTopColor: "#f0f0f0",
//   },
//   filterGroup: {
//     marginBottom: 15,
//   },
//   filterLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//     marginBottom: 8,
//   },
//   categoriesScroll: {
//     flexGrow: 0,
//   },
//   categoryChip: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginRight: 8,
//   },
//   categoryChipIcon: {
//     fontSize: 14,
//     marginRight: 6,
//   },
//   categoryChipText: {
//     fontSize: 12,
//     fontWeight: "500",
//   },
//   sortFilterRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-end",
//   },
//   sortContainer: {
//     flex: 1,
//     marginRight: 15,
//   },
//   sortButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   sortText: {
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   sortArrow: {
//     fontSize: 10,
//     marginLeft: 8,
//   },
//   quickActions: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   actionButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   actionIcon: {
//     fontSize: 16,
//   },
//   activeFilters: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 15,
//     paddingTop: 15,
//     borderTopWidth: 1,
//     borderTopColor: "#f0f0f0",
//   },
//   resultsInfo: {
//     flex: 1,
//   },
//   resultsCount: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 2,
//   },
//   resultsSubtext: {
//     fontSize: 12,
//   },
//   activeFilterChip: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   activeFilterText: {
//     fontSize: 12,
//     fontWeight: "500",
//     marginRight: 6,
//   },
//   removeFilter: {
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   productsSection: {
//     paddingHorizontal: 20,
//   },
//   content: {
//     flex: 1,
//   },
//   section: {
//     paddingHorizontal: 20,
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   categoryCard: {
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//     elevation: 1,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//   },
//   categoryHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   categoryIcon: {
//     fontSize: 24,
//     marginRight: 16,
//   },
//   categoryInfo: {
//     flex: 1,
//   },
//   categoryName: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 4,
//   },
//   categoryDescription: {
//     fontSize: 14,
//     lineHeight: 18,
//   },
//   productsHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   refreshText: {
//     fontSize: 14,
//     fontWeight: "600",
//     textDecorationLine: "underline",
//   },
//   sortText: {
//     fontSize: 14,
//   },
//   noProductsContainer: {
//     alignItems: "center",
//     paddingVertical: 40,
//     paddingHorizontal: 20,
//   },
//   productsCount: {
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 20,
//   },
//   productsGrid: {
//     marginBottom: 30,
//   },
//   productCard: {
//     borderRadius: 24,
//     marginBottom: 28,
//     elevation: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.18,
//     shadowRadius: 12,
//     overflow: "hidden",
//     borderWidth: 0.5,
//     borderColor: "rgba(0,0,0,0.05)",
//   },
//   imageContainer: {
//     position: "relative",
//   },
//   productImage: {
//     width: "100%",
//     height: 220,
//     resizeMode: "cover",
//   },
//   imageGradient: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 80,
//     backgroundColor: "rgba(0,0,0,0.4)",
//   },
//   priceBadge: {
//     position: "absolute",
//     top: 15,
//     left: 15,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   priceContent: {
//     alignItems: "flex-start",
//   },
//   priceText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     lineHeight: 18,
//   },
//   pricePerUnit: {
//     fontSize: 11,
//     fontWeight: "500",
//     marginTop: 2,
//   },
//   availabilityBadge: {
//     position: "absolute",
//     top: 60,
//     right: 15,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 15,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   availabilityIcon: {
//     fontSize: 12,
//     marginRight: 4,
//   },
//   availabilityText: {
//     fontSize: 12,
//     fontWeight: "600",
//   },
//   ratingBadge: {
//     position: "absolute",
//     top: 15,
//     right: 15,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 15,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   ratingIcon: {
//     fontSize: 12,
//     marginRight: 4,
//   },
//   ratingText: {
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   qualityBadge: {
//     position: "absolute",
//     bottom: 15,
//     right: 15,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 15,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   qualityIcon: {
//     fontSize: 12,
//     marginRight: 4,
//   },
//   qualityText: {
//     fontSize: 11,
//     fontWeight: "600",
//   },
//   productInfo: {
//     padding: 20,
//   },
//   titleRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   productTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     flex: 1,
//     marginRight: 10,
//   },
//   categoryIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   categoryIconText: {
//     fontSize: 16,
//   },
//   quickInfoContainer: {
//     flexDirection: "row",
//     marginBottom: 16,
//     gap: 12,
//   },
//   quickInfoCard: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 12,
//     borderRadius: 12,
//   },
//   quickInfoIcon: {
//     fontSize: 18,
//     marginRight: 10,
//   },
//   quickInfoText: {
//     flex: 1,
//   },
//   quickInfoLabel: {
//     fontSize: 11,
//     marginBottom: 2,
//     textTransform: "uppercase",
//     fontWeight: "600",
//   },
//   quickInfoValue: {
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   detailRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   detailLabel: {
//     fontSize: 14,
//     color: "#666",
//     marginRight: 8,
//     minWidth: 70,
//   },
//   categoryValue: {
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   detailValue: {
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   sellerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 16,
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     borderRadius: 12,
//     marginHorizontal: -4,
//   },
//   sellerAvatar: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   sellerInitial: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   sellerInfo: {
//     flex: 1,
//   },
//   sellerNameRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   sellerName: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginRight: 8,
//   },
//   sellerMetrics: {
//     flex: 1,
//   },
//   sellerDate: {
//     fontSize: 12,
//     marginBottom: 4,
//   },
//   sellerStats: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   sellerRating: {
//     fontSize: 11,
//     fontWeight: "600",
//   },
//   sellerSales: {
//     fontSize: 11,
//     fontWeight: "600",
//   },
//   verifiedBadge: {
//     width: 18,
//     height: 18,
//     borderRadius: 9,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   verifiedIcon: {
//     fontSize: 10,
//     fontWeight: "bold",
//   },
//   chatButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   chatIcon: {
//     fontSize: 16,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     gap: 12,
//     marginTop: 8,
//   },
//   contactButton: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 14,
//     borderRadius: 12,
//   },
//   contactButtonIcon: {
//     fontSize: 14,
//     marginRight: 6,
//   },
//   contactButtonText: {
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   detailsButton: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 14,
//     borderRadius: 12,
//     borderWidth: 2,
//   },
//   detailsButtonIcon: {
//     fontSize: 14,
//     marginRight: 6,
//   },
//   detailsButtonText: {
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   addProductButton: {
//     paddingHorizontal: 32,
//     paddingVertical: 14,
//     borderRadius: 25,
//     alignSelf: "center",
//   },
//   addProductText: {
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

export default MarketplaceTab;
