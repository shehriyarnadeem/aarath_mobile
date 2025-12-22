import React, {
  useState,
  useContext,
  useCallback,
  Fragment,
  useEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";
import { TYPOGRAPHY } from "../../constants/Typography";
import { apiClient } from "../../utils/apiClient";
import Toast from "react-native-toast-message";
import { useAuth } from "../../context/AuthContext";

const ProductsManagement = ({ navigation }) => {
  const { COLORS, SIZES } = useTheme();
  const [activeFilter, setActiveFilter] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const filterOptions = [
    { key: "all", label: "All", icon: "grid-outline" },
    { key: "ACTIVE", label: "Active", icon: "checkmark-circle-outline" },
    { key: "SOLD_OUT", label: "Sold", icon: "document-outline" },
    { key: "INACTIVE", label: "Inactive", icon: "document-outline" },
    {
      key: "DRAFT",
      label: "Draft",
      icon: "alert-circle-outline",
    },
  ];

  // Load products when component mounts
  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadProducts();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    loadProducts();
  }, [activeFilter]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.products.getById(user?.id, activeFilter);

      if (response.success && response.products) {
        console.log("Products loaded successfully:", response.products.length);
        setProducts(response.products);
      } else {
        console.log("No products found or API response unsuccessful");
        // If no products found, set empty array
        setProducts([]);
      }
    } catch (error) {
      if (error.error.includes("Authorization")) {
        Toast.show({
          type: "error",
          text1: "Session Expired",
          text2: "Please log in to load products",
        });
      }
      // Set empty array on error
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProducts = () => {
    return products;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return COLORS.primaryDark;
      case "DRAFT":
        return COLORS.warning;
      case "SOLD_OUT":
        return COLORS.warning;
      default:
        return COLORS.text;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "ACTIVE":
        return "Active";
      case "DRAFT":
        return "Draft";
      case "SOLD_OUT":
        return "Sold Out";
      case "INACTIVE":
        return "Inactive";
      case "OUT_OF_STOCK":
        return "Out of Stock";
      default:
        return status;
    }
  };

  const handleProductAction = (product, action) => {
    switch (action) {
      case "edit":
        navigation.navigate("ProductEdit", {
          productId: product.id,
          product: product,
        });
        break;
      case "delete":
        Alert.alert(
          "Delete Product",
          `Are you sure you want to delete "${product.name}"?`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => deleteProduct(product.id),
            },
          ]
        );
        break;
    }
  };

  const deleteProduct = (productId) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  const updateProductStatus = (productId, newStatus) => {
    setProducts(
      products.map((p) =>
        p.id === productId ? { ...p, status: newStatus } : p
      )
    );
  };

  const ProductCard = ({ product }) => (
    <View style={styles.productCard}>
      {/* Product Image and Featured Badge */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              product.images?.[0] ||
              "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=150&h=150&fit=crop",
          }}
          style={styles.productImage}
          defaultSource={require("../../../assets/logo.png")}
        />
        {product.featured && (
          <View
            style={[styles.featuredBadge, { backgroundColor: COLORS.primary }]}
          >
            <Ionicons name="star" size={12} color="white" />
          </View>
        )}
      </View>
      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.title}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>Rs {product.price?.toLocaleString()}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(product.status) + "20" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(product.status) },
              ]}
            >
              {getStatusLabel(product.status)}
            </Text>
          </View>
        </View>

        <Text style={styles.quantity}>
          {product.quantity} {product.unit} available
        </Text>
      </View>
      {/* Action Menu */}
      <View style={styles.actionMenu}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleProductAction(product, "edit")}
        >
          <Ionicons name="pencil" size={16} color="#166534" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleProductAction(product, "delete")}
        >
          <Ionicons name="trash-outline" size={16} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.surface,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 20,
      paddingTop: 50,
      backgroundColor: COLORS.primaryDark,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: "#f1f5f9",
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      ...TYPOGRAPHY.h2,
      color: "white",
      flex: 1,
      textAlign: "center",
      marginHorizontal: 16,
      marginTop: 10,
    },
    filterContainer: {
      paddingHorizontal: 24,
      paddingVertical: 20,
      backgroundColor: "white",
      borderBottomWidth: 1,
      borderBottomColor: "#f1f5f9",
    },
    filterScroll: {
      // ScrollView styles only
    },
    filterScrollContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    filterButton: {
      paddingHorizontal: 24,
      paddingVertical: 5,
      marginRight: 0,
      borderRadius: 5,
      backgroundColor: "transparent",
      position: "relative",
    },
    activeFilterButton: {
      backgroundColor: COLORS.primary,
      borderWidth: 1,
      borderColor: "#bbf7d0",
    },
    filterDivider: {
      width: 1,
      height: 20,
      backgroundColor: "#cbd5e1",
      marginHorizontal: 8,
    },
    filterText: {
      ...TYPOGRAPHY.body2,
      color: "#64748b",
      fontSize: 14,
      fontWeight: "500",
    },
    activeFilterText: {
      color: "white",
      fontWeight: "300",
      alignItems: "center",
    },
    metaAdContainer: {
      paddingHorizontal: 24,
      paddingVertical: 12,
    },
    metaAdBanner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#f0fdf4",
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#bbf7d0",
    },
    metaAdContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    metaAdIcon: {
      marginRight: 8,
    },
    metaAdText: {
      ...TYPOGRAPHY.body2,
      color: "#166534",
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 24,
    },
    productCard: {
      flexDirection: "row",
      padding: 20,
      borderRadius: 16,
      marginBottom: 16,
      backgroundColor: "white",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    imageContainer: {
      position: "relative",
    },
    productImage: {
      width: 80,
      height: 80,
      borderRadius: 12,
      backgroundColor: "#f8fafc",
    },
    featuredBadge: {
      position: "absolute",
      top: -6,
      right: -6,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: "#166534",
      justifyContent: "center",
      alignItems: "center",
    },
    productInfo: {
      flex: 1,
      marginLeft: 11,
      justifyContent: "space-between",
    },
    productName: {
      ...TYPOGRAPHY.h4,
      color: "#1e293b",
    },
    priceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 8,
      width: 140,
    },
    price: {
      ...TYPOGRAPHY.h3,
      color: "#1e293b",
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 0,
    },
    statusText: {
      ...TYPOGRAPHY.caption,
      fontWeight: "600",
    },
    quantity: {
      ...TYPOGRAPHY.body2,
      color: "#64748b",
    },
    actionMenu: {
      justifyContent: "center",
      alignItems: "center",
      paddingLeft: 12,
      gap: 12,
    },
    actionButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: "#f8fafc",
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
      paddingVertical: 64,
    },
    emptyIcon: {
      marginBottom: 20,
    },
    emptyTitle: {
      ...TYPOGRAPHY.h3,
      color: "#1e293b",
      textAlign: "center",
      marginBottom: 8,
    },
    emptySubtitle: {
      ...TYPOGRAPHY.body1,
      color: "#64748b",
      textAlign: "center",
      lineHeight: 24,
    },
  });

  const filteredProducts = getFilteredProducts();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Ads</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterScrollContent}
        >
          {filterOptions.map((filter, index) => (
            <Fragment key={filter.key}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === filter.key && styles.activeFilterButton,
                ]}
                onPress={() => setActiveFilter(filter.key)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === filter.key && styles.activeFilterText,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
              {index < filterOptions.length - 1 && (
                <View style={styles.filterDivider} />
              )}
            </Fragment>
          ))}
        </ScrollView>
      </View>

      {/* Meta Ad Banner */}
      <View style={styles.metaAdContainer}>
        <TouchableOpacity
          style={styles.metaAdBanner}
          onPress={() => {
            // Handle meta ad action
            console.log("Meta Ad clicked");
          }}
        >
          <View style={styles.metaAdContent}>
            <Ionicons
              name="megaphone"
              size={16}
              color="#166534"
              style={styles.metaAdIcon}
            />
            <Text style={styles.metaAdText}>
              Boost your sales - Promote your products
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadProducts} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="cube-outline"
              size={48}
              color="#94a3b8"
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySubtitle}>
              {activeFilter === "all"
                ? "You haven't added any products yet."
                : `No products with ${getStatusLabel(
                    activeFilter
                  ).toLowerCase()} status.`}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ProductsManagement;
