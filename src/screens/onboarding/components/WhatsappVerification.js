import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../../constants/Theme";

const WhatsappVerification = ({ formData, setFormData }) => {
  const { COLORS, SIZES } = useTheme();
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    if (!formData.whatsapp || formData.whatsapp.length < 10) {
      setError("Please enter a valid WhatsApp number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.post('/auth/whatsapp/send-otp', {
      //   whatsapp: formData.whatsapp
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsOtpSent(true);
      Alert.alert("Success", "OTP sent to your WhatsApp number!");
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setError("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.post('/auth/whatsapp/verify-otp', {
      //   whatsapp: formData.whatsapp,
      //   otp: otp
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFormData({
        ...formData,
        whatsappVerified: true,
      });

      Alert.alert("Success", "WhatsApp number verified successfully!");
    } catch (error) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    setOtp("");
    setIsOtpSent(false);
    handleSendOtp();
  };

  if (formData.whatsappVerified) {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.verifiedContainer,
            { backgroundColor: COLORS.primary50 },
          ]}
        >
          <Text style={styles.verifiedIcon}>✅</Text>
          <Text style={[styles.verifiedTitle, { color: COLORS.primary700 }]}>
            WhatsApp Verified
          </Text>
          <Text style={[styles.verifiedSubtitle, { color: COLORS.primary600 }]}>
            {formData.whatsapp}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.subtitle, { color: COLORS.gray600 }]}>
        Verify your WhatsApp number for important notifications and updates
      </Text>

      <View style={styles.formContainer}>
        {!isOtpSent ? (
          // Phone Number Input
          <View>
            <Text style={[styles.label, { color: COLORS.dark }]}>
              WhatsApp Number *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: error ? COLORS.error : COLORS.gray300,
                  color: COLORS.dark,
                },
              ]}
              placeholder="Enter your WhatsApp number"
              placeholderTextColor={COLORS.gray400}
              value={formData.whatsapp}
              onChangeText={(text) => {
                setFormData({ ...formData, whatsapp: text });
                setError("");
              }}
              keyboardType="phone-pad"
              maxLength={15}
            />

            {error ? (
              <Text style={[styles.errorText, { color: COLORS.error }]}>
                {error}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                {
                  backgroundColor: isLoading ? COLORS.gray400 : COLORS.primary,
                  opacity: isLoading ? 0.7 : 1,
                },
              ]}
              onPress={handleSendOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text
                  style={[styles.primaryButtonText, { color: COLORS.white }]}
                >
                  Send OTP
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          // OTP Input
          <View>
            <Text style={[styles.label, { color: COLORS.dark }]}>
              Enter OTP
            </Text>
            <Text style={[styles.otpSubtitle, { color: COLORS.gray600 }]}>
              We sent a verification code to {formData.whatsapp}
            </Text>

            <TextInput
              style={[
                styles.otpInput,
                {
                  borderColor: error ? COLORS.error : COLORS.gray300,
                  color: COLORS.dark,
                },
              ]}
              placeholder="Enter OTP"
              placeholderTextColor={COLORS.gray400}
              value={otp}
              onChangeText={(text) => {
                setOtp(text);
                setError("");
              }}
              keyboardType="numeric"
              maxLength={6}
              textAlign="center"
            />

            {error ? (
              <Text style={[styles.errorText, { color: COLORS.error }]}>
                {error}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                {
                  backgroundColor: isLoading ? COLORS.gray400 : COLORS.primary,
                  opacity: isLoading ? 0.7 : 1,
                },
              ]}
              onPress={handleVerifyOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text
                  style={[styles.primaryButtonText, { color: COLORS.white }]}
                >
                  Verify OTP
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendOtp}
            >
              <Text style={[styles.resendText, { color: COLORS.primary }]}>
                Didn't receive OTP? Resend
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* WhatsApp Info */}
      <View style={[styles.infoContainer, { backgroundColor: COLORS.gray50 }]}>
        <Text style={styles.infoIcon}>💬</Text>
        <Text style={[styles.infoText, { color: COLORS.gray600 }]}>
          We'll use WhatsApp to send you important auction updates, bid
          notifications, and market alerts.
        </Text>
      </View>
    </View>
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
    marginBottom: 16,
  },
  otpSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  otpInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  resendButton: {
    alignItems: "center",
  },
  resendText: {
    fontSize: 14,
    fontWeight: "500",
  },
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
  infoContainer: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    alignItems: "flex-start",
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});

export default WhatsappVerification;
