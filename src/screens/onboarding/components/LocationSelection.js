import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useTheme } from "../../../constants/Theme";
import { useTranslation } from "react-i18next";
const { height: screenHeight } = Dimensions.get("window");
// Conditional import for react-native-maps (only works in native builds)
let MapView, Marker;
let HAS_NATIVE_MAP_SUPPORT = false;

// For development and testing, we'll enable native maps
// Set to false if you encounter compatibility issues in Expo Go
const ENABLE_NATIVE_MAPS = true;

if (ENABLE_NATIVE_MAPS && Platform.OS !== "web") {
  try {
    const mapModule = require("react-native-maps");
    MapView = mapModule.default || mapModule.MapView || mapModule;
    Marker = mapModule.Marker;
    HAS_NATIVE_MAP_SUPPORT = true;
    console.log("✅ Native maps successfully loaded");
  } catch (error) {
    console.warn("❌ Native maps not available:", error.message);
    console.log("Using fallback interface instead");
  }
} else {
  console.log("🔧 Native maps disabled or running on web platform");
}

const { width, height } = Dimensions.get("window");

// Pakistani cities data with coordinates
const PAKISTANI_CITIES = [
  {
    label: "Karachi",
    value: "Karachi",
    coordinates: { lat: 24.8607, lng: 67.0011 },
  },
  {
    label: "Lahore",
    value: "Lahore",
    coordinates: { lat: 31.5204, lng: 74.3587 },
  },
  {
    label: "Islamabad",
    value: "Islamabad",
    coordinates: { lat: 33.6844, lng: 73.0479 },
  },
  {
    label: "Rawalpindi",
    value: "Rawalpindi",
    coordinates: { lat: 33.5651, lng: 73.0169 },
  },
  {
    label: "Faisalabad",
    value: "Faisalabad",
    coordinates: { lat: 31.4504, lng: 73.135 },
  },
  {
    label: "Multan",
    value: "Multan",
    coordinates: { lat: 30.1575, lng: 71.5249 },
  },
  {
    label: "Peshawar",
    value: "Peshawar",
    coordinates: { lat: 34.0151, lng: 71.5249 },
  },
  {
    label: "Quetta",
    value: "Quetta",
    coordinates: { lat: 30.1798, lng: 66.975 },
  },
  {
    label: "Sialkot",
    value: "Sialkot",
    coordinates: { lat: 32.4945, lng: 74.5229 },
  },
  {
    label: "Gujranwala",
    value: "Gujranwala",
    coordinates: { lat: 32.1877, lng: 74.1945 },
  },
  {
    label: "Hyderabad",
    value: "Hyderabad",
    coordinates: { lat: 25.396, lng: 68.3578 },
  },
  {
    label: "Bahawalpur",
    value: "Bahawalpur",
    coordinates: { lat: 29.4, lng: 71.6833 },
  },
];

