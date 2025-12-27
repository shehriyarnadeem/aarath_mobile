import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../utils/apiClient";

/**
 * Custom hook for fetching featured products on HomeScreen
 * Handles loading state and error handling
 */
export const useFeaturedProducts = (limit = 10) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch featured products from API
   */
  const fetchFeaturedProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.products.getAll({
        page: 1,
        limit,
        sortBy: "createdAt",
        sortOrder: "desc",
        environment: "MARKETPLACE",
        status: "ACTIVE",
      });

      if (response.success && response.products) {
        setProducts(response.products);
      } else {
        throw new Error(response.message || "Failed to fetch products");
      }
    } catch (err) {
      console.error("Failed to fetch featured products:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Fetch on mount
  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchFeaturedProducts,
  };
};
