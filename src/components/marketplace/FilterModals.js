import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  TextInput,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";
import { TYPOGRAPHY } from "../../constants/Typography";
import Slider from "@react-native-community/slider";

const { height: screenHeight } = Dimensions.get("window");

const BottomSheetModal = ({
  visible,
  onClose,
  children,
  title,
  height = screenHeight * 0.6,
}) => {
  const { COLORS, SHADOWS } = useTheme();
  const translateY = useRef(new Animated.Value(height)).current;

  // Pan responder for drag to close
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 10 && gestureState.dy > 0;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > height * 0.3) {
        onClose();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            height: height,
            backgroundColor: COLORS.white,
            transform: [{ translateY }],
          },
          SHADOWS.xl,
        ]}
        {...panResponder.panHandlers}
      >
        {/* Header */}
        <View style={styles.header}>
          <View
            style={[styles.dragHandle, { backgroundColor: COLORS.gray300 }]}
          />
          <View style={styles.headerContent}>
            <Text
              style={[
                TYPOGRAPHY.h3,
                { color: COLORS.textPrimary, fontWeight: "600" },
              ]}
            >
              {title}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.gray600} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </View>
  );
};

// Sort Modal Component
export const SortModal = ({ visible, onClose, selectedSort, onSortSelect }) => {
  const { COLORS } = useTheme();

  const sortOptions = [
    { id: "all", title: "All", subtitle: "All Ads" },
    { id: "latest", title: "Latest", subtitle: "Newest Ads first" },
    { id: "price_low", title: "Price: Low → High", subtitle: "Cheapest first" },
    {
      id: "price_high",
      title: "Price: High → Low",
      subtitle: "Most expensive first",
    },
    { id: "recommended", title: "Recommended", subtitle: "Best match for you" },
  ];

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title="Sort Products"
      height={screenHeight * 0.4}
    >
      <ScrollView style={styles.optionsList}>
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionItem,
              selectedSort === option.id && {
                backgroundColor: COLORS.primary + "10",
                borderLeftColor: COLORS.primary,
                borderLeftWidth: 3,
              },
            ]}
            onPress={() => {
              onSortSelect(option.id);
              onClose();
            }}
          >
            <View style={styles.optionContent}>
              <Text
                style={[
                  TYPOGRAPHY.body,
                  {
                    color:
                      selectedSort === option.id
                        ? COLORS.primary
                        : COLORS.textPrimary,
                    fontWeight: selectedSort === option.id ? "600" : "500",
                  },
                ]}
              >
                {option.title}
              </Text>
              <Text
                style={[TYPOGRAPHY.bodySmall, { color: COLORS.textSecondary }]}
              >
                {option.subtitle}
              </Text>
            </View>
            {selectedSort === option.id && (
              <Ionicons name="checkmark" size={20} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </BottomSheetModal>
  );
};

