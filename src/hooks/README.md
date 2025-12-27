# Custom Hooks

This directory contains reusable custom React hooks for the Aarath Agricultural Marketplace mobile application.

## Available Hooks

### `useMarketplaceProducts`

**Purpose**: Manages marketplace product data fetching, pagination, and error states.

**Usage**:

```javascript
import { useMarketplaceProducts } from "../hooks/useMarketplaceProducts";

const {
  products,
  loading,
  error,
  refreshing,
  pagination,
  onRefresh,
  loadMore,
  refetch,
} = useMarketplaceProducts(filters, initialLimit);
```

**Parameters**:

- `filters` (object): Current filter state (sort, priceRange, location, category)
- `initialLimit` (number, default: 20): Number of products per page

**Returns**:

- `products` (array): List of fetched products
- `loading` (boolean): Initial loading state
- `error` (string|null): Error message if fetch failed
- `refreshing` (boolean): Pull-to-refresh loading state
- `pagination` (object): Pagination info (page, limit, total, totalPages)
- `onRefresh` (function): Handler for pull-to-refresh
- `loadMore` (function): Handler for infinite scroll
- `refetch` (function): Manually refetch products

**Features**:

- Automatic refetch when filters change
- Pagination support with infinite scroll
- Pull-to-refresh functionality
- Error handling
- API parameter building from filters

---

### `useMarketplaceFilters`

**Purpose**: Manages marketplace filter state, modals, and active filter counting.

**Usage**:

```javascript
import { useMarketplaceFilters } from "../hooks/useMarketplaceFilters";

const {
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
} = useMarketplaceFilters(initialFilters);
```

**Parameters**:

- `initialFilters` (object, optional): Initial filter values

**Returns**:

- `filters` (object): Current filter state
- `modals` (object): Modal visibility states
- `activeFiltersCount` (number): Count of active filters
- `openModal` (function): Open filter modal by name
- `closeModal` (function): Close filter modal by name
- `handleSortSelect` (function): Update sort filter
- `handlePriceRangeChange` (function): Update price range filter
- `handleLocationSelect` (function): Update location filter
- `handleCategorySelect` (function): Update category filter
- `applyPresetFilter` (function): Apply preset filter from navigation
- `resetFilters` (function): Reset all filters to default

**Features**:

- Centralized filter state management
- Modal state management
- Active filter counting
- Preset filter application (for navigation)
- Filter reset functionality

---

## Best Practices

1. **Separation of Concerns**: Use these hooks to separate data fetching and state management from UI components
2. **Reusability**: These hooks can be used across multiple screens that need marketplace functionality
3. **Performance**: Hooks use `useCallback` and `useMemo` for optimal performance
4. **Clean Code**: Component code stays focused on rendering while hooks handle complex logic

## Example: Complete Integration

```javascript
import React, { useEffect } from "react";
import { FlatList } from "react-native";
import { useMarketplaceProducts } from "../hooks/useMarketplaceProducts";
import { useMarketplaceFilters } from "../hooks/useMarketplaceFilters";
import { ProductCard } from "../components/marketplace";

const MarketplaceScreen = ({ route }) => {
  // Filter management
  const {
    filters,
    modals,
    activeFiltersCount,
    openModal,
    closeModal,
    handleSortSelect,
    applyPresetFilter,
  } = useMarketplaceFilters();

  // Products data management
  const { products, loading, error, refreshing, onRefresh, loadMore } =
    useMarketplaceProducts(filters);

  // Apply preset filters from navigation
  useEffect(() => {
    if (route?.params?.presetFilter) {
      applyPresetFilter(route.params.presetFilter);
    }
  }, [route?.params?.presetFilter]);

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} />}
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
    />
  );
};
```
