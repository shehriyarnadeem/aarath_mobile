import { useState, useRef, useEffect } from "react";
import { Animated } from "react-native";

/**
 * Custom hook for managing product detail screen state and utilities
 * @param {Object} product - Product data from route params
 * @returns {Object} State and utility functions
 */
export const useProductDetail = (product) => {
  // State management
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeSpecTab, setActiveSpecTab] = useState(0);

  // Animation refs
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  /**
   * Format date to readable string
   */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  /**
   * Format price with currency
   */
  const formatPrice = (price) => {
    if (!price) return "N/A";
    return `Rs ${price.toLocaleString()}`;
  };

  /**
   * Toggle favorite status
   */
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Add API call to save favorite status
  };

  /**
   * Toggle description expansion
   */
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  /**
   * Update selected image index from scroll
   */
  const updateImageIndex = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(contentOffsetX / viewSize);
    setSelectedImageIndex(index);
  };

  return {
    // State
    selectedImageIndex,
    setSelectedImageIndex,
    selectedTab,
    setSelectedTab,
    isFavorite,
    showFullDescription,
    activeSpecTab,
    setActiveSpecTab,
    scrollY,
    headerOpacity,

    // Utility functions
    formatDate,
    formatPrice,
    handleToggleFavorite,
    toggleDescription,
    updateImageIndex,
  };
};
