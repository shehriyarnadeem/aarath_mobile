import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Image,
} from "react-native";
import { useTheme } from "../constants/Theme";
import { useAuth } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

const SplashScreen = ({ navigation }) => {
  const { COLORS } = useTheme();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Simple timer for navigation
    const timer = setTimeout(() => {
      // Navigate after 2 seconds
      if (navigation) {
        navigation.replace('Login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{...styles.container, backgroundColor: COLORS.primary50}}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary600}
        translucent={false}
      />
      
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <View style={styles.logoWrapper}>
          <Text style={styles.logoText}>A</Text>
        </View>
      </View>

      {/* Brand Text */}
      <View style={styles.textSection}>
        <Text style={{...styles.brandName, color: COLORS.text}}>
          Aarath
        </Text>
        <Text style={{...styles.tagline, color: COLORS.textSecondary}}>
          Agricultural Marketplace
        </Text>
      </View>

      {/* Loading Indicator */}
      <ActivityIndicator
        size="large"
        color={COLORS.primary500}
        style={styles.loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoSection: {
    marginBottom: 50,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#16a34a",
  },
  textSection: {
    alignItems: "center",
    marginBottom: 70,
  },
  brandName: {
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    opacity: 0.8,
  },
  loading: {
    marginTop: 20,
  },
});

export default SplashScreen;