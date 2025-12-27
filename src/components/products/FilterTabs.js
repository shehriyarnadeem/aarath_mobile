import React, { Fragment } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../constants/Theme";
import { TYPOGRAPHY } from "../../constants/Typography";

/**
 * FilterTabs - Horizontal scrollable filter tabs
 * Allows filtering products by status
 */
const FilterTabs = ({ filters, activeFilter, onFilterChange }) => {
  const { COLORS } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: COLORS.white }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter, index) => (
          <Fragment key={filter.key}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeFilter === filter.key && [
                  styles.activeFilterButton,
                  { backgroundColor: COLORS.primary },
                ],
              ]}
              onPress={() => onFilterChange(filter.key)}
            >
              <Text
                style={[
                  TYPOGRAPHY.body2,
                  styles.filterText,
                  { color: COLORS.gray600 },
                  activeFilter === filter.key && [
                    styles.activeFilterText,
                    { color: COLORS.white },
                  ],
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
            {index < filters.length - 1 && (
              <View
                style={[
                  styles.filterDivider,
                  { backgroundColor: COLORS.border },
                ]}
              />
            )}
          </Fragment>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  scrollContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterButton: {
    paddingHorizontal: 24,
    paddingVertical: 5,
    marginRight: 0,
    borderRadius: 5,
    backgroundColor: "transparent",
  },
  activeFilterButton: {
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  activeFilterText: {
    fontWeight: "300",
  },
  filterDivider: {
    width: 1,
    height: 20,
    marginHorizontal: 8,
  },
});

export default FilterTabs;
