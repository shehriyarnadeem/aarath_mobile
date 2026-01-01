import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../utils/apiClient";
import Toast from "react-native-toast-message";

/**
 * Custom hook for managing user's products
 * Handles fetching, filtering, and CRUD operations
 */
export const useProductsManagement = (userId, activeFilter = "all") => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load products from API
   * Filters by status if activeFilter is not "all"
   */
  const loadProducts = async () => {
    if (!userId) {
      setProducts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.products.getById(userId, activeFilter);

      if (response.success && response.products) {
        setProducts(response.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
      setError(err.message || "Failed to load products");

      if (err.error?.includes("Authorization")) {
        Toast.show({
          type: "error",
          text1: "Session Expired",
          text2: "Please log in to load products",
        });
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a product
   */
  const deleteProduct = useCallback(async (productId) => {
    try {
      // TODO: Add API call for deletion
      // await apiClient.products.delete(productId);

      setProducts((prev) => prev.filter((p) => p.id !== productId));

      Toast.show({
        type: "success",
        text1: "Product Deleted",
        text2: "Product has been removed successfully",
      });
    } catch (err) {
      console.error("Failed to delete product:", err);
      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: err.message || "Failed to delete product",
      });
    }
  }, []);

  /**
   * Update product status
   */
  const updateProductStatus = useCallback(async (productId, newStatus) => {
    try {
      // TODO: Add API call for status update
      // await apiClient.products.updateStatus(productId, newStatus);

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, status: newStatus } : p))
      );

      Toast.show({
        type: "success",
        text1: "Status Updated",
        text2: `Product status changed to ${newStatus}`,
      });
    } catch (err) {
      console.error("Failed to update status:", err);
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: err.message || "Failed to update product status",
      });
    }
  }, []);

  // Load products when userId or activeFilter changes
  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    loading,
    error,
    loadProducts,
    deleteProduct,
    updateProductStatus,
  };
};
