import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Modal,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Dropdown } from "react-native-element-dropdown";

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
import { useTheme } from "../../constants/Theme";

// Google Places API configuration
const GOOGLE_API_KEY = "AIzaSyA6N_Zh_d4PWuUUZ9_5bczUMLntJH8FZHI";

// Pakistani cities data
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

const EditProfile = ({ navigation, route }) => {
  const { COLORS } = useTheme();
  const { userData: initialUserData } = route?.params || {};

  // Business roles options
  const businessRoles = [
    { id: 1, label: "Owner", value: "Owner", icon: "business" },
    { id: 2, label: "Manager", value: "Manager", icon: "person-circle" },
    { id: 3, label: "Partner", value: "Partner", icon: "people" },
    {
      id: 4,
      label: "Operations Head",
      value: "Operations Head",
      icon: "settings",
    },
    {
      id: 5,
      label: "Sales Manager",
      value: "Sales Manager",
      icon: "trending-up",
    },
    { id: 6, label: "Farm Supervisor", value: "Farm Supervisor", icon: "leaf" },
    {
      id: 7,
      label: "Quality Controller",
      value: "Quality Controller",
      icon: "checkmark-circle",
    },
    {
      id: 8,
      label: "Marketing Head",
      value: "Marketing Head",
      icon: "megaphone",
    },
  ];

  const [userData, setUserData] = useState({
    name: "John Farmer",
    businessName: "Green Valley Farms",
    email: "farmer@example.com",
    whatsapp: "+92 300 1234567",
    city: "Lahore",
    state: "Punjab",
    businessAddress: "123 Farm Street, Agricultural District",
    businessRole: "Owner",
    location: {
      latitude: 31.5204,
      longitude: 74.3587,
      address: "Lahore, Punjab, Pakistan",
      city: "Lahore",
      state: "Punjab",
      country: "Pakistan",
    },
    personalProfilePic:
      "https://ui-avatars.com/api/?name=John+Farmer&background=6366f1&color=fff&size=200",
    ...initialUserData,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isRoleDropdownVisible, setIsRoleDropdownVisible] = useState(false);
  const [isLocationPickerVisible, setIsLocationPickerVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(
    userData.location || {
      latitude: 31.5204,
      longitude: 74.3587,
      address: "Lahore, Punjab, Pakistan",
    }
  );

  // Location selection states
  const [selectedCity, setSelectedCity] = useState(userData.city || "");
  const [cities, setCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [isCityStep, setIsCityStep] = useState(true);
  const [tempMapRegion, setTempMapRegion] = useState({
    latitude: 31.5204,
    longitude: 74.3587,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert(
        "Profile Updated",
        "Your profile has been updated successfully.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  // Location utility functions
  const getCityCoordinates = (cityName) => {
    const city = PAKISTANI_CITIES.find((c) => c.value === cityName);
    return city?.coordinates || { lat: 31.5204, lng: 74.3587 };
  };

  const reverseGeocodeLocation = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        return {
          address: data.results[0].formatted_address,
          city: extractCityFromGeocoding(data.results[0]),
        };
      }
      return null;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return null;
    }
  };

  const extractCityFromGeocoding = (result) => {
    const cityComponent = result.address_components.find(
      (component) =>
        component.types.includes("locality") ||
        component.types.includes("administrative_area_level_2")
    );
    return cityComponent?.long_name || "";
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Location permission error:", error);
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
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error("Get current location error:", error);
      return null;
    }
  };

  const FormSection = ({ title, children }) => (
    <View style={[styles.section, { backgroundColor: COLORS.white }]}>
      <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>{title}</Text>
      {children}
    </View>
  );

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
    multiline = false,
    disabled = false,
  }) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, { color: COLORS.dark }]}>{label}</Text>
      <TextInput
        style={[
          styles.textInput,
          multiline && styles.multilineInput,
          {
            borderColor: COLORS.lightGray,
            color: COLORS.dark,
            backgroundColor: COLORS.background,
            ...(disabled ? { opacity: 0.6 } : {}),
          },
        ]}
        value={value}
        onChangeText={disabled ? undefined : onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        editable={!disabled}
      />
    </View>
  );

  const LocationField = ({ label, location, onPress }) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, { color: COLORS.dark }]}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.locationButton,
          {
            borderColor: COLORS.lightGray,
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
            <Ionicons name="location" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.locationTextContainer}>
            {location?.address ? (
              <>
                <Text style={[styles.locationText, { color: COLORS.dark }]}>
                  {location.address}
                </Text>
                <Text style={[styles.locationSubtext, { color: COLORS.gray }]}>
                  Tap to change location
                </Text>
              </>
            ) : (
              <Text
                style={[styles.locationPlaceholder, { color: COLORS.gray }]}
              >
                Select your location
              </Text>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
      </TouchableOpacity>
    </View>
  );

  // Business Role Dropdown Component
  const BusinessRoleDropdown = () => (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, { color: COLORS.dark }]}>
        Business Role
      </Text>
      <Dropdown
        style={[
          styles.dropdown,
          { borderColor: COLORS.lightGray, backgroundColor: COLORS.background },
        ]}
        placeholderStyle={[styles.placeholderStyle, { color: COLORS.gray }]}
        selectedTextStyle={[styles.selectedTextStyle, { color: COLORS.dark }]}
        inputSearchStyle={[styles.inputSearchStyle, { color: COLORS.dark }]}
        iconStyle={styles.iconStyle}
        data={businessRoles}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select your business role"
        searchPlaceholder="Search roles..."
        value={userData.businessRole}
        onChange={(item) => {
          handleInputChange("businessRole", item.value);
        }}
        renderLeftIcon={() => (
          <Ionicons
            name="business"
            size={20}
            color={COLORS.primary}
            style={styles.dropdownIcon}
          />
        )}
        renderItem={(item) => (
          <View
            style={[
              styles.dropdownItem,
              {
                backgroundColor:
                  userData.businessRole === item.value
                    ? COLORS.white
                    : COLORS.white,
              },
            ]}
          >
            <View style={styles.itemContent}>
              <View
                style={[
                  styles.itemIconContainer,
                  {
                    backgroundColor:
                      userData.businessRole === item.value
                        ? COLORS.primary
                        : COLORS.primaryLight,
                  },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={
                    userData.businessRole === item.value
                      ? COLORS.gray
                      : COLORS.gray
                  }
                />
              </View>
              <Text
                style={[
                  styles.itemLabel,
                  {
                    color:
                      userData.businessRole === item.value
                        ? COLORS.primary
                        : COLORS.dark,
                  },
                ]}
              >
                {item.label}
              </Text>
            </View>
            {userData.businessRole === item.value && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={COLORS.primary}
              />
            )}
          </View>
        )}
      />
    </View>
  );

  // Two-layer Location Selection Modal
  const LocationPickerModal = () => {
    const handleCitySelect = (city) => {
      setSelectedCity(city.value);
      const coords = getCityCoordinates(city.value);
      setTempMapRegion({
        latitude: coords.lat,
        longitude: coords.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setIsCityStep(false);
    };

    const handleMapLocationSelect = async (coordinate) => {
      try {
        const locationData = await reverseGeocodeLocation(
          coordinate.latitude,
          coordinate.longitude
        );

        const newLocation = {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          address:
            locationData?.address ||
            `${coordinate.latitude}, ${coordinate.longitude}`,
          city: selectedCity,
        };

        setSelectedLocation(newLocation);
        setUserData((prev) => ({
          ...prev,
          location: newLocation,
          city: selectedCity,
        }));

        setIsLocationModalVisible(false);
        setIsCityStep(true);
      } catch (error) {
        Alert.alert(
          "Error",
          "Failed to get location details. Please try again."
        );
      }
    };

    const handleCurrentLocation = async () => {
      const currentLoc = await getCurrentLocation();
      if (currentLoc) {
        await handleMapLocationSelect(currentLoc);
      }
    };

    return (
      <Modal
        visible={isLocationModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setIsLocationModalVisible(false);
          setIsCityStep(true);
        }}
      >
        <SafeAreaView
          style={[styles.locationModal, { backgroundColor: COLORS.background }]}
        >
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
                } else {
                  setIsLocationModalVisible(false);
                  setIsCityStep(true);
                }
              }}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.dark} />
            </TouchableOpacity>

            <Text style={[styles.locationModalTitle, { color: COLORS.dark }]}>
              {isCityStep
                ? "Select City"
                : `Select Location in ${selectedCity}`}
            </Text>

            <TouchableOpacity
              onPress={() => {
                setIsLocationModalVisible(false);
                setIsCityStep(true);
              }}
            >
              <Ionicons name="close" size={24} color={COLORS.dark} />
            </TouchableOpacity>
          </View>

          {isCityStep ? (
            // Step 1: City Selection
            <View style={styles.citySelectionContainer}>
              <Text style={[styles.stepDescription, { color: COLORS.gray }]}>
                First, select your city from the list below:
              </Text>
              <ScrollView style={styles.cityList}>
                {PAKISTANI_CITIES.map((city) => (
                  <TouchableOpacity
                    key={city.value}
                    style={[
                      styles.cityItem,
                      {
                        backgroundColor:
                          selectedCity === city.value
                            ? COLORS.white
                            : COLORS.white,
                        borderColor:
                          selectedCity === city.value
                            ? COLORS.primary
                            : COLORS.lightGray,
                      },
                    ]}
                    onPress={() => handleCitySelect(city)}
                  >
                    <View style={styles.cityItemContent}>
                      <Ionicons
                        name="location"
                        size={20}
                        color={
                          selectedCity === city.value
                            ? COLORS.primary
                            : COLORS.gray
                        }
                      />
                      <Text
                        style={[
                          styles.cityItemText,
                          {
                            color:
                              selectedCity === city.value
                                ? COLORS.primary
                                : COLORS.dark,
                            fontWeight:
                              selectedCity === city.value ? "600" : "400",
                          },
                        ]}
                      >
                        {city.label}
                      </Text>
                    </View>
                    {selectedCity === city.value && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={COLORS.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : (
            // Step 2: Map Location Selection
            <View style={styles.mapContainer}>
              <Text style={[styles.stepDescription, { color: COLORS.gray }]}>
                {HAS_NATIVE_MAP_SUPPORT
                  ? "Now, pin your exact location on the map:"
                  : "Select your location in " + selectedCity + ":"}
              </Text>

              <View style={styles.mapWrapper}>
                {HAS_NATIVE_MAP_SUPPORT ? (
                  // Native Map (only in compiled apps)
                  <MapView
                    style={styles.map}
                    region={tempMapRegion}
                    onRegionChangeComplete={setTempMapRegion}
                  >
                    <Marker
                      coordinate={{
                        latitude: tempMapRegion.latitude,
                        longitude: tempMapRegion.longitude,
                      }}
                      title="Your Location"
                      description="Drag to adjust your location"
                      draggable
                      onDragEnd={(e) => {
                        const newCoord = e.nativeEvent.coordinate;
                        setTempMapRegion({
                          ...tempMapRegion,
                          latitude: newCoord.latitude,
                          longitude: newCoord.longitude,
                        });
                      }}
                    />
                  </MapView>
                ) : (
                  // Fallback Interface (for Expo Go/Web)
                  <View
                    style={[
                      styles.mapFallback,
                      { backgroundColor: COLORS.background },
                    ]}
                  >
                    <View
                      style={[
                        styles.mapPlaceholderContainer,
                        { backgroundColor: COLORS.primaryLight },
                      ]}
                    >
                      <Ionicons
                        name="map-outline"
                        size={60}
                        color={COLORS.primary}
                      />
                      <Text
                        style={[
                          styles.mapFallbackTitle,
                          { color: COLORS.primary },
                        ]}
                      >
                        Interactive Map
                      </Text>
                      <Text
                        style={[
                          styles.mapFallbackSubtitle,
                          { color: COLORS.textSecondary },
                        ]}
                      >
                        {Platform.OS === "web"
                          ? "Map view available in mobile app"
                          : "Map integration ready for native build"}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.coordinatesContainer,
                        { backgroundColor: COLORS.white },
                      ]}
                    >
                      <Text
                        style={[
                          styles.coordinatesLabel,
                          { color: COLORS.textSecondary },
                        ]}
                      >
                        Selected Coordinates:
                      </Text>
                      <Text
                        style={[
                          styles.coordinatesText,
                          { color: COLORS.textPrimary },
                        ]}
                      >
                        {tempMapRegion.latitude.toFixed(6)},{" "}
                        {tempMapRegion.longitude.toFixed(6)}
                      </Text>
                      <Text
                        style={[
                          styles.cityLabel,
                          { color: COLORS.textSecondary },
                        ]}
                      >
                        {selectedCity}, Pakistan
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.locationActions}>
                <TouchableOpacity
                  style={[
                    styles.currentLocationBtn,
                    { backgroundColor: COLORS.background },
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
                    { backgroundColor: COLORS.primary },
                  ]}
                  onPress={() =>
                    handleMapLocationSelect({
                      latitude: tempMapRegion.latitude,
                      longitude: tempMapRegion.longitude,
                    })
                  }
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
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.background }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.white }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: COLORS.dark }]}>
          Edit Profile
        </Text>
        <TouchableOpacity
          style={[
            styles.saveButton,
            {
              backgroundColor: isLoading ? COLORS.gray : COLORS.primary,
            },
          ]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={[styles.saveButtonText, { color: COLORS.white }]}>
            {isLoading ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        style={styles.scrollView}
        bounces={false}
      >
        {/* Profile Picture Section */}
        <View
          style={[
            styles.profilePictureSection,
            { backgroundColor: COLORS.white },
          ]}
        >
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: userData.personalProfilePic }}
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={[
                styles.editImageButton,
                { backgroundColor: COLORS.primary },
              ]}
              onPress={() =>
                Alert.alert(
                  "Change Photo",
                  "Photo upload feature will be implemented"
                )
              }
            >
              <Ionicons name="camera" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.changePhotoText, { color: COLORS.primary }]}>
            Change Photo
          </Text>
        </View>

        {/* Business Information */}
        <FormSection title="Business Information">
          <InputField
            label="Business Name"
            value={userData.businessName}
            onChangeText={(value) => handleInputChange("businessName", value)}
            placeholder="Enter your business name"
          />

          <BusinessRoleDropdown />

          <InputField
            label="Phone Number"
            value={userData.whatsapp}
            onChangeText={(value) => handleInputChange("whatsapp", value)}
            placeholder="Enter your WhatsApp number"
            keyboardType="phone-pad"
            disabled
          />
        </FormSection>

        {/* Location Information */}
        <FormSection title="Location">
          <LocationField
            label="Business Location"
            location={userData.location}
            onPress={() => setIsLocationModalVisible(true)}
          />
        </FormSection>

        {/* Footer spacing for proper scrolling */}
        <View style={styles.footerSpacer} />
      </ScrollView>

      {/* Location Picker Modal */}
      <LocationPickerModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },

  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
    flexGrow: 1,
  },

  // Profile Picture Section
  profilePictureSection: {
    alignItems: "center",
    padding: 30,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  changePhotoText: {
    fontSize: 16,
    fontWeight: "600",
  },

  // Form Section
  section: {
    borderRadius: 16,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    padding: 20,
    paddingBottom: 12,
    letterSpacing: 0.3,
  },

  // Input Fields
  inputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  textInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: "500",
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },

  // Action Items
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#f0f0f0",
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
  },

  // Dropdown Styles
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 52,
  },
  dropdownContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dropdownIcon: {
    marginRight: 12,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dropdownPlaceholder: {
    fontSize: 16,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  dropdownModal: {
    width: "100%",
    maxWidth: 350,
    borderRadius: 20,
    overflow: "hidden",
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    padding: 4,
  },
  dropdownOptions: {
    maxHeight: 400,
  },
  dropdownOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
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
    marginBottom: 2,
  },
  locationSubtext: {
    fontSize: 12,
  },
  locationPlaceholder: {
    fontSize: 16,
  },

  // Location Modal Styles
  locationModalContainer: {
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
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    borderRadius: 16,
    padding: 40,
  },
  mapIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  mapPlaceholderTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  mapPlaceholderSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  currentLocationContainer: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currentLocationContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentLocationText: {
    marginLeft: 12,
    flex: 1,
  },
  currentLocationTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  currentLocationAddress: {
    fontSize: 14,
  },
  locationActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  locationActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  locationActionText: {
    fontSize: 16,
    fontWeight: "600",
  },

  // New Dropdown Styles
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    fontWeight: "500",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  dropdownIcon: {
    marginRight: 12,
  },
  dropdownItem: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: "500",
  },

  // New Location Modal Styles
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

  // Footer spacing
  footerSpacer: {
    height: 120,
    marginBottom: 40,
  },
});

export default EditProfile;
