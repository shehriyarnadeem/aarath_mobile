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
  Dimensions,
} from "react-native";
import { useTheme } from "../../constants/Theme";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../utils/apiClient";
import CountryCodePicker from "../../components/CountryCodePicker";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

import { getAuth, signInWithCustomToken } from "firebase/auth";
import Toast from "react-native-toast-message";
import { Animated, Image } from "react-native";
import { useRef, useEffect } from "react";
import { getBaseURL } from "../../utils/apiClient";
const LOGO = require("../../../assets/logo.png");

const { width: screenWidth } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const { COLORS, SIZES } = useTheme();
  const { loading, setLoading } = useAuth();
  console.log("LoginScreen Rendered", getBaseURL());
  const [step, setStep] = useState("choose"); // 'choose', 'phone', 'otp'
  const [countryCode, setCountryCode] = useState("+92"); // Default to Pakistan
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Logo rotation animation
  }, [step]);

  const handleChoosePhone = () => {
    setStep("phone");
  };

  // Send OTP using backend
  const handleSendOtp = async () => {
    console.log("Sending OTP to phone number:", phoneNumber);
    if (!phoneNumber.trim()) {
      setError("Please enter your phone number");
      return;
    }
    console.log("Preparing to send OTP", phoneNumber);
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    console.log("Sending OTP to:", fullPhoneNumber);
    setIsLoading(true);
    setError("");
    try {
      const result = await apiClient.auth.sendOtp(fullPhoneNumber, "login");
      console.log("OTP send response:", result);
      if (result.success) {
        setStep("otp");
        setIsLoading(false);
        setError("");
        Toast.show({
          type: "success",
          text1: result.message || "OTP sent to your phone number!",
          text1Style: {
            fontSize: 14,
            display: "flex",
          },
        });
        return;
      } else {
        setIsLoading(false);
        setError(result.error || "Failed to send OTP. Please try again.");
        return;
      }
    } catch (err) {
      console.log("Error during OTP send:", err);
      setIsLoading(false);
      setError(err.error || "Network error. Please try again.");
      return;
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setError("");
    try {
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const verifyResult = await apiClient.auth.verifyOtp(
        fullPhoneNumber,
        otp,
        "login"
      );
      if (!verifyResult.success) {
        setError(
          verifyResult?.otp?.message ||
            verifyResult?.user?.message ||
            "Invalid WhatsApp number or OTP. Please try again."
        );
        return;
      }
      setLoading(true); // --- ADDED LINE ---
      await signInWithCustomToken(getAuth(), verifyResult?.user?.token);
      Toast.show({
        type: "success",
        text1: "Successfully logged in!",
      });
      setIsLoading(false);
    } catch (err) {
      setError(err?.error || "Network error. Please try again.");
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

  const spin = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const renderChooseStep = () => {
    return (
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        {/* Decorative Background Elements */}
        <View style={styles.backgroundDecor}>
          <View
            style={[
              styles.decorCircle,
              styles.decorCircle1,
              { backgroundColor: COLORS.primary + "10" },
            ]}
          />
          <View
            style={[
              styles.decorCircle,
              styles.decorCircle2,
              { backgroundColor: COLORS.success + "15" },
            ]}
          />
          <View
            style={[
              styles.decorCircle,
              styles.decorCircle3,
              { backgroundColor: COLORS.warning + "08" },
            ]}
          />
        </View>

        <View style={styles.header}>
          <View style={styles.welcomeContainer}>
            <Text style={[styles.welcomeText, { color: COLORS.dark }]}>
              Welcome to
            </Text>
            <Animated.View
              style={[styles.logoContainer, { transform: [{ rotate: spin }] }]}
            >
              <Image source={LOGO} style={styles.logo} />
            </Animated.View>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              {
                borderColor: COLORS.primary,
                backgroundColor: COLORS.primary + "05",
              },
            ]}
            onPress={handleChoosePhone}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              <View
                style={[
                  styles.optionIconContainer,
                  { backgroundColor: COLORS.primary },
                ]}
              >
                <MaterialIcons name="phone" size={24} color={COLORS.white} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, { color: COLORS.primary }]}>
                  Continue with Phone
                </Text>
                <Text
                  style={[styles.optionSubtitle, { color: COLORS.gray500 }]}
                >
                  Sign in using your mobile number
                </Text>
              </View>
              <MaterialIcons
                name="arrow-forward-ios"
                size={16}
                color={COLORS.primary}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View
              style={[styles.dividerLine, { backgroundColor: COLORS.gray300 }]}
            />
            <View
              style={[
                styles.dividerTextContainer,
                { backgroundColor: COLORS.white },
              ]}
            >
              <Text style={[styles.dividerText, { color: COLORS.gray500 }]}>
                or
              </Text>
            </View>
            <View
              style={[styles.dividerLine, { backgroundColor: COLORS.gray300 }]}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {
                borderColor: COLORS.gray300,
                backgroundColor: COLORS.gray50,
              },
            ]}
            onPress={() => navigation.navigate("Signup")}
            activeOpacity={0.8}
          >
            <View style={styles.secondaryButtonContent}>
              <MaterialIcons
                name="person-add"
                size={20}
                color={COLORS.gray600}
              />
              <Text
                style={[styles.secondaryButtonText, { color: COLORS.gray700 }]}
              >
                Create new account
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Feature Highlights */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Ionicons
              name="shield-checkmark"
              size={16}
              color={COLORS.success}
            />
            <Text style={[styles.featureText, { color: COLORS.gray600 }]}>
              Secure
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="flash" size={16} color={COLORS.warning} />
            <Text style={[styles.featureText, { color: COLORS.gray600 }]}>
              Fast
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="people" size={16} color={COLORS.primary} />
            <Text style={[styles.featureText, { color: COLORS.gray600 }]}>
              Trusted
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderPhoneStep = () => (
    <Animated.View
      style={[
        styles.content,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <View style={styles.backButtonContent}>
          <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
          <Text style={[styles.backText, { color: COLORS.primary }]}>Back</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.header}>
        <View
          style={[
            styles.stepIndicator,
            { backgroundColor: COLORS.primary + "20" },
          ]}
        >
          <MaterialIcons name="phone" size={32} color={COLORS.primary} />
        </View>
        <Text style={[styles.title, { color: COLORS.dark }]}>Sign In</Text>
        <Text style={[styles.subtitle, { color: COLORS.gray600 }]}>
          We'll send you a verification code
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: COLORS.dark }]}>
            <MaterialIcons name="phone" size={16} color={COLORS.primary} />{" "}
            Phone Number
          </Text>
          <View
            style={[
              styles.phoneInputContainer,
              {
                borderColor: error ? COLORS.error : COLORS.gray300,
                backgroundColor: COLORS.gray50,
              },
            ]}
          >
            <CountryCodePicker
              selectedCode={countryCode}
              onSelectCode={(country) => setCountryCode(country.code)}
              style={styles.countryPicker}
            />
            <View style={styles.inputDivider} />
            <TextInput
              style={[styles.phoneInput, { color: COLORS.dark }]}
              placeholder="Enter phone number"
              placeholderTextColor={COLORS.gray400}
              value={phoneNumber}
              onChangeText={(text) => {
                const cleanedText = text.replace(/[^0-9]/g, "");
                setPhoneNumber(cleanedText);
                setError("");
              }}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>

        {error ? (
          <Animated.View style={styles.errorContainer}>
            <MaterialIcons
              name="error-outline"
              size={16}
              color={COLORS.error}
            />
            <Text style={[styles.errorText, { color: COLORS.error }]}>
              {error}
            </Text>
          </Animated.View>
        ) : null}

        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              backgroundColor: isLoading ? COLORS.gray400 : COLORS.primary,
              opacity: isLoading ? 0.7 : 1,
            },
          ]}
          onPress={() => handleSendOtp()}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={COLORS.white} size="small" />
              <Text
                style={[
                  styles.primaryButtonText,
                  { color: COLORS.white, marginLeft: 8 },
                ]}
              >
                Sending...
              </Text>
            </View>
          ) : (
            <View style={styles.buttonContent}>
              <MaterialIcons name="send" size={18} color={COLORS.white} />
              <Text style={[styles.primaryButtonText, { color: COLORS.white }]}>
                Send OTP
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderOtpStep = () => (
    <Animated.View
      style={[
        styles.content,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <View style={styles.backButtonContent}>
          <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
          <Text style={[styles.backText, { color: COLORS.primary }]}>Back</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.header}>
        <View
          style={[
            styles.stepIndicator,
            { backgroundColor: COLORS.success + "20" },
          ]}
        >
          <MaterialIcons name="lock" size={32} color={COLORS.success} />
        </View>
        <Text style={[styles.title, { color: COLORS.dark }]}>
          Enter Verification Code
        </Text>
        <View style={styles.phoneNumberDisplay}>
          <MaterialIcons name="phone" size={16} color={COLORS.gray500} />
          <Text style={[styles.subtitle, { color: COLORS.gray600 }]}>
            Code sent to {countryCode}
            {phoneNumber}
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <View
            style={[
              styles.otpInputContainer,
              {
                borderColor: error ? COLORS.error : COLORS.gray300,
                backgroundColor: COLORS.gray50,
              },
            ]}
          >
            <MaterialIcons name="security" size={20} color={COLORS.gray400} />
            <TextInput
              style={[styles.otpInput, { color: COLORS.dark }]}
              placeholder="••••••"
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
        </View>

        {error ? (
          <Animated.View style={styles.errorContainer}>
            <MaterialIcons
              name="error-outline"
              size={16}
              color={COLORS.error}
            />
            <Text style={[styles.errorText, { color: COLORS.error }]}>
              {error}
            </Text>
          </Animated.View>
        ) : null}

        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              backgroundColor: isLoading ? COLORS.gray400 : COLORS.success,
              opacity: isLoading ? 0.7 : 1,
            },
          ]}
          onPress={handleVerifyOtp}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={COLORS.white} size="small" />
              <Text
                style={[
                  styles.primaryButtonText,
                  { color: COLORS.white, marginLeft: 8 },
                ]}
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
              <Text style={[styles.primaryButtonText, { color: COLORS.white }]}>
                Verify & Login
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleSendOtp}
          activeOpacity={0.7}
        >
          <View style={styles.resendContent}>
            <MaterialIcons name="refresh" size={16} color={COLORS.primary} />
            <Text style={[styles.resendText, { color: COLORS.primary }]}>
              Resend OTP
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: COLORS.white }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
    scrollHorizontal: false,
    marginHorizontal: 0,
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

  // Background decoration
  backgroundDecor: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  decorCircle: {
    position: "absolute",
    borderRadius: 100,
  },
  decorCircle1: {
    width: 200,
    height: 200,
    top: -100,
    right: -100,
  },
  decorCircle2: {
    width: 150,
    height: 150,
    bottom: -75,
    left: -75,
  },
  decorCircle3: {
    width: 100,
    height: 100,
    top: 100,
    left: -50,
  },

  // Back button
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
    padding: 8,
  },
  backButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  backText: {
    fontSize: 16,
    fontWeight: "500",
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {},
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  welcomeContainer: {
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: "400",
  },
  brandText: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 4,
  },
  tagline: {
    fontSize: 14,
    fontStyle: "italic",
  },
  stepIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
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
  },
  phoneNumberDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },

  // Options
  optionsContainer: {},
  optionButton: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  optionSubtitle: {
    fontSize: 14,
  },

  // Divider
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    position: "relative",
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerTextContainer: {
    paddingHorizontal: 16,
    position: "absolute",
    alignSelf: "center",
    left: "50%",
    transform: [{ translateX: -10 }],
  },
  dividerText: {
    fontSize: 14,
    fontWeight: "500",
  },

  // Secondary button
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  secondaryButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },

  // Features
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    marginTop: 32,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    fontWeight: "500",
  },

  // Form
  form: {
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 4,
    gap: 12,
  },
  countryPicker: {
    fontSize: 12,
  },
  inputDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#e2e8f0",
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 17,
    letterSpacing: 1,
  },
  otpInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  otpInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 6,
    textAlign: "center",
  },

  // Error
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

  // Buttons
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
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
    marginTop: 24,
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
});

export default LoginScreen;
