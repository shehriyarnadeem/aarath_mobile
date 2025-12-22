import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../constants/Theme";
import CountryCodePicker from "../../../components/CountryCodePicker";
import apiClient from "../../../utils/apiClient";
import { set } from "firebase/database";
import Toast from "react-native-toast-message";

const { width: screenWidth } = Dimensions.get("window");

const WhatsappVerification = ({ formData, setFormData }) => {
  const { COLORS, SIZES } = useTheme();
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countryCode, setCountryCode] = useState("+92");

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOtpSent]);

  const handleSendOtp = async () => {
    if (!formData.phoneNumber.trim()) {
      setError("Please enter your phone number");
      return;
    }
    const fullPhoneNumber = formData.phoneNumber.includes("+")
      ? formData.phoneNumber
      : `${countryCode}${formData.phoneNumber}`;
    setIsLoading(true);
    setError("");
    try {
      const result = await apiClient.auth.sendOtp(
        fullPhoneNumber,
        "registration"
      );
      console.log("OTP send response:", result.success);
      if (result.success) {
        setIsLoading(false);
        setError("");
        setIsOtpSent(true);
        setFormData({ ...formData, phoneNumber: fullPhoneNumber });
        Toast.show({
          text1: result.message || "OTP sent to your phone number!",
          type: "success",
        });
      } else {
        setIsLoading(false);
        setError(result.error || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.log("Error during OTP send:", err);
      setIsLoading(false);
      setError(err.error || "Network error. Please try again.");
    }
  };
  const handleVerifyOtp = async () => {
    setIsLoading(false);
    setError("");
    console.log("Verifying OTP for:", formData.phoneNumber, "OTPs:", otp);
    if (!otp) {
      console.log("Please enter the OTP");
      setError("Please enter the OTP");
      return;
    }
    console.log("Verifying OTP for:", formData.phoneNumber, "OTP2:", otp);
    try {
      console.log("came here2 ");
      const response = await apiClient.auth.verifyOtp(
        formData.phoneNumber,
        otp
      );
      console.log("OTP verify response:", response);
      if (response.success) {
        setFormData({ ...formData, whatsappVerified: true });
        Toast.show({
          text1: response.message || "Phone number verified successfully!",
          type: "success",
        });
        // Show success animation
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        setError(
          response.error || "OTP verification failed. Please try again."
        );
      }
      setIsLoading(false);
    } catch (err) {
      setError(err?.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendOtp = () => {
    setOtp("");
    handleSendOtp();
  };

  const handleChangeNumber = () => {
    // Fix: Properly handle the state updates without causing render issues
    setIsOtpSent(false);
    setOtp("");
    setError("");
    setFormData({
      ...formData,
      phoneNumber: "",
      whatsappVerified: false,
    });
  };

  return (
    <Animated.View
      style={StyleSheet.flatten([
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ])}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View
          style={StyleSheet.flatten([
                styles.iconContainer,
                { backgroundColor: COLORS.primary + "15" },
              ])}
        >
          <MaterialIcons
            name="phone-android"
            size={40}
            color={COLORS.primary}
          />
        </View>
        <Text style={StyleSheet.flatten([styles.title, { color: COLORS.dark }])}>
          {!isOtpSent ? "Verify Your Phone" : "Enter Verification Code"}
        </Text>
        <Text style={StyleSheet.flatten([styles.subtitle, { color: COLORS.gray600 }])}>
          {!isOtpSent
            ? "We'll send you a verification code to confirm your number"
            : `Enter the 6-digit code sent to ${formData.phoneNumber}`}
        </Text>
      </View>

      <View style={styles.formContainer}>
        {formData.whatsappVerified ? (
          // Verification Success
          <Animated.View
            style={StyleSheet.flatten([
                styles.successContainer,
                { backgroundColor: COLORS.success + "10" },
              ])}
          >
            <View
              style={StyleSheet.flatten([
                styles.successIconContainer,
                { backgroundColor: COLORS.success },
              ])}
            >
              <MaterialIcons
                name="verified-user"
                size={48}
                color={COLORS.white}
              />
            </View>
            <Text style={StyleSheet.flatten([styles.successTitle, { color: COLORS.success }])}>
              Phone Verified Successfully!
            </Text>
            <Text style={StyleSheet.flatten([styles.successSubtitle, { color: COLORS.gray600 }])}>
              Your phone number {formData.phoneNumber} has been verified and is
              ready to use.
            </Text>
            <View style={styles.successFeatures}>
              <View style={styles.successFeature}>
                <MaterialIcons
                  name="check-circle"
                  size={16}
                  color={COLORS.success}
                />
                <Text
                  style={StyleSheet.flatten([styles.successFeatureText, { color: COLORS.gray600 }])}
                >
                  Receive auction notifications
                </Text>
              </View>
              <View style={styles.successFeature}>
                <MaterialIcons
                  name="check-circle"
                  size={16}
                  color={COLORS.success}
                />
                <Text
                  style={StyleSheet.flatten([styles.successFeatureText, { color: COLORS.gray600 }])}
                >
                  Secure WhatsApp updates
                </Text>
              </View>
              <View style={styles.successFeature}>
                <MaterialIcons
                  name="check-circle"
                  size={16}
                  color={COLORS.success}
                />
                <Text
                  style={StyleSheet.flatten([styles.successFeatureText, { color: COLORS.gray600 }])}
                >
                  Market alerts & bidding
                </Text>
              </View>
            </View>
          </Animated.View>
        ) : !isOtpSent ? (
          // Phone Number Input
          <Animated.View style={styles.inputSection}>
            <View style={styles.labelContainer}>
              <MaterialIcons name="phone" size={18} color={COLORS.primary} />
              <Text style={StyleSheet.flatten([styles.label, { color: COLORS.dark }])}>
                Phone Number *
              </Text>
            </View>

            <View
              style={StyleSheet.flatten([
                styles.phoneInputContainer,
                {
                  borderColor: error ? COLORS.error : COLORS.gray300,
                  backgroundColor: COLORS.gray50,
                },
              ])}
            >
              <CountryCodePicker
                selectedCode={countryCode}
                onSelectCode={(country) => setCountryCode(country.code)}
                style={styles.countryPicker}
              />
              <View
                style={StyleSheet.flatten([
                styles.inputDivider,
                { backgroundColor: COLORS.gray300 },
              ])}
              />
              <TextInput
                style={StyleSheet.flatten([styles.phoneInput, { color: COLORS.dark }])}
                placeholder="Enter your phone number"
                placeholderTextColor={COLORS.gray400}
                value={formData.phoneNumber}
                onChangeText={(text) => {
                  const cleanedText = text.replace(/[^0-9]/g, "");
                  setFormData({ ...formData, phoneNumber: cleanedText });
                  setError("");
                }}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            {error ? (
              <Animated.View style={styles.errorContainer}>
                <MaterialIcons
                  name="error-outline"
                  size={16}
                  color={COLORS.error}
                />
                <Text style={StyleSheet.flatten([styles.errorText, { color: COLORS.error }])}>
                  {error}
                </Text>
              </Animated.View>
            ) : null}

            <TouchableOpacity
              style={StyleSheet.flatten([
                styles.primaryButton,
                {
                  backgroundColor: isLoading ? COLORS.gray400 : COLORS.primary,
                  opacity: isLoading ? 0.7 : 1,
                },
              ])}
              onPress={handleSendOtp}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color={COLORS.white} size="small" />
                  <Text
                    style={StyleSheet.flatten([
                styles.primaryButtonText,
                { color: COLORS.white, marginLeft: 8 },
              ])}
                  >
                    Sending...
                  </Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <MaterialIcons name="send" size={18} color={COLORS.white} />
                  <Text
                    style={StyleSheet.flatten([styles.primaryButtonText, { color: COLORS.white }])}
                  >
                    Send OTP
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        ) : (
          // OTP Input
          <Animated.View style={styles.inputSection}>
            <View style={styles.otpHeader}>
              <View style={styles.labelContainer}>
                <MaterialIcons
                  name="security"
                  size={18}
                  color={COLORS.success}
                />
                <Text style={StyleSheet.flatten([styles.label, { color: COLORS.dark }])}>
                  Enter Verification Code
                </Text>
              </View>
              <TouchableOpacity
                style={styles.changeNumberButton}
                onPress={handleChangeNumber}
                activeOpacity={0.7}
              >
                <MaterialIcons name="edit" size={16} color={COLORS.primary} />
                <Text
                  style={StyleSheet.flatten([styles.changeNumberText, { color: COLORS.primary }])}
                >
                  Change number
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={StyleSheet.flatten([
                styles.otpInputContainer,
                {
                  borderColor: error ? COLORS.error : COLORS.gray300,
                  backgroundColor: COLORS.gray50,
                },
              ])}
            >
              <MaterialIcons name="lock" size={20} color={COLORS.gray400} />
              <TextInput
                style={StyleSheet.flatten([styles.otpInput, { color: COLORS.dark }])}
                placeholder="• • • • • •"
                placeholderTextColor={COLORS.gray400}
                value={otp}
                onChangeText={(text) => {
                  const cleanedText = text.replace(/[^0-9]/g, "");
                  setOtp(cleanedText);
                  setError("");
                }}
                keyboardType="numeric"
                maxLength={6}
                textAlign="center"
              />
            </View>

            {error ? (
              <Animated.View style={styles.errorContainer}>
                <MaterialIcons
                  name="error-outline"
                  size={16}
                  color={COLORS.error}
                />
                <Text style={StyleSheet.flatten([styles.errorText, { color: COLORS.error }])}>
                  {error}
                </Text>
              </Animated.View>
            ) : null}

            <TouchableOpacity
              style={StyleSheet.flatten([
                styles.primaryButton,
                {
                  backgroundColor: isLoading ? COLORS.gray400 : COLORS.success,
                  opacity: isLoading ? 0.7 : 1,
                },
              ])}
              onPress={handleVerifyOtp}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color={COLORS.white} size="small" />
                  <Text
                    style={StyleSheet.flatten([
                styles.primaryButtonText,
                { color: COLORS.white, marginLeft: 8 },
              ])}
                  >
                    Verifying...
                  </Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <MaterialIcons
                    name="verified-user"
                    size={18}
                    color={COLORS.white}
                  />
                  <Text
                    style={StyleSheet.flatten([styles.primaryButtonText, { color: COLORS.white }])}
                  >
                    Verify OTP
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendOtp}
              activeOpacity={0.7}
            >
              <View style={styles.resendContent}>
                <MaterialIcons
                  name="refresh"
                  size={16}
                  color={COLORS.primary}
                />
                <Text style={StyleSheet.flatten([styles.resendText, { color: COLORS.primary }])}>
                  Didn't receive OTP? Resend
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {/* WhatsApp Info - Only show when not verified */}
      {!formData.whatsappVerified && (
        <View
          style={StyleSheet.flatten([
            styles.infoContainer,
            {
              backgroundColor: COLORS.primary + "08",
              borderColor: COLORS.primary + "20",
            },
          ])}
        >
          <View
            style={StyleSheet.flatten([
                styles.infoIconContainer,
                { backgroundColor: COLORS.primary },
              ])}
          >
            <MaterialIcons name="whatsapp" size={20} color={COLORS.white} />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={StyleSheet.flatten([styles.infoTitle, { color: COLORS.primary }])}>
              Phone Verification
            </Text>
            <Text style={StyleSheet.flatten([styles.infoText, { color: COLORS.gray600 }])}>
              We'll use your phone number to send you important auction updates,
              bid notifications, and market alerts.
            </Text>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Header styles
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  // Form styles
  formContainer: {
    marginBottom: 32,
  },
  inputSection: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },

  // Phone input styles
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 4,
    marginBottom: 16,
    gap: 10,
  },
  countryPicker: {
    fontSize: 12,
  },
  inputDivider: {
    width: 1,
    height: 30,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },

  // OTP styles
  otpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  changeNumberButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 4,
  },
  changeNumberText: {
    fontSize: 14,
    fontWeight: "500",
  },
  otpInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  otpInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 4,
    textAlign: "center",
  },

  // Error styles
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },

  // Button styles
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  resendButton: {
    alignItems: "center",
    padding: 12,
  },
  resendContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  resendText: {
    fontSize: 14,
    fontWeight: "500",
  },

  // Info container styles
  infoContainer: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    alignItems: "flex-start",
    borderWidth: 1,
    gap: 12,
    marginTop: 20,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },

  // Success state styles
  successContainer: {
    alignItems: "center",
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#10B981" + "30",
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  successFeatures: {
    width: "100%",
    gap: 12,
  },
  successFeature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  successFeatureText: {
    fontSize: 14,
    flex: 1,
  },

  // Verified state styles (legacy)
  verifiedContainer: {
    alignItems: "center",
    padding: 32,
    borderRadius: 16,
    marginBottom: 32,
  },
  verifiedIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  verifiedTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  verifiedSubtitle: {
    fontSize: 16,
  },
});

export default WhatsappVerification;
