import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  FlatList,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";
import { TYPOGRAPHY } from "../../constants/Typography";
import { ProductCard } from "../../components/marketplace";
import { apiClient } from "../../utils/apiClient";
import FilterBar from "../../components/marketplace/FilterBar";
import MarketplaceHeader from "../../components/marketplace/MarketplaceHeader";
import {
  SortModal,
  PriceRangeModal,
  LocationModal,
  CategoryModal,
} from "../../components/marketplace/FilterModals";

const { width: screenWidth } = Dimensions.get("window");

const MarketplaceTab = ({ navigation, route }) => {
  const { COLORS, SHADOWS } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  // Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Filter states
  const [filters, setFilters] = useState({
    sort: null, // Changed default to match API
    priceRange: { min: 0, max: 10000 },
    location: "all",
    category: "all",
    harvestPeriod: "all",
  });

  // Modal states
  const [modals, setModals] = useState({
    sort: false,
    price: false,
    location: false,
    category: false,
  });

  // Apply preset filters from Home Screen navigation
  useEffect(() => {
    if (route?.params?.presetFilter) {
      const { presetFilter } = route.params;

      setFilters((prev) => {
        const newFilters = { ...prev };

        if (presetFilter.type === "category") {
          newFilters.category = presetFilter.value;
        } else if (presetFilter.type === "harvest") {
          // Map harvest periods to categories or create harvest filter if needed
          newFilters.harvestPeriod = presetFilter.value;
        }

        return newFilters;
      });
    }
  }, [route?.params]);

  // Fetch products from API
  const fetchProducts = async (page = 1, resetProducts = false) => {
    try {
      if (resetProducts) {
        setLoading(true);
        setError(null);
      }

      // Map frontend filters to API parameters
      const params = {
        page: page,
        limit: pagination.limit,
      };

      // Map sort filter
      if (filters.sort && filters.sort !== null) {
        if (filters.sort === "latest") {
          params.sort = "latest";
        } else if (filters.sort === "price_low") {
          params.sort = "price_low";
        } else if (filters.sort === "price_high") {
          params.sort = "price_high";
        }
      }

      // Map price range filter
      if (filters.priceRange.min > 0) {
        params.minPrice = filters.priceRange.min;
      }
      if (filters.priceRange.max < 10000) {
        params.maxPrice = filters.priceRange.max;
      }

      // Map location filter
      if (filters.location && filters.location !== "all") {
        params.city = filters.location;
      }

      // TODO: Map category filter when backend supports it
      // if (filters.category && filters.category !== "all") {
      //   params.category = filters.category;
      // }

      const response = await apiClient.products.getAll(params);

      if (response.success) {
        const newProducts = response.products || [];

        if (resetProducts || page === 1) {
          setProducts(newProducts);
        } else {
          // Append for pagination
          setProducts((prev) => [...prev, ...newProducts]);
        }

        setPagination(
          response.pagination || {
            page: page,
            limit: pagination.limit,
            total: newProducts.length,
            totalPages: 1,
          }
        );
      } else {
        throw new Error(response.data.message || "Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchProducts(1, true);
  }, [filters]);

  // Fetch products when component mounts or filters change
  useEffect(() => {
    fetchProducts(1, true);
  }, [filters]);

  // Products to display (API handles filtering and sorting)
  const filteredProducts = useMemo(() => {
    // API already handles most filtering and sorting
    // We only need client-side filtering for category (until backend supports it)
    let filtered = [...products];

    // Category filter (client-side until backend supports it)
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    return filtered;
  }, [products, filters.category]);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.sort !== "featured") count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < 10000) count++;
    if (filters.location !== "all") count++;
    if (filters.category !== "all") count++;
    return count;
  }, [filters]);

  // Modal handlers
  const openModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
  };

  // Filter handlers
  const handleSortSelect = (sortType) => {
    if (sortType === "all") {
      sortType = null;
    }
    setFilters((prev) => ({ ...prev, sort: sortType }));
  };

  const handlePriceRangeChange = (priceRange) => {
    setFilters((prev) => ({ ...prev, priceRange }));
  };

  const handleLocationSelect = (location) => {
    setFilters((prev) => ({ ...prev, location }));
  };

  const handleCategorySelect = (category) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  // Product handlers
  const handleProductPress = (product) => {
    navigation?.navigate("ProductDetail", { product });
  };

  const handleContactPress = (product) => {
    // Handle contact action - could open WhatsApp, show contact modal, etc.
    console.log("Contact seller for product:", product.serialNumber);
  };

  const handleFavoriteToggle = (product, isFavorited) => {
    // Handle favorite toggle - could update backend, local storage, etc.
    console.log(
      `Product ${product.serialNumber} ${
        isFavorited ? "favorited" : "unfavorited"
      }`
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <MarketplaceHeader
        productsCount={pagination.total || filteredProducts.length}
        title="Marketplace"
        navigation={navigation}
      />

      {/* Filter Bar */}
      <FilterBar
        onSortPress={() => openModal("sort")}
        onPricePress={() => openModal("price")}
        onLocationPress={() => openModal("location")}
        onCategoryPress={() => openModal("category")}
        filters={filters}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={handleProductPress}
            onContact={handleContactPress}
            onFavoriteToggle={handleFavoriteToggle}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={() => {
          if (loading) {
            return (
              <View style={styles.emptyState}>
                <Text
                  style={[
                    TYPOGRAPHY.h4,
                    { color: COLORS.textPrimary, marginTop: 16 },
                  ]}
                >
                  Loading products...
                </Text>
              </View>
            );
          }

          if (error) {
            return (
              <View style={styles.emptyState}>
                <Ionicons name="alert-circle" size={64} color={COLORS.error} />
                <Text
                  style={[
                    TYPOGRAPHY.h4,
                    { color: COLORS.textPrimary, marginTop: 16 },
                  ]}
                >
                  Error loading products
                </Text>
                <Text
                  style={[
                    TYPOGRAPHY.body,
                    {
                      color: COLORS.textSecondary,
                      textAlign: "center",
                      marginTop: 8,
                    },
                  ]}
                >
                  {error}
                </Text>
              </View>
            );
          }

          return (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={64} color={COLORS.gray400} />
              <Text
                style={[
                  TYPOGRAPHY.h4,
                  { color: COLORS.textPrimary, marginTop: 16 },
                ]}
              >
                No products found
              </Text>
              <Text
                style={[
                  TYPOGRAPHY.body,
                  {
                    color: COLORS.textSecondary,
                    textAlign: "center",
                    marginTop: 8,
                  },
                ]}
              >
                Try adjusting your search filters or check back later for new
                listings
              </Text>
            </View>
          );
        }}
      />

      {/* Filter Modals */}
      <SortModal
        visible={modals.sort}
        onClose={() => closeModal("sort")}
        selectedSort={filters.sort}
        onSortSelect={handleSortSelect}
      />

      <PriceRangeModal
        visible={modals.price}
        onClose={() => closeModal("price")}
        priceRange={filters.priceRange}
        onPriceRangeChange={handlePriceRangeChange}
      />

      <LocationModal
        visible={modals.location}
        onClose={() => closeModal("location")}
        selectedLocation={filters.location}
        onLocationSelect={handleLocationSelect}
      />

      <CategoryModal
        visible={modals.category}
        onClose={() => closeModal("category")}
        selectedCategory={filters.category}
        onCategorySelect={handleCategorySelect}
      />
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

  // Products List
  productsList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
});

export default MarketplaceTab;