// Price Range Modal Component
export const PriceRangeModal = ({
  visible,
  onClose,
  priceRange,
  onPriceRangeChange,
}) => {
  const { COLORS } = useTheme();
  const [tempRange, setTempRange] = useState(
    priceRange || { min: 0, max: 10000 }
  );

  const handleApply = () => {
    onPriceRangeChange(tempRange);
    onClose();
  };

  const handleReset = () => {
    const resetRange = { min: 0, max: 10000 };
    setTempRange(resetRange);
    onPriceRangeChange(resetRange);
  };

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title="Price Range"
      height={screenHeight * 0.8}
    >
      <View style={styles.priceRangeContent}>
        <Text
          style={[
            TYPOGRAPHY.bodySmall,
            { color: COLORS.textSecondary, marginBottom: 20 },
          ]}
        >
          Set your preferred price range
        </Text>

        {/* Price Range Display */}
        <View style={styles.priceDisplay}>
          <View
            style={[
              styles.priceBox,
              { backgroundColor: COLORS.gray50, borderColor: COLORS.gray300 },
            ]}
          >
            <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}>
              Min Price
            </Text>
            <Text
              style={[
                TYPOGRAPHY.body,
                { color: COLORS.textPrimary, fontWeight: "600" },
              ]}
            >
              ₨{tempRange.min.toLocaleString()}
            </Text>
          </View>
          <Text
            style={[
              TYPOGRAPHY.body,
              { color: COLORS.textSecondary, marginHorizontal: 16 },
            ]}
          >
            to
          </Text>
          <View
            style={[
              styles.priceBox,
              { backgroundColor: COLORS.gray50, borderColor: COLORS.gray300 },
            ]}
          >
            <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}>
              Max Price
            </Text>
            <Text
              style={[
                TYPOGRAPHY.body,
                { color: COLORS.textPrimary, fontWeight: "600" },
              ]}
            >
              ₨{tempRange.max.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Min Slider */}
        <View style={styles.sliderContainer}>
          <Text
            style={[
              TYPOGRAPHY.bodySmall,
              { color: COLORS.textPrimary, marginBottom: 8 },
            ]}
          >
            Minimum Price
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={tempRange.max - 100}
            value={tempRange.min}
            onValueChange={(value) =>
              setTempRange({ ...tempRange, min: Math.round(value) })
            }
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.gray300}
            thumbStyle={{ backgroundColor: COLORS.primary }}
            step={50}
          />
        </View>

        {/* Max Slider */}
        <View style={styles.sliderContainer}>
          <Text
            style={[
              TYPOGRAPHY.bodySmall,
              { color: COLORS.textPrimary, marginBottom: 8 },
            ]}
          >
            Maximum Price
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={tempRange.min + 100}
            maximumValue={10000}
            value={tempRange.max}
            onValueChange={(value) =>
              setTempRange({ ...tempRange, max: Math.round(value) })
            }
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.gray300}
            thumbStyle={{ backgroundColor: COLORS.primary }}
            step={50}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.resetButton,
              { borderColor: COLORS.gray300 },
            ]}
            onPress={handleReset}
          >
            <Text
              style={[
                TYPOGRAPHY.bodySmall,
                { color: COLORS.textSecondary, fontWeight: "600" },
              ]}
            >
              Reset
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.applyButton,
              { backgroundColor: COLORS.primary },
            ]}
            onPress={handleApply}
          >
            <Text
              style={[
                TYPOGRAPHY.bodySmall,
                { color: COLORS.white, fontWeight: "600" },
              ]}
            >
              Apply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModal>
  );
};

