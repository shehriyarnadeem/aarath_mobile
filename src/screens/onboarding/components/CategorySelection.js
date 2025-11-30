import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useTheme } from "../../../constants/Theme";

const CategorySelection = ({ selectedCategories, onCategoriesChange }) => {
  const { COLORS, SIZES } = useTheme();

  const categories = [
    {
      id: "paddy",
      name: "Paddy",
      description: "Rice in husk, unmilled rice",
      icon: "🌾",
      color: COLORS.primary,
    },
    {
      id: "rice",
      name: "Rice",
      description: "Processed rice, basmati & non-basmati",
      icon: "🍚",
      color: COLORS.warning,
    },
    {
      id: "wheat",
      name: "Wheat",
      description: "Wheat grains and wheat flour",
      icon: "🌾",
      color: "#d97706",
    },
  ];

  const handleCategoryToggle = (categoryId) => {
    let updatedCategories;
    if (selectedCategories.includes(categoryId)) {
      updatedCategories = selectedCategories.filter((id) => id !== categoryId);
    } else {
      updatedCategories = [...selectedCategories, categoryId];
    }
    onCategoriesChange(updatedCategories);
  };

  const renderCategoryCard = (category) => {
    const isSelected = selectedCategories.includes(category.id);

    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryCard,
          {
            borderColor: isSelected ? category.color : COLORS.gray200,
            backgroundColor: isSelected ? `${category.color}10` : COLORS.white,
          },
        ]}
        onPress={() => handleCategoryToggle(category.id)}
      >
        <View style={styles.categoryHeader}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${category.color}20` },
            ]}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
          </View>

          <View style={styles.categoryInfo}>
            <Text style={[styles.categoryTitle, { color: COLORS.dark }]}>
              {category.name}
            </Text>
            <Text
              style={[styles.categoryDescription, { color: COLORS.gray600 }]}
            >
              {category.description}
            </Text>
          </View>

          <View
            style={[
              styles.checkbox,
              {
                borderColor: isSelected ? category.color : COLORS.gray300,
                backgroundColor: isSelected ? category.color : COLORS.white,
              },
            ]}
          >
            {isSelected && (
              <Text style={[styles.checkmark, { color: COLORS.white }]}>✓</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.subtitle, { color: COLORS.gray600 }]}>
        Select the agricultural categories you work with (choose at least one)
      </Text>

      {selectedCategories.length > 0 && (
        <View
          style={[styles.selectedInfo, { backgroundColor: COLORS.primary50 }]}
        >
          <Text style={[styles.selectedText, { color: COLORS.primary700 }]}>
            {selectedCategories.length} categor
            {selectedCategories.length === 1 ? "y" : "ies"} selected
          </Text>
        </View>
      )}

      <ScrollView
        style={styles.categoriesContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categoriesGrid}>
          {categories.map(renderCategoryCard)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  selectedInfo: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: "500",
  },
  categoriesContainer: {
    flex: 1,
  },
  categoriesGrid: {
    paddingBottom: 20,
  },
  categoryCard: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryInfo: {
    flex: 1,
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default CategorySelection;
