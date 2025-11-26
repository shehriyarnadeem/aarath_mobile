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
import CountryCodePicker from "../../../components/CountryCodePicker";
import apiClient from "../../../utils/apiClient";
import { set } from "firebase/database";
import Toast from "react-native-toast-message";

const WhatsappVerification = ({ formData, setFormData }) => {
  const { COLORS, SIZES } = useTheme();
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countryCode, setCountryCode] = useState("+92");

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
        Alert.alert(
          "Success",
          result.message || "OTP sent to your phone number!"
        );
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
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {!isOtpSent ? (
          // Phone Number Input
          <View>
            <Text style={[styles.label, { color: COLORS.dark }]}>
              Phone Number *
            </Text>
            <View style={styles.phoneInputContainer}>
              <CountryCodePicker
                selectedCode={countryCode}
                onSelectCode={(country) => setCountryCode(country.code)}
                style={styles.countryPicker}
              />
              <TextInput
                style={[
                  styles.phoneInput,
                  {
                    borderColor: error ? COLORS.error : COLORS.gray300,
                    color: COLORS.dark,
                  },
                ]}
                placeholder="Enter your Phone number"
                placeholderTextColor={COLORS.gray400}
                value={formData.phoneNumber}
                onChangeText={(text) => {
                  setFormData({ ...formData, phoneNumber: text });
                  setError("");
                }}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>

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
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Text style={[styles.label, { color: COLORS.dark }]}>
                Enter OTP{" "}
              </Text>
              <TouchableOpacity
                style={{ ...styles.resendButton }}
                onPress={handleChangeNumber}
              >
                <Text style={[styles.resendText, { color: COLORS.primary }]}>
                  Change number
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.otpSubtitle, { color: COLORS.gray600 }]}>
              We sent a verification code to
              {formData.phoneNumber}
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

export default WhatsappVerification;
