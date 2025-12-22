import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../constants/Theme";

const SearchHeader = ({
  title = "Welcome to,",
  subtitle = "Pakistan's First Agricultural Marketplace",
  searchQuery,
  onSearchChange,
  categories = [],
  selectedCategory,
  onCategorySelect,
  onNotificationPress,
  onFilterPress,
  activeFiltersCount = 0,
  scrollY,
  headerHeight,
  isCollapsed,
  sortBy = "featured",
  onSortChange,
}) => {
  const { COLORS, GRADIENTS, SHADOWS } = useTheme();

  // Animation values
  const headerHeightAnim = headerHeight || new Animated.Value(200);
  const searchOpacity = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [1, 0],
        extrapolate: "clamp",
      })
    : 1;

  const categoriesOpacity = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 30],
        outputRange: [1, 0],
        extrapolate: "clamp",
      })
    : 1;

  const logoScale = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 120],
        outputRange: [1, 0.8],
        extrapolate: "clamp",
      })
    : 1;

  const titleOpacity = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [1, 0],
        extrapolate: "clamp",
      })
    : 1;

  return (
    <LinearGradient colors={GRADIENTS.primary.header} style={styles.header}>
      {/* Main Header Content - Always Visible */}
      <View style={styles.headerContent}>
        {/* Logo and Title */}
        <View style={styles.logoContainer}>
          <Animated.Image
            source={require("../../../assets/logo.png")}
            style={[styles.logo, { transform: [{ scale: logoScale }] }]}
            resizeMode="contain"
          />
          <Animated.View
            style={[styles.titleContainer, { opacity: titleOpacity }]}
          >
            <Text style={[styles.headerTitle, { color: COLORS.textPrimary }]}>
              {title}
            </Text>
            <Text
              style={[styles.headerSubtitle, { color: COLORS.textSecondary }]}
            >
              {subtitle}
            </Text>
          </Animated.View>
        </View>

        {/* Notifications */}
        <TouchableOpacity
          style={[
            styles.notificationButton,
            { backgroundColor: COLORS.white },
            SHADOWS.md,
          ]}
          onPress={onNotificationPress}
        >
          <Ionicons
            name="notifications-outline"
            size={20}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Collapsible Content */}
      <Animated.View
        style={[styles.collapsibleContent, { opacity: searchOpacity }]}
      >
        {/* Search Bar with Filter Button */}
        <View style={styles.searchRow}>
          <View
            style={[
              styles.searchContainer,
              { backgroundColor: COLORS.white },
              SHADOWS.sm,
            ]}
          >
            <Ionicons
              name="search"
              size={18}
              color={COLORS.textMuted}
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, { color: COLORS.textPrimary }]}
              placeholder="Search products, categories..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={onSearchChange}
            />
          </View>

          {/* Filter Button */}
          <TouchableOpacity
            title="Filter Products"
            style={[
              styles.filterButton,
              { backgroundColor: COLORS.white },
              SHADOWS.sm,
              activeFiltersCount > 0 && { backgroundColor: COLORS.gray400 },
            ]}
            onPress={() => {
              // Cycle through sort options
              const sortOptions = ["featured", "price_low", "price_high"];
              const currentIndex = sortOptions.indexOf(sortBy);
              const nextIndex = (currentIndex + 1) % sortOptions.length;
              onSortChange(sortOptions[nextIndex]);
            }}
          >
            <Ionicons
              name={
                sortBy === "price_low"
                  ? "trending-up"
                  : sortBy === "price_high"
                  ? "trending-down"
                  : "filter"
              }
              size={15}
              color={
                activeFiltersCount > 0 ? COLORS.white : COLORS.textSecondary
              }
            />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <Animated.View style={{ opacity: categoriesOpacity }}>
          {categories.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
              contentContainerStyle={styles.categoriesContent}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    { backgroundColor: COLORS.white },
                    SHADOWS.sm,
                    selectedCategory === category.id && [
                      { backgroundColor: COLORS.primary },
                      { shadowOpacity: 0.15 },
                    ],
                  ]}
                  onPress={() => onCategorySelect?.(category.id)}
                >
                  <Ionicons
                    name={category.icon}
                    size={16}
                    color={
                      selectedCategory === category.id
                        ? COLORS.white
                        : COLORS.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.categoryName,
                      { color: COLORS.textSecondary },
                      selectedCategory === category.id && {
                        color: COLORS.white,
                        fontWeight: "600",
                      },
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    paddingTop: 50, // Account for status bar
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    justifyContent: "flex-start",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    minHeight: 48,
  },
  collapsibleContent: {
    flex: 1,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  // Search
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },

  // Filter Button
  filterButton: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 15,
    height: 15,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },

  // Categories
  categoriesScroll: {
    flexGrow: 0,
  },
  categoriesContent: {
    paddingRight: 20,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
});

export default SearchHeader;
