import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../constants/Theme";
import { useLanguage } from "../../context/LanguageContext";
import { TYPOGRAPHY } from "../../constants/Typography";

/**
 * CategorySlider - Horizontal scrollable category cards
 * Shows 5 allowed agricultural categories with images
 */
const CategorySlider = ({ categories, onCategoryPress }) => {
  const { modernColors } = useTheme();
  const { t } = useLanguage();

  return (
    <LinearGradient
      colors={[modernColors.backgroundSection, modernColors.background]}
      style={styles.container}
    >
      {/* Section Header */}
      <View style={styles.header}>
        <Text
          style={[
            TYPOGRAPHY.h2,
            styles.headerText,
            { color: modernColors.textSecondary },
          ]}
        >
          {t("home.categories")}
        </Text>
      </View>

      {/* Category Slider */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.slider}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              index === 0 && styles.firstCard,
              index === categories.length - 1 && styles.lastCard,
            ]}
            onPress={() => onCategoryPress(category)}
            activeOpacity={0.8}
          >
            <ImageBackground
              source={category.image}
              style={styles.imageBackground}
              imageStyle={styles.image}
            >
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.75)"]}
                style={styles.gradient}
              >
                <Text style={styles.categoryName} numberOfLines={2}>
                  {category.name}
                </Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerText: {
    fontWeight: "600",
  },
  slider: {
    paddingVertical: 10,
  },
  categoryCard: {
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
  firstCard: {
    marginLeft: 20,
  },
  lastCard: {
    marginRight: 20,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  image: {
    borderRadius: 14,
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 10,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "left",
    lineHeight: 15,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

export default CategorySlider;
