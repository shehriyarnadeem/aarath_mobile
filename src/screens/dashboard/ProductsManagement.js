import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useTheme } from "../../constants/Theme";
import { TYPOGRAPHY } from "../../constants/Typography";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useProductsManagement } from "../../hooks/useProductsManagement";
import { useProductStatus } from "../../hooks/useProductStatus";
import {
  ProductCard,
  FilterTabs,
  EmptyProductState,
  PromotionBanner,
} from "../../components/products";

/**
 * ProductsManagement - Screen for managing user's agricultural products
 * Features: Filter by status, edit, delete products
 */
const ProductsManagement = ({ navigation }) => {
  const { COLORS } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");
  const { getStatusLabel } = useProductStatus();

  // Custom hook for products management
  const { products, loading, loadProducts, deleteProduct } =
    useProductsManagement(user?.id, activeFilter);

  // Filter options for agricultural products
  const filterOptions = [
    { key: "all", label: t("products.all"), icon: "grid-outline" },
    {
      key: "ACTIVE",
      label: t("products.active"),
      icon: "checkmark-circle-outline",
    },
    { key: "SOLD_OUT", label: t("products.sold"), icon: "document-outline" },
    {
      key: "INACTIVE",
      label: t("products.inactive"),
      icon: "document-outline",
    },
    {
      key: "DRAFT",
      label: t("products.draft"),
      icon: "alert-circle-outline",
    },
  ];

  /**
   * Handle edit product action
   */
  const handleEditProduct = (product) => {
    navigation.navigate("ProductEdit", {
      productId: product.id,
      product: product,
    });
  };

  /**
   * Handle delete product action
   */
  const handleDeleteProduct = (productId) => {
    deleteProduct(productId);
  };

  /**
   * Handle promotion banner press
   */
  const handlePromotionPress = () => {
    console.log("Promotion banner pressed");
    // TODO: Navigate to promotion/advertising screen
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.surface }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primaryDark}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.primaryDark }]}>
        <Text style={[TYPOGRAPHY.h2, styles.headerTitle]}>
          {t("products.myAds")}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter Tabs */}
      <FilterTabs
        filters={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Promotion Banner */}
      <PromotionBanner onPress={handlePromotionPress} />

      {/* Products List */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadProducts}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))
        ) : (
          <EmptyProductState
            activeFilter={activeFilter}
            statusLabel={getStatusLabel(activeFilter)}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "2200px",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingTop: 50,
  },
  headerTitle: {
    color: "white",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
    marginTop: 10,
  },
  content: {
    flex: 1,
    padding: 24,
    marginBottom: 100,
  },
});

export default ProductsManagement;
