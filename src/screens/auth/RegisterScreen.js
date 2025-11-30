import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../constants/Theme";
import { useAuth } from "../../context/AuthContext";
import CountryCodePicker from "../../components/CountryCodePicker";
import apiClient from "../../utils/apiClient";
import Toast from "react-native-toast-message";
import { getAuth, signInWithCustomToken } from "firebase/auth";
const RegisterScreen = ({ navigation }) => {
  const { COLORS, SIZES } = useTheme();

  const [step, setStep] = useState("choose"); // 'choose', 'phone', 'otp'
  const [countryCode, setCountryCode] = useState("+92"); // Default to Pakistan
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChoosePhone = () => {
    setStep("phone");
  };
  const handleSendOtp = async () => {
    if (!phoneNumber.trim()) {
      setError("Please enter your phone number");
      return;
    }

    const fullPhoneNumber = phoneNumber.includes("+")
      ? phoneNumber
      : `${countryCode}${phoneNumber}`;
    console.log("Sending OTP to:", fullPhoneNumber);
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
        Toast.show({
          text1: result.message || "OTP sent to your phone number!",
          type: "success",
        });
        setStep("otp");
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
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.auth.verifyOtp(
        fullPhoneNumber,
        otp,
        "registration"
      );
      if (response.success) {
        // Handle successful verification
        Toast.show({
          text1: response.otp?.message || "Verification successful!",
          text2: response.user?.message || "User created successfully!",
          type: "success",
          text1Style: { fontSize: 16, fontWeight: "600" },
          text2Style: { fontSize: 14 },
        });
        const auth = getAuth();
        await signInWithCustomToken(auth, response.user?.token);
      } else {
        setError(
          response.error || "OTP verification failed. Please try again."
        );
      }
    } catch (err) {
      setError(err?.message || "Network error. Please try again.");
      Toast.show({
        text1: err?.message || "Network error. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === "otp") {
      setStep("phone");
      setOtp("");
    } else if (step === "phone") {
      setStep("choose");
      setPhoneNumber("");
    }
    setError("");
  };

  const renderChooseStep = () => (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: COLORS.dark }]}>Join Aarath</Text>
        <Text style={[styles.subtitle, { color: COLORS.gray600 }]}>
          Start your agricultural marketplace journey
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionButton, { borderColor: COLORS.primary }]}
          onPress={handleChoosePhone}
        >
          <Text style={[styles.optionTitle, { color: COLORS.primary }]}>
            Sign up with Phone
          </Text>
          <Text style={[styles.optionSubtitle, { color: COLORS.gray500 }]}>
            Create account using your mobile number
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View
            style={[styles.dividerLine, { backgroundColor: COLORS.gray300 }]}
          />
          <Text style={[styles.dividerText, { color: COLORS.gray500 }]}>
            or
          </Text>
          <View
            style={[styles.dividerLine, { backgroundColor: COLORS.gray300 }]}
          />
        </View>

        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: COLORS.gray300 }]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={[styles.secondaryButtonText, { color: COLORS.gray700 }]}>
            Already have an account? Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPhoneStep = () => (
    <View style={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={[styles.backText, { color: COLORS.primary }]}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={[styles.title, { color: COLORS.dark }]}>
          Enter Phone Number
        </Text>
        <Text style={[styles.subtitle, { color: COLORS.gray600 }]}>
          We'll send you a verification code to get started
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: COLORS.dark }]}>
            Phone Number
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
              placeholder="Enter phone number"
              placeholderTextColor={COLORS.gray400}
              value={phoneNumber}
              onChangeText={(text) => {
                // Remove any non-numeric characters except for leading zeros
                const cleanedText = text.replace(/[^0-9]/g, "");
                setPhoneNumber(cleanedText);
                setError("");
              }}
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>
        </View>

        {error ? (
          <Text style={[styles.errorText, { color: COLORS.error }]}>
            {error}
          </Text>
        ) : null}

        <View style={styles.termsContainer}>
          <Text style={[styles.termsText, { color: COLORS.gray500 }]}>
            By continuing, you agree to our{" "}
            <Text style={{ color: COLORS.primary }}>Terms of Service</Text> and{" "}
            <Text style={{ color: COLORS.primary }}>Privacy Policy</Text>
          </Text>
        </View>

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
            <Text style={[styles.primaryButtonText, { color: COLORS.white }]}>
              Send OTP
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOtpStep = () => (
    <View style={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={[styles.backText, { color: COLORS.primary }]}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={[styles.title, { color: COLORS.dark }]}>
          Verify Phone Number
        </Text>
        <Text style={[styles.subtitle, { color: COLORS.gray600 }]}>
          Enter the 6-digit code sent to {phoneNumber}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
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
          onPress={handleVerifyOtp}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={[styles.primaryButtonText, { color: COLORS.white }]}>
              Verify & Continue
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.resendButton} onPress={handleSendOtp}>
          <Text style={[styles.resendText, { color: COLORS.primary }]}>
            Resend OTP
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: COLORS.white }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {step === "choose" && renderChooseStep()}
        {step === "phone" && renderPhoneStep()}
        {step === "otp" && renderOtpStep()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    fontWeight: "500",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  optionsContainer: {
    marginTop: 20,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    height: 60,
  },
  countryPicker: {
    marginRight: 8,
  },
  optionButton: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  form: {
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
  },
  otpInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 8,
  },
  termsContainer: {
    marginBottom: 20,
  },
  termsText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
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
    marginTop: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  resendButton: {
    alignItems: "center",
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default RegisterScreen;
