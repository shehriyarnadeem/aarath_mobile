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
  Picker,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";

const Preferences = ({ navigation }) => {
  const { COLORS } = useTheme();

  const [preferences, setPreferences] = useState({
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: true,
    priceAlerts: true,
    newProductAlerts: false,
    marketUpdates: true,
    language: "english",
    currency: "pkr",
    measurementUnit: "metric",
    darkMode: false,
    soundEffects: true,
    hapticFeedback: true,
  });

  const handleTogglePreference = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePickerChange = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const PreferenceSection = ({ title, children }) => (
    <View style={[styles.section, { backgroundColor: COLORS.white }]}>
      <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>{title}</Text>
      {children}
    </View>
  );

  const ToggleItem = ({
    icon,
    iconColor,
    title,
    subtitle,
    value,
    onToggle,
  }) => (
    <View style={styles.preferenceItem}>
      <View
        style={[styles.iconContainer, { backgroundColor: iconColor + "15" }]}
      >
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.preferenceContent}>
        <Text style={[styles.preferenceTitle, { color: COLORS.dark }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.preferenceSubtitle, { color: COLORS.gray }]}>
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

  const PickerItem = ({
    icon,
    iconColor,
    title,
    subtitle,
    selectedValue,
    onValueChange,
    options,
  }) => (
    <View style={styles.preferenceItem}>
      <View
        style={[styles.iconContainer, { backgroundColor: iconColor + "15" }]}
      >
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.preferenceContent}>
        <Text style={[styles.preferenceTitle, { color: COLORS.dark }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.preferenceSubtitle, { color: COLORS.gray }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <View style={[styles.pickerContainer, { borderColor: COLORS.lightGray }]}>
        <Picker
          selectedValue={selectedValue}
          style={[styles.picker, { color: COLORS.dark }]}
          onValueChange={onValueChange}
          mode="dropdown"
        >
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );

  const languageOptions = [
    { label: "English", value: "english" },
    { label: "اردو (Urdu)", value: "urdu" },
    { label: "ਪੰਜਾਬੀ (Punjabi)", value: "punjabi" },
  ];

  const currencyOptions = [
    { label: "PKR (₨)", value: "pkr" },
    { label: "USD ($)", value: "usd" },
    { label: "EUR (€)", value: "eur" },
  ];

  const measurementOptions = [
    { label: "Metric (kg, tons)", value: "metric" },
    { label: "Imperial (lbs, tons)", value: "imperial" },
  ];

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
          Preferences
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Notification Preferences */}
        <PreferenceSection title="Notifications">
          <ToggleItem
            icon="notifications-outline"
            iconColor={COLORS.primary}
            title="Push Notifications"
            subtitle="Receive notifications on your device"
            value={preferences.pushNotifications}
            onToggle={() => handleTogglePreference("pushNotifications")}
          />

          <ToggleItem
            icon="mail-outline"
            iconColor="#3B82F6"
            title="Email Notifications"
            subtitle="Receive notifications via email"
            value={preferences.emailNotifications}
            onToggle={() => handleTogglePreference("emailNotifications")}
          />

          <ToggleItem
            icon="chatbubble-outline"
            iconColor="#10B981"
            title="SMS Notifications"
            subtitle="Receive important updates via SMS"
            value={preferences.smsNotifications}
            onToggle={() => handleTogglePreference("smsNotifications")}
          />
        </PreferenceSection>

        {/* Alert Preferences */}
        <PreferenceSection title="Alerts">
          <ToggleItem
            icon="trending-up-outline"
            iconColor="#F59E0B"
            title="Price Alerts"
            subtitle="Get notified about price changes"
            value={preferences.priceAlerts}
            onToggle={() => handleTogglePreference("priceAlerts")}
          />

          <ToggleItem
            icon="cube-outline"
            iconColor={COLORS.secondary}
            title="New Product Alerts"
            subtitle="Be first to know about new products"
            value={preferences.newProductAlerts}
            onToggle={() => handleTogglePreference("newProductAlerts")}
          />

          <ToggleItem
            icon="bar-chart-outline"
            iconColor="#8B5CF6"
            title="Market Updates"
            subtitle="Receive agricultural market insights"
            value={preferences.marketUpdates}
            onToggle={() => handleTogglePreference("marketUpdates")}
          />
        </PreferenceSection>

        {/* Regional Preferences */}
        <PreferenceSection title="Regional Settings">
          <PickerItem
            icon="language-outline"
            iconColor="#6B7280"
            title="Language"
            subtitle="Choose your preferred language"
            selectedValue={preferences.language}
            onValueChange={(value) => handlePickerChange("language", value)}
            options={languageOptions}
          />

          <PickerItem
            icon="card-outline"
            iconColor="#10B981"
            title="Currency"
            subtitle="Select your preferred currency"
            selectedValue={preferences.currency}
            onValueChange={(value) => handlePickerChange("currency", value)}
            options={currencyOptions}
          />

          <PickerItem
            icon="resize-outline"
            iconColor="#F59E0B"
            title="Measurement Units"
            subtitle="Choose metric or imperial units"
            selectedValue={preferences.measurementUnit}
            onValueChange={(value) =>
              handlePickerChange("measurementUnit", value)
            }
            options={measurementOptions}
          />
        </PreferenceSection>

        {/* App Experience */}
        <PreferenceSection title="App Experience">
          <ToggleItem
            icon="moon-outline"
            iconColor="#4C1D95"
            title="Dark Mode"
            subtitle="Use dark theme for the app"
            value={preferences.darkMode}
            onToggle={() => handleTogglePreference("darkMode")}
          />

          <ToggleItem
            icon="volume-high-outline"
            iconColor="#EF4444"
            title="Sound Effects"
            subtitle="Play sounds for app interactions"
            value={preferences.soundEffects}
            onToggle={() => handleTogglePreference("soundEffects")}
          />

          <ToggleItem
            icon="phone-portrait-outline"
            iconColor="#8B5CF6"
            title="Haptic Feedback"
            subtitle="Feel vibrations for app interactions"
            value={preferences.hapticFeedback}
            onToggle={() => handleTogglePreference("hapticFeedback")}
          />
        </PreferenceSection>

        {/* Reset Section */}
        <View style={[styles.section, { backgroundColor: COLORS.white }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>
            Reset
          </Text>

          <TouchableOpacity style={styles.resetButton}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: COLORS.error + "15" },
              ]}
            >
              <Ionicons name="refresh-outline" size={22} color={COLORS.error} />
            </View>
            <View style={styles.preferenceContent}>
              <Text style={[styles.preferenceTitle, { color: COLORS.error }]}>
                Reset All Preferences
              </Text>
              <Text style={[styles.preferenceSubtitle, { color: COLORS.gray }]}>
                Restore all settings to default values
              </Text>
            </View>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
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

  // Preference Item Styles
  preferenceItem: {
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
  preferenceContent: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  preferenceSubtitle: {
    fontSize: 14,
  },

  // Picker Styles
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
    minWidth: 120,
  },
  picker: {
    height: 40,
    width: 120,
  },

  // Reset Button
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#f0f0f0",
  },
});

export default Preferences;
