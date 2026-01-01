import React, { useState, useEffect, use, useCallback, useMemo } from "react";
import * as ImagePicker from "expo-image-picker";
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

// Import react-native-maps directly
import MapView, { Marker } from "react-native-maps";
const HAS_NATIVE_MAP_SUPPORT = true;
import { useTheme } from "../../constants/Theme";
import { useAuth } from "../../context/AuthContext";
import { set } from "firebase/database";
import Toast from "react-native-toast-message";
import apiClient from "../../utils/apiClient";
import LocationSelection from "../onboarding/components/LocationSelection";

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

// Memoized sub-components to prevent unnecessary re-renders
const FormSection = React.memo(({ title, children, COLORS }) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, { color: COLORS.textSecondary }]}>
      {title}
    </Text>
    {children}
  </View>
));

const InputField = React.memo(
  ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
    multiline = false,
    disabled = false,
    COLORS,
  }) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, { color: COLORS.textPrimary }]}>
        {label}
      </Text>
      <TextInput
        style={[
          styles.textInput,
          multiline && styles.multilineInput,
          {
            color: COLORS.textPrimary,
            ...(disabled ? { opacity: 0.5 } : {}),
          },
        ]}
        value={value}
        onChangeText={disabled ? undefined : onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray400}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        editable={!disabled}
      />
    </View>
  )
);