// Location Modal Component
export const LocationModal = ({
  visible,
  onClose,
  selectedLocation,
  onLocationSelect,
}) => {
  const { COLORS } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const cities = [
    "All Locations",
    "Lahore",
    "Karachi",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Gujranwala",
    "Peshawar",
    "Quetta",
    "Sialkot",
    "Sargodha",
    "Bahawalpur",
    "Sukkur",
    "Larkana",
    "Jhang",
    "Okara",
    "Kasur",
  ];

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title="Select Location"
      height={screenHeight * 0.7}
    >
      <View style={styles.locationContent}>
        {/* Search Input */}
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: COLORS.gray50, borderColor: COLORS.gray300 },
          ]}
        >
          <Ionicons name="search" size={20} color={COLORS.gray500} />
          <TextInput
            style={[
              TYPOGRAPHY.body,
              styles.searchInput,
              { color: COLORS.textPrimary },
            ]}
            placeholder="Search cities..."
            placeholderTextColor={COLORS.gray500}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Cities List */}
        <ScrollView style={styles.citiesList}>
          {filteredCities.map((city) => (
            <TouchableOpacity
              key={city}
              style={[
                styles.cityItem,
                selectedLocation ===
                  (city === "All Locations" ? "all" : city) && {
                  backgroundColor: COLORS.primary + "10",
                  borderLeftColor: COLORS.primary,
                  borderLeftWidth: 3,
                },
              ]}
              onPress={() => {
                onLocationSelect(city === "All Locations" ? "all" : city);
                onClose();
              }}
            >
              <Ionicons
                name="location-outline"
                size={20}
                color={
                  selectedLocation === (city === "All Locations" ? "all" : city)
                    ? COLORS.primary
                    : COLORS.gray500
                }
              />
              <Text
                style={[
                  TYPOGRAPHY.body,
                  {
                    marginLeft: 12,
                    color:
                      selectedLocation ===
                      (city === "All Locations" ? "all" : city)
                        ? COLORS.primary
                        : COLORS.textPrimary,
                    fontWeight:
                      selectedLocation ===
                      (city === "All Locations" ? "all" : city)
                        ? "600"
                        : "500",
                  },
                ]}
              >
                {city}
              </Text>
              {selectedLocation ===
                (city === "All Locations" ? "all" : city) && (
                <Ionicons
                  name="checkmark"
                  size={20}
                  color={COLORS.primary}
                  style={{ marginLeft: "auto" }}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </BottomSheetModal>
  );
};

// Category Modal Component
export const CategoryModal = ({
  visible,
  onClose,
  selectedCategory,
  onCategorySelect,
}) => {
  const { COLORS } = useTheme();

  const categories = [
    { id: "all", name: "All Categories", icon: "grid-outline" },
    { id: "Rice", name: "Rice", icon: "leaf-outline" },
    { id: "Paddy", name: "Paddy", icon: "water-outline" },
    { id: "Wheat", name: "Wheat", icon: "nutrition-outline" },
    { id: "Maize", name: "Maize", icon: "flower-outline" },
    { id: "Pulses", name: "Pulses", icon: "ellipse-outline" },
    { id: "Spices", name: "Spices", icon: "sparkles-outline" },
  ];

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title="Select Category"
      height={screenHeight * 0.6}
    >
      <ScrollView style={styles.categoriesList}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryItem,
              selectedCategory === category.id && {
                backgroundColor: COLORS.primary + "10",
                borderLeftColor: COLORS.primary,
                borderLeftWidth: 3,
              },
            ]}
            onPress={() => {
              onCategorySelect(category.id);
              onClose();
            }}
          >
            <View
              style={[
                styles.categoryIcon,
                {
                  backgroundColor:
                    selectedCategory === category.id
                      ? COLORS.primary
                      : COLORS.gray100,
                },
              ]}
            >
              <Ionicons
                name={category.icon}
                size={24}
                color={
                  selectedCategory === category.id
                    ? COLORS.white
                    : COLORS.gray600
                }
              />
            </View>
            <Text
              style={[
                TYPOGRAPHY.body,
                {
                  marginLeft: 12,
                  color:
                    selectedCategory === category.id
                      ? COLORS.primary
                      : COLORS.textPrimary,
                  fontWeight: selectedCategory === category.id ? "600" : "500",
                },
              ]}
            >
              {category.name}
            </Text>
            {selectedCategory === category.id && (
              <Ionicons
                name="checkmark"
                size={20}
                color={COLORS.primary}
                style={{ marginLeft: "auto" }}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },

  // Sort Modal Styles
  optionsList: {
    flex: 1,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: "#fafafa",
  },
  optionContent: {
    flex: 1,
  },

  // Price Range Modal Styles
  priceRangeContent: {
    flex: 1,
  },
  priceDisplay: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  priceBox: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  sliderContainer: {
    marginBottom: 20,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  resetButton: {
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  applyButton: {
    // backgroundColor set inline
  },

  // Location Modal Styles
  locationContent: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
  },
  citiesList: {
    flex: 1,
  },
  cityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 4,
    borderRadius: 8,
  },

  // Category Modal Styles
  categoriesList: {
    flex: 1,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BottomSheetModal;