const LocationSelection = ({
  selectedState,
  selectedCity,
  selectedLocation,
  onLocationSelect,
}) => {
  const { COLORS, SIZES } = useTheme();

  // Location selection states
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [isCityStep, setIsCityStep] = useState(true);
  const [selectedCityData, setSelectedCityData] = useState(
    selectedLocation
      ? PAKISTANI_CITIES.find((city) => city.value === selectedCity) || null
      : null
  );
  const { t } = useTranslation();
  const [tempMapRegion, setTempMapRegion] = useState({
    latitude: 31.5204,
    longitude: 74.3587,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(
    selectedLocation && selectedLocation.latitude && selectedLocation.longitude
      ? selectedLocation
      : null
  );
  const [isLoadingMap, setIsLoadingMap] = useState(false);

  // Location utility functions
  const getCityCoordinates = (cityName) => {
    const city = PAKISTANI_CITIES.find((c) => c.value === cityName);
    return city?.coordinates || { lat: 31.5204, lng: 74.3587 };
  };

  const reverseGeocodeLocation = async (latitude, longitude) => {
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (response && response.length > 0) {
        return response[0];
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
    return null;
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Error requesting location permission:", error);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(
          "Permission Required",
          "Please enable location permissions to use this feature."
        );
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return location.coords;
    } catch (error) {
      console.error("Error getting current location:", error);
      Alert.alert("Error", "Failed to get your current location.");
      return null;
    }
  };

  const handleCitySelect = async (city) => {
    try {
      const cityData = PAKISTANI_CITIES.find((c) => c.value === city.value);
      if (!cityData) {
        console.error("City data not found for:", city);
        Alert.alert("Error", "Failed to load city data. Please try again.");
        return;
      }

      setSelectedCityData(cityData);
      setIsLoadingMap(true);

      // Set map region to city coordinates
      const newRegion = {
        latitude: cityData.coordinates.lat,
        longitude: cityData.coordinates.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      setTempMapRegion(newRegion);

      // Use setTimeout to ensure state updates complete before transition
      setTimeout(() => {
        setIsLoadingMap(false);
        setIsCityStep(false); // Move to map step
      }, 100);
    } catch (error) {
      console.error("Error in handleCitySelect:", error);
      setIsLoadingMap(false);
      Alert.alert("Error", "Failed to select city. Please try again.");
    }
  };

  const handleMapLocationSelect = async (coordinate) => {
    const result = await reverseGeocodeLocation(
      coordinate.latitude,
      coordinate.longitude
    );

    const locationData = {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      address: result
        ? [
            result.street,
            result.district || result.subregion,
            result.city || result.region,
            result.country,
          ]
            .filter(Boolean)
            .join(", ")
        : "",
      city: selectedCityData?.value || "",
      state: result?.region || "",
      country: result?.country || "Pakistan",
    };

    setSelectedMarker(locationData);
  };

  const handleCurrentLocation = async () => {
    const coords = await getCurrentLocation();
    if (coords) {
      setCurrentLocation(coords);
      await handleMapLocationSelect(coords);
    }
  };

  const handleConfirmLocation = () => {
    if (selectedMarker && selectedMarker.latitude && selectedMarker.longitude) {
      try {
        // Update the parent component with all location data
        onLocationSelect(
          selectedMarker?.state,
          selectedMarker.city || selectedCityData?.value || "",
          selectedMarker
        );
        handleCloseModal();
      } catch (error) {
        console.error("Error confirming location:", error);
        Alert.alert("Error", "Failed to save location. Please try again.");
      }
    } else {
      Alert.alert(
        "Please select a location",
        "Tap on the map to select your exact location."
      );
    }
  };

  const handleCloseModal = () => {
    setIsLocationModalVisible(false);
    setIsCityStep(true);
    setIsLoadingMap(false);
  };

  // Two-layer Location Selection Modal
  const LocationPickerModal = () => {
    return (
      <Modal
        visible={isLocationModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <View
          style={[styles.locationModal, { backgroundColor: COLORS.background }]}
        >
          {/* Header */}
          <View
            style={[
              styles.locationModalHeader,
              { backgroundColor: COLORS.white },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                if (!isCityStep) {
                  setIsCityStep(true);
                  setIsLoadingMap(false);
                } else {
                  handleCloseModal();
                }
              }}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
            </TouchableOpacity>
            <Text style={[styles.locationModalTitle, { color: COLORS.dark }]}>
              {isCityStep ? "Select City" : "Select Location"}
            </Text>
            <TouchableOpacity onPress={handleCloseModal}>
              <Ionicons name="close" size={24} color={COLORS.dark} />
            </TouchableOpacity>
          </View>

          {isCityStep ? (
            /* City Selection Step */
            <View style={styles.citySelectionContainer}>
              <Text style={[styles.stepDescription, { color: COLORS.gray }]}>
                Choose your city to help us provide better local services
              </Text>

              {isLoadingMap ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={[styles.loadingText, { color: COLORS.gray }]}>
                    Loading map...
                  </Text>
                </View>
              ) : (
                <ScrollView
                  style={styles.cityList}
                  showsVerticalScrollIndicator={false}
                >
                  {PAKISTANI_CITIES.map((city) => (
                    <TouchableOpacity
                      key={city.value}
                      style={[
                        styles.cityItem,
                        {
                          backgroundColor:
                            selectedCityData?.value === city.value
                              ? COLORS.primary + "15"
                              : COLORS.white,
                          borderColor:
                            selectedCityData?.value === city.value
                              ? COLORS.primary
                              : COLORS.lightGray,
                        },
                      ]}
                      onPress={() => handleCitySelect(city)}
                      disabled={isLoadingMap}
                    >
                      <View style={styles.cityItemContent}>
                        <Ionicons
                          name="location-outline"
                          size={20}
                          color={
                            selectedCityData?.value === city.value
                              ? COLORS.primary
                              : COLORS.gray
                          }
                        />
                        <Text
                          style={[
                            styles.cityItemText,
                            {
                              color:
                                selectedCityData?.value === city.value
                                  ? COLORS.primary
                                  : COLORS.dark,
                              fontWeight:
                                selectedCityData?.value === city.value
                                  ? "600"
                                  : "500",
                            },
                          ]}
                        >
                          {city.label}
                        </Text>
                      </View>
                      {selectedCityData?.value === city.value && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={COLORS.primary}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          ) : (
            /* Map Selection Step */
            <View style={styles.mapContainer}>
              <Text
                style={[
                  styles.stepDescription,
                  { color: COLORS.gray, padding: 20 },
                ]}
              >
                Tap on the map to select your exact location in{" "}
                {selectedCityData?.label}
              </Text>

              {HAS_NATIVE_MAP_SUPPORT ? (
                <View style={styles.mapWrapper}>
                  <MapView
                    style={styles.map}
                    initialRegion={tempMapRegion}
                    region={tempMapRegion}
                    onPress={(event) => {
                      try {
                        if (event?.nativeEvent?.coordinate) {
                          handleMapLocationSelect(event.nativeEvent.coordinate);
                        }
                      } catch (error) {
                        console.error(
                          "Error selecting location on map:",
                          error
                        );
                      }
                    }}
                    onError={(error) => {
                      console.error("MapView error:", error);
                    }}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    loadingEnabled={true}
                    loadingIndicatorColor={COLORS.primary}
                  >
                    {selectedMarker && (
                      <Marker
                        coordinate={{
                          latitude: selectedMarker.latitude,
                          longitude: selectedMarker.longitude,
                        }}
                        title="Selected Location"
                        description={selectedMarker.address}
                      />
                    )}
                  </MapView>
                </View>
              ) : (
                /* Fallback for when native maps aren't available */
                <View
                  style={[
                    styles.mapFallback,
                    { backgroundColor: COLORS.white },
                  ]}
                >
                  <View style={styles.mapPlaceholderContainer}>
                    <View
                      style={[
                        styles.mapIconContainer,
                        { backgroundColor: COLORS.primary + "20" },
                      ]}
                    >
                      <Ionicons
                        name="map-outline"
                        size={40}
                        color={COLORS.primary}
                      />
                    </View>
                    <Text
                      style={[styles.mapFallbackTitle, { color: COLORS.dark }]}
                    >
                      Map View
                    </Text>
                    <Text
                      style={[
                        styles.mapFallbackSubtitle,
                        { color: COLORS.gray },
                      ]}
                    >
                      Interactive map will be available in the full app build
                    </Text>
                  </View>

                  {selectedMarker && (
                    <View style={styles.coordinatesContainer}>
                      <Text
                        style={[
                          styles.coordinatesLabel,
                          { color: COLORS.dark },
                        ]}
                      >
                        Selected Coordinates:
                      </Text>
                      <Text
                        style={[
                          styles.coordinatesText,
                          { color: COLORS.primary },
                        ]}
                      >
                        {selectedMarker.latitude.toFixed(6)},{" "}
                        {selectedMarker.longitude.toFixed(6)}
                      </Text>
                      <Text style={[styles.cityLabel, { color: COLORS.gray }]}>
                        {selectedCityData?.label}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.locationActions}>
                <TouchableOpacity
                  style={[
                    styles.currentLocationBtn,
                    {
                      backgroundColor: COLORS.white,
                      borderColor: COLORS.lightGray,
                    },
                  ]}
                  onPress={handleCurrentLocation}
                >
                  <Ionicons name="locate" size={20} color={COLORS.primary} />
                  <Text
                    style={[
                      styles.currentLocationText,
                      { color: COLORS.primary },
                    ]}
                  >
                    Use Current Location
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.confirmLocationBtn,
                    {
                      backgroundColor: selectedMarker
                        ? COLORS.primary
                        : COLORS.gray,
                      opacity: selectedMarker ? 1 : 0.5,
                    },
                  ]}
                  onPress={handleConfirmLocation}
                  disabled={!selectedMarker}
                >
                  <Ionicons name="checkmark" size={20} color={COLORS.white} />
                  <Text
                    style={[
                      styles.confirmLocationText,
                      { color: COLORS.white },
                    ]}
                  >
                    Confirm Location
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    );
  };

  // Location Field Component
  const LocationField = ({ label, location, cityData, onPress }) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, { color: COLORS.dark }]}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.locationButton,
          {
            borderColor: location?.latitude ? COLORS.primary : COLORS.lightGray,
            backgroundColor: COLORS.background,
          },
        ]}
        onPress={onPress}
      >
        <View style={styles.locationContent}>
          <View
            style={[
              styles.locationIconContainer,
              { backgroundColor: COLORS.primary + "15" },
            ]}
          >
            <Ionicons
              name="location-outline"
              size={20}
              color={COLORS.primary}
            />
          </View>
          <View style={styles.locationTextContainer}>
            {location?.latitude && cityData ? (
              <>
                <Text style={[styles.locationText, { color: COLORS.dark }]}>
                  📍 {cityData.label}
                </Text>
                <Text style={[styles.locationSubtext, { color: COLORS.gray }]}>
                  {location.address ||
                    `${location.latitude.toFixed(
                      4
                    )}, ${location.longitude.toFixed(4)}`}
                </Text>
                <Text
                  style={[styles.locationChangeText, { color: COLORS.primary }]}
                >
                  Tap to change location
                </Text>
              </>
            ) : (
              <Text
                style={[styles.locationPlaceholder, { color: COLORS.gray }]}
              >
                {t("onboarding.chooseLocation")}
              </Text>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.subtitle, { color: COLORS.gray600 }]}>
        {t("onboarding.selectLocationSubtitle")}
      </Text>

      <View style={styles.formContainer}>
        <LocationField
          label={t("onboarding.location")}
          location={selectedLocation}
          cityData={selectedCityData}
          onPress={() => setIsLocationModalVisible(true)}
        />

        {/* Selected Location Summary */}
        {selectedLocation?.latitude && selectedCityData && (
          <View
            style={[
              styles.locationSummary,
              { backgroundColor: COLORS.primary + "10" },
            ]}
          >
            <View style={styles.summaryHeader}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={COLORS.primary}
              />
              <Text style={[styles.summaryTitle, { color: COLORS.primary }]}>
                Location Selected
              </Text>
            </View>
            <View style={styles.summaryDetails}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: COLORS.gray600 }]}>
                  City:
                </Text>
                <Text style={[styles.summaryValue, { color: COLORS.dark }]}>
                  {selectedCityData.label}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: COLORS.gray600 }]}>
                  Address:
                </Text>
                <Text style={[styles.summaryValue, { color: COLORS.dark }]}>
                  {selectedLocation.address || "Custom location"}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: COLORS.gray600 }]}>
                  Coordinates:
                </Text>
                <Text
                  style={[styles.summaryCoordinates, { color: COLORS.gray500 }]}
                >
                  {selectedLocation.latitude.toFixed(6)},{" "}
                  {selectedLocation.longitude.toFixed(6)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Location Picker Modal */}
      <LocationPickerModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 3,
    textAlign: "center",
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
    marginTop: 4,
  },
  // Input Fields
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    letterSpacing: 0.2,
  },

  // Location Field Styles
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderWidth: 1.5,
    borderRadius: 12,
    minHeight: 70,
  },
  locationContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  locationSubtext: {
    fontSize: 12,
    marginBottom: 10,
  },
  locationChangeText: {
    fontSize: 11,
    fontStyle: "italic",
  },
  locationPlaceholder: {
    fontSize: 16,
  },

  // Location Modal Styles
  locationModal: {
    flex: 1,
  },
  locationModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  locationModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },

  // City Selection Styles
  citySelectionContainer: {
    flex: 1,
    padding: 20,
  },
  stepDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  cityList: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
  },
  cityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  cityItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cityItemText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },

  // Map Styles
  mapContainer: {
    flex: 1,
    padding: 20,
  },
  mapWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 20,
  },
  map: {
    flex: 1,
  },
  locationActions: {
    gap: 12,
  },
  currentLocationBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    gap: 8,
  },
  currentLocationText: {
    fontSize: 16,
    fontWeight: "600",
  },
  confirmLocationBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  confirmLocationText: {
    fontSize: 16,
    fontWeight: "700",
  },

  // Fallback Map Styles
  mapFallback: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  mapPlaceholderContainer: {
    alignItems: "center",
    padding: 30,
    borderRadius: 16,
    marginBottom: 20,
  },
  mapIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  mapFallbackTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 4,
  },
  mapFallbackSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 18,
  },
  coordinatesContainer: {
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    width: "100%",
  },
  coordinatesLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  coordinatesText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "monospace",
    marginBottom: 4,
  },
  cityLabel: {
    fontSize: 16,
    fontWeight: "500",
  },

  // Location Summary Styles
  locationSummary: {
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#e0e7ff",
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  summaryDetails: {
    paddingLeft: 28,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "500",
    minWidth: 80,
  },
  summaryValue: {
    fontSize: 14,
    flex: 1,
    fontWeight: "500",
  },
  summaryCoordinates: {
    fontSize: 12,
    fontFamily: "monospace",
    flex: 1,
  },
});

export default LocationSelection;
