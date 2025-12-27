import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../constants/Theme";
import { useLanguage } from "../../context/LanguageContext";
import { TYPOGRAPHY } from "../../constants/Typography";

/**
 * HomeHeader - Header section with logo and welcome message
 * Professional agricultural marketplace branding
 */
const HomeHeader = () => {
  const { modernColors } = useTheme();
  const { t } = useLanguage();

  return (
    <LinearGradient
      colors={[modernColors.primary, modernColors.primaryLight]}
      style={styles.header}
    >
      <View style={styles.headerTop}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.logo}
          />
          <View style={styles.titleContainer}>
            <Text
              style={[
                TYPOGRAPHY.h1,
                styles.title,
                { color: modernColors.white },
              ]}
            >
              {t("home.marketplace")}
            </Text>
            <Text
              style={[
                TYPOGRAPHY.body,
                styles.subtitle,
                { color: modernColors.white },
              ]}
            >
              {t("home.welcomeBack")}
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 50,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    width: "80%",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logo: {
    width: 65,
    height: 65,
    resizeMode: "contain",
    marginRight: 15,
    backgroundColor: "transparent",
  },
  titleContainer: {
    width: "100%",
  },
  title: {
    opacity: 0.9,
  },
  subtitle: {
    opacity: 0.9,
  },
});

export default HomeHeader;
