import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";

// Import onboarding components
import RoleSelection from "../onboarding/components/RoleSelection";
import LocationSelection from "../onboarding/components/LocationSelection";
import WhatsappVerification from "../onboarding/components/WhatsappVerification";
import ProfileCompletionForm from "../onboarding/components/ProfileCompletionForm";
import CategorySelection from "../onboarding/components/CategorySelection";
import apiClient from "../../utils/apiClient";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import Toast from "react-native-toast-message";
import { useAuth } from "../../context/AuthContext";
import { set } from "firebase/database";
const OnboardingFlow = ({ navigation }) => {
  const { COLORS, SIZES } = useTheme();
  const {
    updateUserProfile,
    user,
    logout,
    setHasCompletedOnboarding,
    setUser,
  } = useAuth();
  const userId = user?.uid || user?.id;
  console.log("OnboardingFlow - userId:", user);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    userId: userId,
    whatsapp: "",
    whatsappVerified: false,
    role: "",
    state: "",
    city: "",
    businessCategories: [],
    profileCompletion: {
      businessName: "",
      email: user?.email || "",
    },
  });

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const stepTitles = {
    1: "Select Your Role",
    2: "Choose Location",
    3: "Business Categories",
    4: "Complete Profile",
  };

  const canProceedToNext = () => {
    let canProceed = false;
    switch (currentStep) {
      case 1:
        canProceed = formData.role !== "";
        console.log(
          "Role selection - can proceed:",
          canProceed,
          "role:",
          formData.role
        );
        break;
      case 2:
        canProceed = formData.state !== "" && formData.city !== "";
        break;
      case 3:
        canProceed = formData.profileCompletion.businessName !== "";
        break;
      case 4:
        canProceed = formData.businessCategories.length > 0;
        break;
      default:
        canProceed = false;
    }
    return canProceed;
  };

  const handleNext = () => {
    if (!canProceedToNext()) {
      Toast.show({
        text1: "Please complete all required fields before proceeding.",
        type: "error",
      });
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const countStep = currentStep - 1;
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Prepare data for backend
      const payload = {
        whatsapp: formData.phoneNumber,
        state: formData.state,
        city: formData.city,
        role: formData.role,
        businessName: formData.profileCompletion.businessName,
        email: formData.profileCompletion.email,
        businessCategories: formData.businessCategories,
        profileCompleted: true,
        userId: userId,
      };

      const response = await apiClient.user.onboardingComplete(payload);
      if (response.success && response.user) {
        Toast.show({
          type: "success",
          text1: "Registration successful!",
        });
        setUser(response.user);
        setHasCompletedOnboarding(true);
      } else if (response?.error) {
        console.log("Onboarding error response:", response);
        Toast.show({
          text1: response.error?.message,
          type: "error",
        });
      }
      console.log(
        "✅ Firebase sign-in complete, waiting for auth state change..."
      );
    } catch (err) {
      console.log("Onboarding error responseq:", err);
      Toast.show({
        text1:
          err?.error?.message ||
          err?.message ||
          "Failed to complete profile setup. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <RoleSelection
            selectedRole={formData.role}
            onRoleSelect={(role) => setFormData({ ...formData, role })}
          />
        );
      case 2:
        return (
          <LocationSelection
            selectedState={formData.state}
            selectedCity={formData.city}
            onLocationSelect={(state, city) =>
              setFormData({ ...formData, state, city })
            }
          />
        );
      case 3:
        return (
          <ProfileCompletionForm
            profileData={formData.profileCompletion}
            onProfileChange={(profileCompletion) =>
              setFormData({ ...formData, profileCompletion })
            }
          />
        );
      case 4:
        return (
          <CategorySelection
            selectedCategories={formData.businessCategories}
            onCategoriesChange={(categories) =>
              setFormData({ ...formData, businessCategories: categories })
            }
          />
        );
      default:
        return null;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      Toast.show({
        type: "error",
        text1: "Failed to logout. Please try again.",
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#ffffff" }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.stepCounterContainer}>
            <Text style={[styles.stepCounter, { color: COLORS.gray600 }]}>
              Step {currentStep} of {totalSteps}
            </Text>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              {currentStep > 1 && (
                <TouchableOpacity
                  style={[
                    styles.backButton,
                    { backgroundColor: COLORS.gray100, marginRight: 8 },
                  ]}
                  onPress={handleBack}
                  activeOpacity={0.7}
                >
                  <View style={styles.backButtonContent}>
                    <MaterialIcons
                      name="arrow-back"
                      size={16}
                      color={COLORS.primary}
                    />
                    <Text style={[styles.backText, { color: COLORS.primary }]}>
                      Back
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: "#FEE2E2",
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#F87171",
                }}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <MaterialIcons name="logout" size={16} color="#DC2626" />
                <Text
                  style={{
                    color: "#DC2626",
                    fontWeight: "700",
                    marginLeft: 6,
                    fontSize: 14,
                  }}
                >
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Progress Bar */}}
        <View
          style={[
            styles.progressContainer,
            { backgroundColor: COLORS.gray200 },
          ]}
        >
          <View
            style={[
              styles.progressBar,
              {
                backgroundColor: COLORS.primary,
                width: `${progressPercentage}%`,
              },
            ]}
          />
        </View>
        <Text style={[styles.stepTitle, { color: COLORS.dark }]}>
          {stepTitles[currentStep]}
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: "#ffffff" }]}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            {
              backgroundColor:
                canProceedToNext() && !isSubmitting ? "#2563EB" : "#64748B",
              borderWidth: canProceedToNext() && !isSubmitting ? 0 : 2,
              borderColor:
                canProceedToNext() && !isSubmitting ? "transparent" : "#475569",
              shadowColor:
                canProceedToNext() && !isSubmitting ? "#2563EB" : "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: canProceedToNext() && !isSubmitting ? 0.3 : 0.2,
              shadowRadius: 4,
              elevation: canProceedToNext() && !isSubmitting ? 4 : 3,
            },
          ]}
          onPress={handleNext}
          disabled={!canProceedToNext() || isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#ffffff" size="small" />
              <Text
                style={[
                  styles.nextButtonText,
                  { color: "#ffffff", marginLeft: 8 },
                ]}
              >
                Completing...
              </Text>
            </View>
          ) : (
            <View style={styles.buttonContent}>
              <Text
                style={[
                  styles.nextButtonText,
                  {
                    color: "#ffffff",
                    fontWeight: canProceedToNext() ? "700" : "600",
                  },
                ]}
              >
                {currentStep === totalSteps ? "Complete Profile" : "Next"}
              </Text>
              <MaterialIcons
                name={
                  currentStep === totalSteps ? "check-circle" : "arrow-forward"
                }
                size={20}
                color="#ffffff"
                style={{ marginLeft: 8 }}
              />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: "#ffffff",
  },
  headerTop: {
    paddingVertical: 12,
  },
  stepCounterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2563EB30",
  },
  backButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  backText: {
    fontSize: 14,
    fontWeight: "600",
  },
  stepCounter: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressContainer: {
    height: 6,
    borderRadius: 3,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 100,
  },
  nextButton: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    width: "100%",
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default OnboardingFlow;
