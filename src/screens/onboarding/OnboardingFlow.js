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
} from "react-native";
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
  const { updateUserProfile, user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
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

  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const stepTitles = {
    1: "Phone Verification",
    2: "Select Your Role",
    3: "Choose Location",
    4: "Business Categories",
    5: "Complete Profile",
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.whatsappVerified;
      case 2:
        return formData.role !== "";
      case 3:
        return formData.state !== "" && formData.city !== "";
      case 4:
        return formData.businessCategories.length > 0;
      case 5:
        return formData.profileCompletion.businessName !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceedToNext()) {
      Alert.alert(
        "Required",
        "Please complete all required fields before proceeding."
      );
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
      if (countStep === 1) {
        setFormData({
          whatsapp: "",
          whatsappVerified: false,
        });
      }
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
      };

      const response = await apiClient.user.onboardingComplete(payload);
      console.log("Onboarding response:", response);
      if (response && response.token) {
        await signInWithCustomToken(auth, response.token); // Refresh session
        updateUserProfile(response.user);
        navigation.navigate("/Marketplace");
      } else if (response?.error) {
        console.log("Onboarding error response:", response);
        Toast.show({
          text1: response.error?.message,
          type: "error",
        });
      }
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
          <WhatsappVerification formData={formData} setFormData={setFormData} />
        );
      case 2:
        return (
          <RoleSelection
            selectedRole={formData.role}
            onRoleSelect={(role) => setFormData({ ...formData, role })}
          />
        );
      case 3:
        return (
          <LocationSelection
            selectedState={formData.state}
            selectedCity={formData.city}
            onLocationSelect={(state, city) =>
              setFormData({ ...formData, state, city })
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
      case 5:
        return (
          <ProfileCompletionForm
            profileData={formData.profileCompletion}
            onProfileChange={(profileCompletion) =>
              setFormData({ ...formData, profileCompletion })
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.white }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={[styles.stepCounter, { color: COLORS.gray500 }]}>
              Step {currentStep} of {totalSteps}
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={[styles.backText, { color: COLORS.primary }]}>
                  ← Back
                </Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
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
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            {
              backgroundColor:
                canProceedToNext() && !isSubmitting
                  ? COLORS.primary
                  : COLORS.gray300,
            },
          ]}
          onPress={handleNext}
          disabled={!canProceedToNext() || isSubmitting}
        >
          <Text
            style={[
              styles.nextButtonText,
              {
                color:
                  canProceedToNext() && !isSubmitting
                    ? COLORS.white
                    : COLORS.gray500,
              },
            ]}
          >
            {isSubmitting
              ? "Completing..."
              : currentStep === totalSteps
              ? "Complete Profile"
              : "Next"}
          </Text>
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
  },
  headerTop: {
    alignItems: "center",
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    marginTop: 10,
  },
  backText: {
    fontSize: 16,
    fontWeight: "500",
  },
  stepCounter: {
    fontSize: 14,
    fontWeight: "500",
  },
  progressContainer: {
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
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
  },
  nextButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default OnboardingFlow;
