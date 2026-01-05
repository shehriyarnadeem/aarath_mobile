import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { TYPOGRAPHY } from "../../constants/Typography";
import * as Location from "expo-location";

/**
 * HomeHeader - Header section with logo, welcome message, and location
 * Professional agricultural marketplace branding
 */
const HomeHeader = () => {
  const { modernColors } = useTheme();
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [guestLocation, setGuestLocation] = useState("Pakistan");

  useEffect(() => {
    // Only fetch location for guest users
    if (!isAuthenticated) {
      getGuestLocation();
    }
  }, [isAuthenticated]);

  const getGuestLocation = async () => {
    try {
      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission denied");
        setGuestLocation("Pakistan");
        return;
      }

      // Get location with timeout
      const location = await Promise.race([
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Location timeout")), 10000)
        ),
      ]);

      if (location?.coords) {
        await reverseGeocode(
          location.coords.latitude,
          location.coords.longitude
        );
      }
    } catch (error) {
      console.log("Location fetch error:", error.message);
      setGuestLocation("Pakistan");
    }
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      console.log("Reverse geocoding:", latitude, longitude);

      const API_KEY = "AIzaSyA6N_Zh_d4PWuUUZ9_5bczUMLntJH8FZHI";
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
      );
      const data = await response.json();

      console.log(
        "Geocode response:",
        JSON.stringify(data.results?.[0]?.address_components, null, 2)
      );

      if (data.results && data.results.length > 0) {
        const result = data.results[0];

        // Extract city and region from address components
        let city = "";
        let region = "";
        let country = "";

        for (const component of result.address_components) {
          if (component.types.includes("locality")) {
            city = component.long_name;
          } else if (
            component.types.includes("administrative_area_level_2") &&
            !city
          ) {
            city = component.long_name;
          } else if (component.types.includes("administrative_area_level_1")) {
            region = component.long_name;
          } else if (component.types.includes("country")) {
            country = component.long_name;
          }
        }

        // Only show location if it's in Pakistan
        if (country === "Pakistan") {
          const locationStr =
            city && region
              ? `${city}, ${region}`
              : city || region || "Pakistan";
          setGuestLocation(locationStr);
        } else {
          // If not in Pakistan, just show Pakistan
          setGuestLocation("Pakistan");
        }
      }
    } catch (error) {
      console.log("Reverse geocode error:", error);
      setGuestLocation("Pakistan");
    }
  };

  // Get user display name
  const getUserName = () => {
    if (isAuthenticated && user) {
      return user.fullName || user.businessName || user.phoneNumber || "User";
    }
    return "Guest User";
  };

  // Get display location
  const getLocationDisplay = () => {
    if (isAuthenticated && user?.businessAddress) {
      return user.businessAddress;
    }
    // For guest users, show their current location
    return guestLocation;
  };

  return (
    <LinearGradient
      colors={[modernColors.primary, "white"]}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.userInfoContainer}>
          <Text style={[styles.userName, { color: modernColors.gray900 }]}>
            {getUserName()}
          </Text>
        </View>
      </View>
      <View style={styles.locationRow}>
        <Ionicons
          name="location-outline"
          size={16}
          color={modernColors.gray900}
          style={styles.locationIcon}
        />
        <Text
          style={[styles.locationText, { color: modernColors.gray900 }]}
          numberOfLines={1}
        >
          {getLocationDisplay()}
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 5,
    paddingVertical: 30,
    paddingBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    marginRight: 16,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    backgroundColor: "transparent",
  },
  userInfoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  welcomeText: {
    opacity: 0.9,
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  userName: {
    fontWeight: "500",
    fontSize: 20,
    marginBottom: 5,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 76,
  },
  locationIcon: {
    marginRight: 4,
    opacity: 0.9,
  },
  locationText: {
    opacity: 0.9,
    fontSize: 13,
    flex: 1,
  },
});

export default HomeHeader;
