import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useTheme } from "../../../constants/Theme";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

// Pakistani cities with coordinates
const CITIES = [
  { label: "Karachi", value: "Karachi", lat: 24.8607, lng: 67.0011 },
  { label: "Lahore", value: "Lahore", lat: 31.5204, lng: 74.3587 },
  { label: "Islamabad", value: "Islamabad", lat: 33.6844, lng: 73.0479 },
  { label: "Rawalpindi", value: "Rawalpindi", lat: 33.5651, lng: 73.0169 },
  { label: "Faisalabad", value: "Faisalabad", lat: 31.4504, lng: 73.135 },
  { label: "Multan", value: "Multan", lat: 30.1575, lng: 71.5249 },
  { label: "Peshawar", value: "Peshawar", lat: 34.0151, lng: 71.5249 },
  { label: "Quetta", value: "Quetta", lat: 30.1798, lng: 66.975 },
  { label: "Sialkot", value: "Sialkot", lat: 32.4945, lng: 74.5229 },
  { label: "Gujranwala", value: "Gujranwala", lat: 32.1877, lng: 74.1945 },
  { label: "Hyderabad", value: "Hyderabad", lat: 25.396, lng: 68.3578 },
  { label: "Bahawalpur", value: "Bahawalpur", lat: 29.4, lng: 71.6833 },
];

const LocationSelection = ({
  selectedCity,
  selectedLocation,
  onLocationSelect,
}) => {
  const { COLORS } = useTheme();
  const { t } = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1); // 1: City, 2: Map
  const [city, setCity] = useState(null);
  const [marker, setMarker] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    setMarker(null);
    setStep(2);
  };

  const handleMapPress = (e) => {
    setMarker({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    });
  };

  const handleConfirm = () => {
    if (city && marker) {
      onLocationSelect("Pakistan", city.value, {
        city: city.value,
        cityLabel: city.label,
        ...marker,
      });
      setModalVisible(false);
      setStep(1);
    }
  };

  const handleClose = () => {
    setModalVisible(false);
    setStep(1);
    setMapReady(false);
  };

  return (
    <>
      {/* Location Button */}
      <TouchableOpacity
        style={[
          styles.locationBtn,
          { borderColor: COLORS.border, backgroundColor: COLORS.white },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.locationBtnContent}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: COLORS.primaryLight },
            ]}
          >
            <Ionicons name="location" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.locationInfo}>
            {selectedLocation && city ? (
              <>
                <Text
                  style={[styles.locationTitle, { color: COLORS.textPrimary }]}
                >
                  {city.label || selectedCity}
                </Text>
                <Text
                  style={[
                    styles.locationSubtitle,
                    { color: COLORS.textSecondary },
                  ]}
                  numberOfLines={1}
                >
                  {marker?.latitude.toFixed(4)}, {marker?.longitude.toFixed(4)}
                </Text>
              </>
            ) : (
              <Text
                style={[
                  styles.locationPlaceholder,
                  { color: COLORS.textSecondary },
                ]}
              >
                {t("onboarding.chooseLocation")}
              </Text>
            )}
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={COLORS.textSecondary}
        />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <SafeAreaView
          style={[styles.modal, { backgroundColor: COLORS.background }]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: COLORS.border }]}>
            <TouchableOpacity
              onPress={step === 2 ? () => setStep(1) : handleClose}
              style={styles.headerBtn}
            >
              <Ionicons
                name={step === 2 ? "arrow-back" : "close"}
                size={24}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: COLORS.textPrimary }]}>
              {step === 1 ? "Select City" : "Select Location"}
            </Text>
            <View style={styles.headerBtn} />
          </View>

          {step === 1 ? (
            /* City List */
            <ScrollView
              style={styles.cityList}
              showsVerticalScrollIndicator={false}
            >
              {CITIES.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.cityCard,
                    {
                      backgroundColor: COLORS.white,
                      borderColor:
                        city?.value === item.value
                          ? COLORS.primary
                          : COLORS.border,
                    },
                  ]}
                  onPress={() => handleCitySelect(item)}
                >
                  <View style={styles.cityCardContent}>
                    <View
                      style={[
                        styles.cityIcon,
                        {
                          backgroundColor:
                            city?.value === item.value
                              ? COLORS.primaryLight
                              : COLORS.lightGray,
                        },
                      ]}
                    >
                      <Ionicons
                        name="location"
                        size={18}
                        color={
                          city?.value === item.value
                            ? COLORS.primary
                            : COLORS.textSecondary
                        }
                      />
                    </View>
                    <Text
                      style={[styles.cityName, { color: COLORS.textPrimary }]}
                    >
                      {item.label}
                    </Text>
                  </View>
                  {city?.value === item.value && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={COLORS.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            /* Map View */
            <View style={styles.mapContainer}>
              <View style={styles.mapHint}>
                <Text
                  style={[styles.hintText, { color: COLORS.textSecondary }]}
                >
                  Tap anywhere on the map to select your location
                </Text>
              </View>

              {!mapReady && (
                <View style={styles.mapLoading}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text
                    style={[
                      styles.loadingText,
                      { color: COLORS.textSecondary },
                    ]}
                  >
                    Loading map...
                  </Text>
                </View>
              )}

              <View style={styles.mapWrapper}>
                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  initialRegion={{
                    latitude: city?.lat || 31.5204,
                    longitude: city?.lng || 74.3587,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                  }}
                  onPress={handleMapPress}
                  onMapReady={() => setMapReady(true)}
                  loadingEnabled
                  loadingIndicatorColor={COLORS.primary}
                >
                  {marker && (
                    <Marker coordinate={marker} pinColor={COLORS.primary} />
                  )}
                </MapView>
              </View>

              {/* Confirm Button */}
              <TouchableOpacity
                style={[
                  styles.confirmBtn,
                  {
                    backgroundColor: marker ? COLORS.primary : COLORS.gray,
                    opacity: marker ? 1 : 0.5,
                  },
                ]}
                onPress={handleConfirm}
                disabled={!marker}
              >
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.confirmText}>Confirm Location</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // Location Button
  locationBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 20,
  },
  locationBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  locationSubtitle: {
    fontSize: 13,
  },
  locationPlaceholder: {
    fontSize: 15,
  },

  // Modal
  modal: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  // City List
  cityList: {
    flex: 1,
    padding: 16,
  },
  cityCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  cityCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cityName: {
    fontSize: 16,
    fontWeight: "500",
  },

  // Map
  mapContainer: {
    flex: 1,
    padding: 16,
  },
  mapHint: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginBottom: 16,
  },
  hintText: {
    fontSize: 14,
    textAlign: "center",
  },
  mapWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  mapLoading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 10,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default LocationSelection;
