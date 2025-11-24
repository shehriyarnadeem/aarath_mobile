import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../constants/Theme";
import { useAuth } from "../context/AuthContext";

const SplashScreen = ({ navigation }) => {
  const { COLORS, SIZES } = useTheme();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Simulate app initialization delay

      // Check for existing authentication token
      if (isAuthenticated) {
        // Validate token with backend (placeholder)
        navigation.navigate("Marketplace");
      } else {
        await AsyncStorage.removeItem("authToken");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.content}>
        <Text style={[styles.title, { color: COLORS.white }]}>Aarath</Text>
        <Text style={[styles.subtitle, { color: COLORS.light }]}>
          Auction Platform
        </Text>

        <ActivityIndicator
          size="large"
          color={COLORS.white}
          style={styles.loader}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "300",
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;