const EditProfile = ({ navigation, route }) => {
  const { COLORS, SIZES } = useTheme();
  const { refreshUserProfile } = useAuth();
  const userInfo = route?.params || {};

  console.log("📝 EditProfile - userInfo from route params:", userInfo);
  // Business roles options
  const businessRoles = [
    { id: 1, label: "FARMER", value: "FARMER", icon: "business" },
    { id: 2, label: "BROKER", value: "BROKER", icon: "person-circle" },
    { id: 3, label: "BUYER", value: "BUYER", icon: "people" },
    {
      id: 4,
      label: "EXPORTER",
      value: "EXPORTER",
      icon: "settings",
    },
  ];

  const [userData, setUserData] = useState({ ...userInfo } || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isRoleDropdownVisible, setIsRoleDropdownVisible] = useState(false);
  const [isLocationPickerVisible, setIsLocationPickerVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(
    userInfo.location || {}
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

  // Handler for location selection from LocationSelection component
  const handleLocationSelect = useCallback((state, city, locationData) => {
    console.log("📍 Location selected:", { state, city, locationData });

    const newLocation = {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      businessAddress: locationData.address || `${city}, ${state}`,
      city: city,
      state: state,
      address: locationData.address || `${city}, ${state}`,
    };

    setSelectedLocation(newLocation);
    setSelectedCity(city);
    setUserData((prev) => ({
      ...prev,
      location: newLocation,
      city: city,
      state: state,
    }));
  }, []);

  useEffect(() => {
    setUserData((prevData) => ({
      ...prevData,
      name: userInfo?.businessName || "N/A",
      businessName: userInfo?.businessName || "N/A",
      email: userInfo?.email || "N/A",
      whatsapp: userInfo?.whatsapp || "N/A",
      city: userInfo?.city || "N/A",
      state: userInfo?.state || "N/A",
      businessAddress: userInfo?.businessAddress || "N/A",
      businessRole: userInfo?.role || "N/A",
      personalProfilePic:
        userInfo?.personalProfilePic ||
        "https://ui-avatars.com/api/?name=John+Farmer&background=6366f1&color=fff&size=200",
    }));

    // Set initial location from userInfo
    if (userInfo?.location || (userInfo?.latitude && userInfo?.longitude)) {
      const initialLocation = {
        latitude: userInfo?.latitude || userInfo?.location?.latitude,
        longitude: userInfo?.longitude || userInfo?.location?.longitude,
        city: userInfo?.city,
        state: userInfo?.state || "Pakistan",
        businessAddress:
          userInfo?.businessAddress || userInfo?.location?.businessAddress,
        address: userInfo?.businessAddress || userInfo?.location?.address,
      };
      setSelectedLocation(initialLocation);
      setSelectedCity(userInfo?.city || "");
    }
  }, []);

  console.log("📝 EditProfile - userData state:", selectedLocation);

  const handleChangePhoto = useCallback(async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow photo library access to change your profile picture."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const dataUrl = asset.base64
          ? `data:${asset.type || "image/jpeg"};base64,${asset.base64}`
          : null;

        setUserData((prev) => ({
          ...prev,
          personalProfilePic: asset.uri,
          personalProfilePicBase64: dataUrl,
        }));
      }
    } catch (err) {
      console.error("Image picking error:", err);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  }, []);

  const handleSave = useCallback(async () => {
    // Validate required fields
    if (!userData.businessName || userData.businessName === "N/A") {
      Alert.alert("Validation Error", "Business name is required.");
      return;
    }

    if (!userData.businessRole || userData.businessRole === "N/A") {
      Alert.alert("Validation Error", "Business role is required.");
      return;
    }

    if (!userData.city || userData.city === "N/A") {
      Alert.alert("Validation Error", "City is required.");
      return;
    }

    if (!userData.state || userData.state === "N/A") {
      Alert.alert("Validation Error", "State is required.");
      return;
    }

    setIsLoading(true);
    try {
      // Prepare update payload
      const updatePayload = {
        businessName: userData.businessName,
        email: userData.email !== "N/A" ? userData.email : null,
        whatsapp: userData.whatsapp !== "N/A" ? userData.whatsapp : null,
        city: selectedLocation.city,
        state: selectedLocation.state,
        longitude: selectedLocation.longitude,
        latitude: selectedLocation.latitude,
        businessAddress:
          selectedLocation.businessAddress !== null
            ? selectedLocation.businessAddress
            : null,
        role: userData.businessRole,
        businessCategories: userData.businessCategories || [],
        personalLocation: selectedLocation || null,
        // Send base64 if user selected a new image
        personalProfilePicBase64: userData.personalProfilePicBase64 || null,
      };

      console.log("📤 Sending profile update:", updatePayload);

      // Call backend API to update user profile
      const response = await apiClient.user.updateProfile(
        userInfo?.id || userInfo?.uid,
        updatePayload
      );

      if (response.success) {
        // Refresh cached user profile so UI reflects latest data
        await refreshUserProfile();

        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Profile updated successfully!",
        });

        // Navigate back after successful update
        navigation.navigate("EditProfile");
      } else {
        Alert.alert(
          "Update Failed",
          response.error?.message ||
            "Failed to update profile. Please try again."
        );
      }
    } catch (error) {
      console.error("❌ Profile update error:", error);
      Alert.alert(
        "Error",
        error?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    userData,
    selectedLocation,
    userInfo?.id,
    userInfo?.uid,
    navigation,
    refreshUserProfile,
  ]);

  const handleInputChange = useCallback((field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  }, []);

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
      console.log("--data", data);
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

  // Business Role Dropdown Component
  const BusinessRoleDropdown = () => (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, { color: COLORS.dark }]}>Role</Text>
      <Dropdown
        style={[styles.dropdown]}
        placeholderStyle={[styles.placeholderStyle, { color: COLORS.gray400 }]}
        selectedTextStyle={[
          styles.selectedTextStyle,
          { color: COLORS.textPrimary },
        ]}
        inputSearchStyle={[
          styles.inputSearchStyle,
          { color: COLORS.textPrimary },
        ]}
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
            size={18}
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
        console.log(locationData, "--sss");
        const newLocation = {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          businessAddress: locationData?.address || `${selectedCity}, Pakistan`,
          city: selectedCity,
          state: "", // Could be enhanced to extract state as well
          address: locationData?.address || `${selectedCity}, Pakistan`,
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
        <Text style={[styles.headerTitle, { color: COLORS.textPrimary }]}>
          Edit Profile
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Ionicons
            name={isLoading ? "hourglass" : "checkmark"}
            size={24}
            color={isLoading ? COLORS.gray400 : COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        style={styles.scrollView}
        bounces={false}
      >
        {/* Profile Picture Section */}
        <View style={styles.profilePictureSection}>
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
              onPress={handleChangePhoto}
            >
              <Ionicons name="camera" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text
            style={[styles.changePhotoText, { color: COLORS.textSecondary }]}
          >
            Change Photo
          </Text>
        </View>

        {/* Business Information */}
        <FormSection title="Business Information" COLORS={COLORS}>
          <InputField
            COLORS={COLORS}
            label="Name"
            value={userData?.businessName}
            onChangeText={(value) => handleInputChange("businessName", value)}
            placeholder="Enter your business name"
          />
          <InputField
            COLORS={COLORS}
            label="Phone Number"
            value={userData.whatsapp}
            onChangeText={(value) => handleInputChange("whatsapp", value)}
            placeholder="Enter your WhatsApp number"
            keyboardType="phone-pad"
            disabled
          />

          <InputField
            COLORS={COLORS}
            label="Email"
            value={userData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            placeholder="Enter your email"
            keyboardType="email-address"
            disabled
          />
          <BusinessRoleDropdown />
        </FormSection>

        {/* Location Information */}
        <FormSection title="Location" COLORS={COLORS}>
          <LocationSelection
            selectedCity={selectedCity}
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationSelect}
          />
        </FormSection>

        {/* Footer spacing for proper scrolling */}
        <View style={styles.footerSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 80,
    borderBottomWidth: 0,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 12,
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },

  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 100,
    flexGrow: 1,
  },

  // Profile Picture Section
  profilePictureSection: {
    alignItems: "center",
    paddingVertical: 32,
    marginBottom: 24,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: "#f5f5f5",
  },
  editImageButton: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.7,
  },

  // Form Section
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 4,
    paddingBottom: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    opacity: 0.5,
  },

  // Input Fields
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    paddingHorizontal: 4,
    opacity: 0.8,
  },
  textInput: {
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: "400",
    backgroundColor: "#f8f8f8",
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },

  // Action Items
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  dropdownModal: {
    width: "100%",
    maxWidth: 350,
    borderRadius: 16,
    overflow: "hidden",
    maxHeight: "70%",
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
    marginRight: 12,
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
    paddingVertical: 16,
    borderWidth: 0,
    borderRadius: 12,
    minHeight: 64,
    backgroundColor: "#f8f8f8",
  },
  locationContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
    height: 52,
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f8f8f8",
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
    padding: 16,
  },
  stepDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
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
    borderWidth: 1.5,
    marginBottom: 10,
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
    padding: 16,
  },
  mapWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 16,
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
    borderWidth: 1,
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
  },
  confirmLocationText: {
    fontSize: 16,
    fontWeight: "700",
  },

  // Fallback Map Styles
  mapFallback: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
  },
  mapPlaceholderContainer: {
    alignItems: "center",
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
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
    height: 96,
    marginBottom: 32,
  },
});

export default EditProfile;
