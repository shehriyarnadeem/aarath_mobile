import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";
import { TYPOGRAPHY } from "../../constants/Typography";

const FilterBar = ({
  onSortPress,
  onPricePress,
  onLocationPress,
  onCategoryPress,
  filters = {},
  activeFiltersCount = 0,
}) => {
  const { COLORS, SHADOWS } = useTheme();

  const FilterButton = ({
    title,
    icon,
    onPress,
    hasValue,
    value,
    isActive = false,
  }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: isActive || hasValue ? COLORS.primary : COLORS.white,
          borderColor: isActive || hasValue ? COLORS.primary : COLORS.gray300,
        },
        SHADOWS.sm,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons
        name={icon}
        size={16}
        color={isActive || hasValue ? COLORS.white : COLORS.gray600}
      />
      <Text
        style={[
          TYPOGRAPHY.bodySmall,
          styles.filterButtonText,
          {
            color: isActive || hasValue ? COLORS.white : COLORS.gray600,
            fontWeight: isActive || hasValue ? "600" : "500",
          },
        ]}
      >
        {value || title}
      </Text>
      <Ionicons
        name="chevron-down"
        size={12}
        color={isActive || hasValue ? COLORS.white : COLORS.gray600}
      />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: COLORS.white }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <FilterButton
          title="Sort"
          icon="swap-vertical-outline"
          onPress={onSortPress}
          hasValue={filters.sort && filters.sort !== "featured"}
          value={
            filters.sort === "price_low"
              ? "Price: Low → High"
              : filters.sort === "price_high"
              ? "Price: High → Low"
              : filters.sort === "latest"
              ? "Latest"
              : filters.sort === "recommended"
              ? "Recommended"
              : "Sort"
          }
        />

        <FilterButton
          title="Price"
          icon="pricetag-outline"
          onPress={onPricePress}
          hasValue={
            filters.priceRange &&
            (filters.priceRange.min > 0 || filters.priceRange.max < 10000)
          }
          value={
            filters.priceRange &&
            (filters.priceRange.min > 0 || filters.priceRange.max < 10000)
              ? `₨${filters.priceRange.min}-${filters.priceRange.max}`
              : "Price"
          }
        />

        <FilterButton
          title="Location"
          icon="location-outline"
          onPress={onLocationPress}
          hasValue={filters.location && filters.location !== "all"}
          value={filters.location !== "all" ? filters.location : "Location"}
        />

        <FilterButton
          title="Category"
          icon="grid-outline"
          onPress={onCategoryPress}
          hasValue={filters.category && filters.category !== "all"}
          value={filters.category !== "all" ? filters.category : "Category"}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    position: "relative",
  },
  scrollContent: {
    paddingRight: 16,
    alignItems: "center",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 36,
  },
  filterButtonText: {
    marginHorizontal: 6,
    fontSize: 13,
  },
  activeFiltersContainer: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  activeFiltersBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FilterBar;
