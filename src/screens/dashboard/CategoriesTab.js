import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../constants/Theme";
import { useLanguage } from "../../context/LanguageContext";
import { categoryImages, categoryColors } from "../../constants/categoryImages";

const { width: screenWidth } = Dimensions.get("window");
const numColumns = 3;
const cardSpacing = 12;
const cardWidth = (screenWidth - (numColumns + 1) * cardSpacing) / numColumns;

const CategoriesTab = ({ navigation }) => {
  const { COLORS } = useTheme();
  const { t } = useLanguage();

  // Agricultural categories with local images
  const categories = [
    {
      id: "Wheat",
      name: t("categories.wheat"),
      image: categoryImages.wheat,
      color: categoryColors.wheat,
    },
    {
      id: "Rice",
      name: t("categories.rice"),
      image: categoryImages.rice,
      color: categoryColors.rice,
    },
    {
      id: "Cotton",
      name: t("categories.cotton"),
      image: categoryImages.cotton,
      color: categoryColors.cotton,
    },
    {
      id: "Corn",
      name: t("categories.corn"),
      image: categoryImages.corn,
      color: categoryColors.corn,
    },
    {
      id: "Barley",
      name: t("categories.barley"),
      image: categoryImages.barley,
      color: categoryColors.barley,
    },
  ];

  const handleCategoryPress = (category) => {
    navigation.navigate("Marketplace", {
      presetFilter: {
        id: category.id,
        type: "category",
        value: category.id,
      },
    });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={item.image}
        style={styles.imageBackground}
        imageStyle={styles.backgroundImage}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.gradient}
        >
          <Text style={styles.categoryName} numberOfLines={2}>
            {item.name}
          </Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.background }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.white }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: COLORS.dark }]}>
            {t("categoriesTab.title")}
          </Text>
          <Text style={[styles.headerSubtitle, { color: COLORS.gray }]}>
            {t("categoriesTab.subtitle")}
          </Text>
        </View>
      </View>

      {/* Categories Grid */}
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    marginBottom: 0,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  listContent: {
    padding: cardSpacing,
    paddingBottom: 140,
    display: "flex",
    flexDirection: "column",
  },
  row: {
    marginBottom: cardSpacing,
  },
  categoryCard: {
    width: cardWidth,
    height: cardWidth * 1.2,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 4,
    marginRight: cardSpacing,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  backgroundImage: {
    borderRadius: 16,
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 12,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "left",
    lineHeight: 16,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default CategoriesTab;
