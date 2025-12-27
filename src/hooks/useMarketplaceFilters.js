import { useState, useCallback, useMemo } from "react";

/**
 * Custom hook for managing marketplace filters
 * Handles filter state, modals, and active filter counting
 */
export const useMarketplaceFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState({
    sort: null,
    priceRange: { min: 0, max: 10000 },
    location: "all",
    category: "all",
    ...initialFilters,
  });

  const [modals, setModals] = useState({
    sort: false,
    price: false,
    location: false,
    category: false,
  });

  /**
   * Calculate active filters count
   */
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.sort) count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < 10000) count++;
    if (filters.location !== "all") count++;
    if (filters.category !== "all") count++;
    return count;
  }, [filters]);

  /**
   * Open modal by name
   */
  const openModal = useCallback((modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
  }, []);

  /**
   * Close modal by name
   */
  const closeModal = useCallback((modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
  }, []);

  /**
   * Update sort filter
   */
  const handleSortSelect = useCallback((sortType) => {
    setFilters((prev) => ({
      ...prev,
      sort: sortType === "all" ? null : sortType,
    }));
  }, []);

  /**
   * Update price range filter
   */
  const handlePriceRangeChange = useCallback((priceRange) => {
    setFilters((prev) => ({ ...prev, priceRange }));
  }, []);

  /**
   * Update location filter
   */
  const handleLocationSelect = useCallback((location) => {
    setFilters((prev) => ({ ...prev, location }));
  }, []);

  /**
   * Update category filter
   */
  const handleCategorySelect = useCallback((category) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  /**
   * Apply preset filter (e.g., from navigation params)
   */
  const applyPresetFilter = useCallback((presetFilter) => {
    if (!presetFilter) return;

    setFilters((prev) => {
      const newFilters = { ...prev };

      if (presetFilter.type === "category") {
        newFilters.category = presetFilter.value;
      } else if (presetFilter.type === "location") {
        newFilters.location = presetFilter.value;
      } else if (presetFilter.type === "sort") {
        newFilters.sort = presetFilter.value;
      }

      return newFilters;
    });
  }, []);

  /**
   * Reset all filters to default
   */
  const resetFilters = useCallback(() => {
    setFilters({
      sort: null,
      priceRange: { min: 0, max: 10000 },
      location: "all",
      category: "all",
    });
  }, []);

  return {
    filters,
    modals,
    activeFiltersCount,
    openModal,
    closeModal,
    handleSortSelect,
    handlePriceRangeChange,
    handleLocationSelect,
    handleCategorySelect,
    applyPresetFilter,
    resetFilters,
  };
};
