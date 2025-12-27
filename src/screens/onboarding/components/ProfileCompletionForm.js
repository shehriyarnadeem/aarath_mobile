import React from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../../../constants/Theme";
import { useTranslation } from "react-i18next";
const ProfileCompletionForm = ({ profileData, onProfileChange }) => {
  const { COLORS, SIZES } = useTheme();
  const { t } = useTranslation();
  const handleInputChange = (field, value) => {
    console.log("Profile field changed:", field, value);
    onProfileChange({
      ...profileData,
      [field]: value,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.formContainer}>
        {/* Business Name */}
        <View style={styles.inputGroup}>
          <Text
            style={StyleSheet.flatten([styles.label, { color: COLORS.dark }])}
          >
            {t("onboarding.businessName")} *
          </Text>
          <TextInput
            style={StyleSheet.flatten([
              styles.input,
              {
                borderColor: profileData.businessName
                  ? COLORS.primary
                  : COLORS.gray300,
                color: COLORS.dark,
              },
            ])}
            placeholder={t("onboarding.businessNamePlaceholder")}
            placeholderTextColor={COLORS.gray400}
            value={profileData.businessName}
            onChangeText={(text) => handleInputChange("businessName", text)}
            autoCapitalize="words"
          />
          <Text
            style={StyleSheet.flatten([
              styles.helperText,
              { color: COLORS.gray500 },
            ])}
          >
            {t("onboarding.businessNameSubtitle")}
          </Text>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text
            style={StyleSheet.flatten([styles.label, { color: COLORS.dark }])}
          >
            {t("onboarding.emailAddress")}
          </Text>
          <TextInput
            style={StyleSheet.flatten([
              styles.input,
              {
                borderColor: profileData.email
                  ? COLORS.primary
                  : COLORS.gray300,
                color: COLORS.dark,
              },
            ])}
            placeholder={t("onboarding.emailAddressPlaceholder")}
            placeholderTextColor={COLORS.gray400}
            value={profileData.email}
            onChangeText={(text) => handleInputChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text
            style={StyleSheet.flatten([
              styles.helperText,
              { color: COLORS.gray500 },
            ])}
          >
            {t("onboarding.optionalEmail")}
          </Text>
        </View>

        {/* Business Description */}
        <View style={styles.inputGroup}>
          <TextInput
            style={StyleSheet.flatten([
              styles.textArea,
              {
                borderColor: profileData.description
                  ? COLORS.primary
                  : COLORS.gray300,
                color: COLORS.dark,
              },
            ])}
            placeholder={t("onboarding.businessDescriptionPlaceholder")}
            placeholderTextColor={COLORS.gray400}
            value={profileData.description || ""}
            onChangeText={(text) => handleInputChange("description", text)}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />
          <Text
            style={StyleSheet.flatten([
              styles.helperText,
              { color: COLORS.gray500 },
            ])}
          >
            {t("onboarding.optional")}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: 32,
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    height: 100,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    lineHeight: 16,
  },
  radioGroup: {
    marginTop: 8,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  radioLabel: {
    fontSize: 14,
    flex: 1,
  },
  previewContainer: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  previewCard: {
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  previewBusinessName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default ProfileCompletionForm;
