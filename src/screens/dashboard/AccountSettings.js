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
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";
import { useLanguage } from "../../context/LanguageContext";

const AccountSettings = ({ navigation }) => {
  const { COLORS } = useTheme();
  const { t, currentLanguage, changeLanguage } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

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

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setShowLanguageModal(false);
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
          {t("settings.accountSettings")}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Security Settings */}

        <MenuItem
          icon="language-outline"
          iconColor={COLORS.primary}
          title={t("settings.changeLanguage")}
          subtitle={t("settings.updateLanguagePreference")}
          onPress={() => setShowLanguageModal(true)}
        />

        {/* App Information */}
        <View style={[styles.appInfo, { backgroundColor: COLORS.white }]}>
          <Animated.Image
            source={require("../../../assets/logo.png")}
            style={[styles.logo]}
            resizeMode="contain"
          />

          <Text style={[styles.appVersion, { color: COLORS.gray }]}>
            {t("settings.version")} 1.0.0
          </Text>
          <TouchableOpacity>
            <Text style={[styles.privacyLink, { color: COLORS.primary }]}>
              {t("settings.privacyTerms")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageModal(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: COLORS.white }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: COLORS.dark }]}>
                {t("settings.selectLanguage")}
              </Text>
              <Text style={[styles.modalSubtitle, { color: COLORS.gray }]}>
                {t("settings.choosePreferredLanguage")}
              </Text>
            </View>

            <View style={styles.languageOptions}>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  currentLanguage === "en" && {
                    backgroundColor: COLORS.primary + "10",
                    borderColor: COLORS.primary,
                  },
                ]}
                onPress={() => handleLanguageChange("en")}
              >
                <View style={styles.languageContent}>
                  <Text
                    style={[
                      styles.languageName,
                      {
                        color:
                          currentLanguage === "en"
                            ? COLORS.primary
                            : COLORS.dark,
                      },
                    ]}
                  >
                    {t("settings.english")}
                  </Text>
                  <Text
                    style={[
                      styles.languageNative,
                      {
                        color:
                          currentLanguage === "en"
                            ? COLORS.primary
                            : COLORS.gray,
                      },
                    ]}
                  >
                    English
                  </Text>
                </View>
                {currentLanguage === "en" && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={COLORS.primary}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.languageOption,
                  currentLanguage === "ur" && {
                    backgroundColor: COLORS.primary + "10",
                    borderColor: COLORS.primary,
                  },
                ]}
                onPress={() => handleLanguageChange("ur")}
              >
                <View style={styles.languageContent}>
                  <Text
                    style={[
                      styles.languageName,
                      {
                        color:
                          currentLanguage === "ur"
                            ? COLORS.primary
                            : COLORS.dark,
                      },
                    ]}
                  >
                    {t("settings.urdu")}
                  </Text>
                  <Text
                    style={[
                      styles.languageNative,
                      {
                        color:
                          currentLanguage === "ur"
                            ? COLORS.primary
                            : COLORS.gray,
                      },
                    ]}
                  >
                    اردو
                  </Text>
                </View>
                {currentLanguage === "ur" && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={COLORS.primary}
                  />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.closeButton,
                { backgroundColor: COLORS.lightGray },
              ]}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={[styles.closeButtonText, { color: COLORS.dark }]}>
                {t("common.cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  languageOptions: {
    gap: 12,
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  languageContent: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  languageNative: {
    fontSize: 14,
  },
  closeButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AccountSettings;
