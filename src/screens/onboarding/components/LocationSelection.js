import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Dimensions,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../constants/Theme";
import { useTranslation } from "react-i18next";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import LocationDetailsBox from "./LocationDetailsBox";

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
  selectedCity,
  selectedLocation,
  onLocationSelect,
}) => {
  const { COLORS } = useTheme();
  const { t } = useTranslation();

  // Modal and step states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [step, setStep] = useState(1); // 1: City Selection, 2: Location Selection

  // Selected data states
  const [selectedCityData, setSelectedCityData] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Map states
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);
  const [mapRegion, setMapRegion] = useState(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Handle city selection
  const handleCitySelect = (city) => {
    setSelectedCityData(city);
    setSelectedMarker(null); // Reset marker when city changes
    setStep(2); // Move to map step
  };

  // Reverse geocode to get address from coordinates
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const API_KEY = "AIzaSyA6N_Zh_d4PWuUUZ9_5bczUMLntJH8FZHI";
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return result.formatted_address;
      }
      return null;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return null;
    }
  };

  // Handle map marker placement
  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    // Get address from coordinates
    const address = await reverseGeocode(latitude, longitude);

    setSelectedMarker({
      latitude,
      longitude,
      city: selectedCityData.value,
      cityLabel: selectedCityData.label,
      address: address || "Location selected",
    });
  };

  // Confirm location selection
  const handleConfirm = () => {
    if (selectedMarker && selectedCityData) {
      onLocationSelect(
        "Pakistan", // state
        selectedCityData.value, // city
        selectedMarker // location object
      );
      handleClose();
    }
  };

  // Close modal and reset
  const handleClose = () => {
    setIsModalVisible(false);
    setStep(1);
    setMapReady(false);
  };

  // Go back to city selection
  const handleBack = () => {
    setStep(1);
    setMapReady(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Search places using Google Places API
  const searchPlaces = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const API_KEY = "AIzaSyA6N_Zh_d4PWuUUZ9_5bczUMLntJH8FZHI";
      const cityBias = selectedCityData?.label || "";
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query + " " + cityBias
        )}&key=${API_KEY}&components=country:pk`
      );
      const data = await response.json();
      console.log("Search results data:", data);
      if (data.predictions) {
        setSearchResults(data.predictions);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Get place details and navigate map to location
  const selectSearchResult = async (placeId, description) => {
    try {
      const API_KEY = "AIzaSyA6N_Zh_d4PWuUUZ9_5bczUMLntJH8FZHI";
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.result && data.result.geometry) {
        const { lat, lng } = data.result.geometry.location;

        // Animate map to the searched location
        const newRegion = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }

        setMapRegion(newRegion);
        setSearchQuery("");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Place details error:", error);
    }
  };

  console.log("LocationSelection rendering...");

  return (
    <View style={styles.container}>
      <Text style={[styles.subtitle, { color: COLORS.gray600 }]}>
        {t("onboarding.selectLocationSubtitle")}
      </Text>

      {/* Location Button */}
      <TouchableOpacity
        style={[
          styles.locationButton,
          {
            borderColor: selectedLocation?.latitude
              ? COLORS.primary
              : COLORS.lightGray,
            backgroundColor: COLORS.background,
          },
        ]}
        onPress={() => setIsModalVisible(true)}
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
              size={24}
              color={COLORS.primary}
            />
          </View>
          <View style={styles.locationTextContainer}>
            {selectedLocation?.latitude ? (
              <>
                <Text style={[styles.locationText, { color: COLORS.dark }]}>
                  📍 {selectedLocation.city}
                </Text>
                <Text
                  style={[styles.locationSubtext, { color: COLORS.gray }]}
                  numberOfLines={2}
                >
                  {selectedLocation.address || "Location selected"}
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

      {/* Location Selection Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <SafeAreaView
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
                if (step === 2) {
                  handleBack();
                } else {
                  handleClose();
                }
              }}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
            </TouchableOpacity>
            <Text style={[styles.locationModalTitle, { color: COLORS.dark }]}>
              {step === 1 ? "Select City" : "Select Location"}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color={COLORS.dark} />
            </TouchableOpacity>
          </View>

          {step === 1 ? (
            /* City Selection Step */
            <View style={styles.citySelectionContainer}>
              <Text style={[styles.stepDescription, { color: COLORS.gray }]}>
                Choose your city to help us provide better local services
              </Text>

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
                        size={24}
                        color={COLORS.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
                Search or tap on the map to select your exact location
              </Text>

              {/* Search Bar */}
              <View
                style={[
                  styles.searchContainer,
                  { backgroundColor: COLORS.white },
                ]}
              >
                <View
                  style={[
                    styles.searchInputWrapper,
                    {
                      backgroundColor: COLORS.background,
                      borderColor: COLORS.lightGray,
                    },
                  ]}
                >
                  <Ionicons name="search" size={20} color={COLORS.gray} />
                  <TextInput
                    style={[styles.searchInput, { color: COLORS.dark }]}
                    placeholder="Search for a location..."
                    placeholderTextColor={COLORS.gray}
                    value={searchQuery}
                    onChangeText={(text) => {
                      setSearchQuery(text);
                      searchPlaces(text);
                    }}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                    >
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={COLORS.gray}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <ScrollView
                    style={[
                      styles.searchResults,
                      { backgroundColor: COLORS.white },
                    ]}
                    keyboardShouldPersistTaps="handled"
                  >
                    {searchResults.map((result) => (
                      <TouchableOpacity
                        key={result.place_id}
                        style={[
                          styles.searchResultItem,
                          { borderBottomColor: COLORS.lightGray },
                        ]}
                        onPress={() =>
                          selectSearchResult(
                            result.place_id,
                            result.description
                          )
                        }
                      >
                        <Ionicons
                          name="location"
                          size={16}
                          color={COLORS.primary}
                        />
                        <Text
                          style={[
                            styles.searchResultText,
                            { color: COLORS.dark },
                          ]}
                          numberOfLines={2}
                        >
                          {result.description}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>

              <View style={styles.mapWrapper}>
                {!mapReady && (
                  <View style={styles.mapLoadingOverlay}>
                    <Text
                      style={[styles.mapLoadingText, { color: COLORS.gray }]}
                    >
                      Loading map...
                    </Text>
                  </View>
                )}
                <MapView
                  ref={mapRef}
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  initialRegion={{
                    latitude: selectedCityData?.coordinates.lat || 24.8607,
                    longitude: selectedCityData?.coordinates.lng || 67.0011,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                  region={mapRegion}
                  onPress={handleMapPress}
                  onMapReady={() => {
                    console.log("✅ Map is ready!");
                    setMapReady(true);
                  }}
                  onMapLoaded={() => {
                    console.log("✅ Map tiles loaded!");
                  }}
                  onError={(error) => {
                    console.error("❌ Map error:", error);
                  }}
                  showsUserLocation={false}
                  showsMyLocationButton={false}
                  loadingEnabled={true}
                  loadingIndicatorColor={COLORS.primary}
                  mapType="standard"
                >
                  {selectedMarker && (
                    <Marker
                      coordinate={{
                        latitude: selectedMarker.latitude,
                        longitude: selectedMarker.longitude,
                      }}
                      title="Selected Location"
                      description={selectedMarker.cityLabel}
                    />
                  )}
                </MapView>
              </View>

              {/* Selected Location Details Box */}
              <LocationDetailsBox selectedMarker={selectedMarker} />

              {/* Confirm Button */}
              <View style={styles.confirmButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    {
                      backgroundColor: selectedMarker
                        ? COLORS.primary
                        : COLORS.gray,
                      opacity: selectedMarker ? 1 : 0.5,
                    },
                  ]}
                  onPress={handleConfirm}
                  disabled={!selectedMarker}
                >
                  <Ionicons name="checkmark" size={24} color={COLORS.white} />
                  <Text
                    style={[styles.confirmButtonText, { color: COLORS.white }]}
                  >
                    Confirm Location
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 70,
  },
  locationContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  locationSubtext: {
    fontSize: 12,
  },
  locationPlaceholder: {
    fontSize: 16,
  },
  locationModal: {
    flex: 1,
  },
  locationModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  locationModalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  citySelectionContainer: {
    flex: 1,
    padding: 20,
  },
  stepDescription: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  cityList: {
    flex: 1,
  },
  cityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  cityItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cityItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
  mapContainer: {
    flex: 1,
  },
  mapWrapper: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapLoadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    zIndex: 1,
  },
  mapLoadingText: {
    fontSize: 16,
  },
  confirmButtonContainer: {
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    padding: 0,
  },
  searchResults: {
    maxHeight: 200,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
  },
  searchResultText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
});

export default LocationSelection;
