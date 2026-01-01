import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../constants/Theme";

const MapTestScreen = ({ navigation }) => {
  const { COLORS } = useTheme();
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleMapReady = () => {
    console.log("✅ Map loaded successfully!");
    setMapReady(true);
    setMapError(false);
  };

  const handleMapError = (error) => {
    console.error("❌ Map error:", error);
    setMapError(true);
    setMapReady(false);
    setErrorMessage(error?.message || "Unknown error");
  };

  const handleRetry = () => {
    console.log("🔄 Retrying map load...");
    setMapError(false);
    setMapReady(false);
    setErrorMessage("");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Google Maps Test</Text>
      </View>

      {/* Debug Info */}
      <View style={[styles.debugPanel, { backgroundColor: COLORS.lightGray }]}>
        <Text style={[styles.debugTitle, { color: COLORS.textPrimary }]}>
          Debug Info
        </Text>
        <View style={styles.debugRow}>
          <Text style={[styles.debugLabel, { color: COLORS.textSecondary }]}>
            Platform:
          </Text>
          <Text style={[styles.debugValue, { color: COLORS.textPrimary }]}>
            {Platform.OS} {Platform.Version}
          </Text>
        </View>
        <View style={styles.debugRow}>
          <Text style={[styles.debugLabel, { color: COLORS.textSecondary }]}>
            Map Ready:
          </Text>
          <Text
            style={[
              styles.debugValue,
              { color: mapReady ? COLORS.success : COLORS.error },
            ]}
          >
            {mapReady ? "✅ Yes" : "❌ No"}
          </Text>
        </View>
        <View style={styles.debugRow}>
          <Text style={[styles.debugLabel, { color: COLORS.textSecondary }]}>
            Error:
          </Text>
          <Text
            style={[
              styles.debugValue,
              { color: mapError ? COLORS.error : COLORS.success },
            ]}
          >
            {mapError ? `❌ ${errorMessage}` : "✅ None"}
          </Text>
        </View>
        <View style={styles.debugRow}>
          <Text style={[styles.debugLabel, { color: COLORS.textSecondary }]}>
            Provider:
          </Text>
          <Text style={[styles.debugValue, { color: COLORS.textPrimary }]}>
            Google Maps
          </Text>
        </View>
      </View>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        {mapError ? (
          <View
            style={[
              styles.errorContainer,
              { backgroundColor: COLORS.lightGray },
            ]}
          >
            <View
              style={[
                styles.errorIconContainer,
                { backgroundColor: COLORS.errorLight },
              ]}
            >
              <Ionicons name="alert-circle" size={60} color={COLORS.error} />
            </View>
            <Text style={[styles.errorTitle, { color: COLORS.textPrimary }]}>
              Map Failed to Load
            </Text>
            <Text
              style={[styles.errorMessage, { color: COLORS.textSecondary }]}
            >
              {errorMessage || "Unable to load Google Maps"}
            </Text>
            <Text style={[styles.errorHint, { color: COLORS.textSecondary }]}>
              Possible causes:
            </Text>
            <View style={styles.errorList}>
              <Text style={[styles.errorItem, { color: COLORS.textSecondary }]}>
                • API key not configured correctly
              </Text>
              <Text style={[styles.errorItem, { color: COLORS.textSecondary }]}>
                • Google Play Services not available
              </Text>
              <Text style={[styles.errorItem, { color: COLORS.textSecondary }]}>
                • Network connection issues
              </Text>
              <Text style={[styles.errorItem, { color: COLORS.textSecondary }]}>
                • Billing not enabled on Google Cloud
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: COLORS.primary }]}
              onPress={handleRetry}
            >
              <Ionicons name="refresh" size={20} color="white" />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {!mapReady && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text
                  style={[styles.loadingText, { color: COLORS.textPrimary }]}
                >
                  Loading Google Maps...
                </Text>
              </View>
            )}
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude: 24.8607,
                longitude: 67.0011,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              onMapReady={handleMapReady}
              onError={handleMapError}
              loadingEnabled={true}
              loadingIndicatorColor={COLORS.primary}
              showsUserLocation={false}
              showsMyLocationButton={false}
            >
              <Marker
                coordinate={{
                  latitude: 24.8607,
                  longitude: 67.0011,
                }}
                title="Karachi"
                description="Test Marker"
                pinColor={COLORS.primary}
              />
            </MapView>
          </>
        )}
      </View>

      {/* Instructions */}
      <View
        style={[styles.instructions, { backgroundColor: COLORS.lightGray }]}
      >
        <Text style={[styles.instructionsTitle, { color: COLORS.textPrimary }]}>
          What to check:
        </Text>
        <Text style={[styles.instructionText, { color: COLORS.textSecondary }]}>
          1. Map should load and show Karachi marker
        </Text>
        <Text style={[styles.instructionText, { color: COLORS.textSecondary }]}>
          2. Check console logs for errors
        </Text>
        <Text style={[styles.instructionText, { color: COLORS.textSecondary }]}>
          3. Verify "Map Ready" shows ✅ Yes
        </Text>
        <Text style={[styles.instructionText, { color: COLORS.textSecondary }]}>
          4. If error occurs, check error message above
        </Text>
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  debugPanel: {
    padding: 16,
    margin: 12,
    borderRadius: 12,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  debugRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  debugLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  debugValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  mapContainer: {
    flex: 1,
    margin: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  errorHint: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
  },
  errorList: {
    alignSelf: "stretch",
    marginBottom: 24,
  },
  errorItem: {
    fontSize: 13,
    paddingVertical: 4,
    paddingLeft: 8,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  instructions: {
    padding: 16,
    margin: 12,
    borderRadius: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    paddingVertical: 4,
  },
});

export default MapTestScreen;
