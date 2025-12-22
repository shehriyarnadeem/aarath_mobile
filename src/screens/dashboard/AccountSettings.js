import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";

const AccountSettings = ({ navigation }) => {
  const { COLORS } = useTheme();

  const [settings, setSettings] = useState({
    twoFactorAuth: false,
    profileVisibility: true,
    dataCollection: true,
    marketingEmails: false,
    locationTracking: true,
  });

  const handleToggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Handle account deletion
            Alert.alert("Account Deleted", "Your account has been deleted.");
          },
        },
      ]
    );
  };

  const MenuSection = ({ title, children }) => (
    <View style={[styles.section, { backgroundColor: COLORS.white }]}>
      <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>{title}</Text>
      {children}
    </View>
  );

  const MenuItem = ({
    icon,
    iconColor,
    title,
    subtitle,
    onPress,
    showArrow = true,
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View
        style={[styles.iconContainer, { backgroundColor: iconColor + "15" }]}
      >
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, { color: COLORS.dark }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.menuSubtitle, { color: COLORS.gray }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
      )}
    </TouchableOpacity>
  );

  const ToggleItem = ({
    icon,
    iconColor,
    title,
    subtitle,
    value,
    onToggle,
  }) => (
    <View style={styles.menuItem}>
      <View
        style={[styles.iconContainer, { backgroundColor: iconColor + "15" }]}
      >
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, { color: COLORS.dark }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.menuSubtitle, { color: COLORS.gray }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.lightGray, true: COLORS.primary + "40" }}
        thumbColor={value ? COLORS.primary : "#f4f3f4"}
      />
    </View>
  );

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
          Account Settings
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Security Settings */}
        <MenuSection title="Language">
          <MenuItem
            icon="language-outline"
            iconColor={COLORS.primary}
            title="Change Language"
            subtitle="Update your account language preference"
            onPress={() => navigation.navigate("ChangeLanguage")}
          />
        </MenuSection>

        {/* Privacy Settings */}
        <MenuSection title="Privacy">
          <ToggleItem
            icon="location-outline"
            iconColor="#FFFFFFF"
            title="Location Tracking"
            subtitle="Share your location for better recommendations"
            value={settings.locationTracking}
            onToggle={() => handleToggleSetting("locationTracking")}
          />
        </MenuSection>

        {/* App Information */}
        <View style={[styles.appInfo, { backgroundColor: COLORS.white }]}>
          <Animated.Image
            source={require("../../../assets/logo.png")}
            style={[styles.logo]}
            resizeMode="contain"
          />

          <Text style={[styles.appVersion, { color: COLORS.gray }]}>
            Version 1.0.0
          </Text>
          <TouchableOpacity>
            <Text style={[styles.privacyLink, { color: COLORS.primary }]}>
              Privacy Policy • Terms of Service
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer spacing */}
        <View style={{ height: 40 }} />
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
    paddingHorizontal: 16,
    paddingVertical: 45,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f0f0f0",
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
  placeholder: {
    width: 40,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  // Section Styles
  section: {
    borderRadius: 16,
    marginBottom: 16,
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
    paddingBottom: 10,
  },

  // Menu Item Styles
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#f0f0f0",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  // App Info Section
  appInfo: {
    alignItems: "center",
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
  },
  appInfoText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 12,
  },
  privacyLink: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default AccountSettings;
