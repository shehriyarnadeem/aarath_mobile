import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const { width, height } = Dimensions.get("window");

const WelcomeScreen = ({ navigation }) => {
  const { COLORS, SIZES } = useTheme();
  const { t } = useTranslation();

  const handleShopNow = () => {
    navigation.navigate("Login");
  };

  const handleContinueAsGuest = () => {
    navigation.navigate("Dashboard");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FFFFFF", "#ECFDF5", "#D1FAE5"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          {/* Language Switcher */}
          <LanguageSwitcher />

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo Section */}
            <View style={styles.logoSection}>
              <Image
                source={require("../../assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Welcome Text */}
            <View style={styles.welcomeSection}>
              <Text style={styles.title}>{t("welcome.title")}</Text>
              <Text style={styles.subtitle}>{t("welcome.subtitle")}</Text>
            </View>

            {/* Feature Cards */}
            <View style={styles.cardsContainer}>
              {/* Card 1 - Marketplace */}
              <View style={styles.featureCard}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>
                    {t("welcome.marketplaceTitle")}
                  </Text>
                  <TouchableOpacity
                    style={styles.cardButton}
                    onPress={handleShopNow}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cardButtonText}>
                      {t("welcome.shopNow")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Continue as Guest Button */}
            <TouchableOpacity
              style={styles.guestButton}
              onPress={handleContinueAsGuest}
              activeOpacity={0.8}
            >
              <Text style={styles.guestButtonText}>
                {t("welcome.continueAsGuest")}
              </Text>
            </TouchableOpacity>

            {/* Terms and Policy */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                {t("welcome.termsPrefix")}{" "}
                <Text style={styles.termsLink}>{t("welcome.termsOfUse")}</Text>{" "}
                {t("welcome.and")}{" "}
                <Text style={styles.termsLink}>
                  {t("welcome.privacyPolicy")}
                </Text>
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  logoSection: {
    alignItems: "center",
    marginTop: height * 0.05,
    marginBottom: height * 0.04,
  },
  logoContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#22c55e",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  logo: {
    width: width * 0.5,
    height: 60,
  },
  welcomeSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "400",
    marginBottom: 8,
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#6B7280",
  },
  cardsContainer: {
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: "#fafafaff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    minHeight: 160,
    justifyContent: "center",
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1F2937",
    lineHeight: 28,
  },
  cardButton: {
    backgroundColor: "#4ADE80",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignSelf: "flex-start",
  },
  cardButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  guestButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#1F2937",
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
  },
  termsContainer: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  termsText: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    color: "#9CA3AF",
  },
  termsLink: {
    fontWeight: "600",
    color: "#4ADE80",
  },
});

export default WelcomeScreen;
