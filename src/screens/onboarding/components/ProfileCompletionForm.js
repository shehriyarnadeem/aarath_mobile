import React from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../../../constants/Theme";

const ProfileCompletionForm = ({ profileData, onProfileChange }) => {
  const { COLORS, SIZES } = useTheme();

  const handleInputChange = (field, value) => {
    console.log("Profile field changed:", field, value);
    onProfileChange({
      ...profileData,
      [field]: value,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={[styles.subtitle, { color: COLORS.gray600 }]}>
        Complete your business profile to start connecting with the agricultural
        marketplace
      </Text>

      <View style={styles.formContainer}>
        {/* Business Name */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: COLORS.dark }]}>
            Business Name *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: profileData.businessName
                  ? COLORS.primary
                  : COLORS.gray300,
                color: COLORS.dark,
              },
            ]}
            placeholder="Enter your business or farm name"
            placeholderTextColor={COLORS.gray400}
            value={profileData.businessName}
            onChangeText={(text) => handleInputChange("businessName", text)}
            autoCapitalize="words"
          />
          <Text style={[styles.helperText, { color: COLORS.gray500 }]}>
            This will be displayed on your profile and listings
          </Text>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: COLORS.dark }]}>
            Email Address
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: profileData.email
                  ? COLORS.primary
                  : COLORS.gray300,
                color: COLORS.dark,
              },
            ]}
            placeholder="Enter your email address"
            placeholderTextColor={COLORS.gray400}
            value={profileData.email}
            onChangeText={(text) => handleInputChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={[styles.helperText, { color: COLORS.gray500 }]}>
            Optional - for important notifications and updates
          </Text>
        </View>

        {/* Business Description */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: COLORS.dark }]}>
            Business Description
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                borderColor: profileData.description
                  ? COLORS.primary
                  : COLORS.gray300,
                color: COLORS.dark,
              },
            ]}
            placeholder="Tell us about your business, farming practices, or trading activities..."
            placeholderTextColor={COLORS.gray400}
            value={profileData.description || ""}
            onChangeText={(text) => handleInputChange("description", text)}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />
          <Text style={[styles.helperText, { color: COLORS.gray500 }]}>
            Optional - helps others understand your business better
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

// Import TouchableOpacity
import { TouchableOpacity } from "react-native";

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
