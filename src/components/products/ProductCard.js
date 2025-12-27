import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";
import { TYPOGRAPHY } from "../../constants/Typography";
import { useProductStatus } from "../../hooks/useProductStatus";

/**
 * ProductCard - Displays individual product information
 * Shows image, title, price, status, and action buttons
 */
const ProductCard = ({ product, onEdit, onDelete }) => {
  const { COLORS } = useTheme();
  const { getStatusColor, getStatusLabel } = useProductStatus();

  /**
   * Handle delete with confirmation
   */
  const handleDelete = () => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${product.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(product.id),
        },
      ]
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: COLORS.white }]}>
      {/* Product Image */}
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
        <Text
          style={[TYPOGRAPHY.h4, styles.productName, { color: COLORS.dark }]}
          numberOfLines={2}
        >
          {product.title}
        </Text>

        <View style={styles.priceRow}>
          <Text style={[TYPOGRAPHY.h3, styles.price, { color: COLORS.dark }]}>
            Rs {product.price?.toLocaleString()}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(product.status) + "20" },
            ]}
          >
            <Text
              style={[
                TYPOGRAPHY.caption,
                styles.statusText,
                { color: getStatusColor(product.status) },
              ]}
            >
              {getStatusLabel(product.status)}
            </Text>
          </View>
        </View>

        <Text
          style={[TYPOGRAPHY.body2, styles.quantity, { color: COLORS.gray600 }]}
        >
          {product.quantity} {product.unit} available
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionMenu}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.surface }]}
          onPress={() => onEdit(product)}
        >
          <Ionicons name="pencil" size={16} color="#166534" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.surface }]}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={16} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
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
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    flex: 1,
    marginLeft: 11,
    justifyContent: "space-between",
  },
  productName: {
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    width: 140,
  },
  price: {},
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    fontWeight: "600",
  },
  quantity: {},
  actionMenu: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 12,
    gap: 12,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
});

export default ProductCard;
