import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../constants/Theme";
import { useLanguage } from "../../context/LanguageContext";
import { TYPOGRAPHY } from "../../constants/Typography";

/**
 * FeaturedProducts - Horizontal list of featured marketplace products
 * Shows latest active products
 */
const FeaturedProducts = ({ products, loading, onProductPress, onSeeAll }) => {
  const { modernColors } = useTheme();
  const { t } = useLanguage();

  /**
   * Render individual product card
   */
  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: modernColors.white }]}
      onPress={() => onProductPress(item)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.images?.[0] || item.image }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text
          style={[
            TYPOGRAPHY.body,
            styles.productTitle,
            { color: modernColors.textPrimary },
          ]}
          numberOfLines={2}
        >
          {item.title || item.name}
        </Text>
        <Text
          style={[
            TYPOGRAPHY.h4,
            styles.productPrice,
            { color: modernColors.primary },
          ]}
        >
          Rs. {item.price?.toLocaleString() || item.price}
          <Text
            style={[
              TYPOGRAPHY.caption,
              styles.productUnit,
              { color: modernColors.textSecondary },
            ]}
          >
            /{item.unit || "kg"}
          </Text>
        </Text>
        <View style={styles.locationRow}>
          <Ionicons
            name="location-outline"
            size={12}
            color={modernColors.textSecondary}
          />
          <Text
            style={[
              TYPOGRAPHY.caption,
              styles.locationText,
              { color: modernColors.textSecondary },
            ]}
            numberOfLines={1}
          >
            {item.user?.city || item.location}, {item.user?.state || ""}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  /**
   * Render empty/loading state
   */
  const renderEmpty = () => {
    if (loading) {
      return (
        <Text
          style={[
            TYPOGRAPHY.body,
            styles.emptyText,
            { color: modernColors.textSecondary },
          ]}
        >
          {t("common.loading")}
        </Text>
      );
    }
    return null;
  };

  return (
    <LinearGradient
      colors={[modernColors.background, modernColors.backgroundSection]}
      style={styles.container}
    >
      {/* Section Header */}
      <View style={styles.header}>
        <Text
          style={[
            TYPOGRAPHY.h2,
            styles.headerTitle,
            { color: modernColors.textPrimary },
          ]}
        >
          {t("home.featuredProducts")}
        </Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text
            style={[
              TYPOGRAPHY.bodySmall,
              styles.seeAllText,
              { color: modernColors.textPrimary },
            ]}
          >
            {t("home.seeAll")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Products List */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsList}
        ListEmptyComponent={renderEmpty}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    textShadowColor: "rgba(0,0,0,0.12)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  seeAllText: {
    fontWeight: "600",
  },
  productsList: {
    paddingLeft: 20,
  },
  productCard: {
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
  productImage: {
    width: "100%",
    height: 110,
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },
  productPrice: {
    fontWeight: "700",
    marginBottom: 6,
  },
  productUnit: {
    fontWeight: "500",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginLeft: 4,
  },
  emptyText: {
    marginLeft: 20,
  },
});

export default FeaturedProducts;
