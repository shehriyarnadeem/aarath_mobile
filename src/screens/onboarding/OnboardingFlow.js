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
import { useAuth } from "../../context/AuthContext";

// Import onboarding components
import RoleSelection from "../onboarding/components/RoleSelection";
import LocationSelection from "../onboarding/components/LocationSelection";
import WhatsappVerification from "../onboarding/components/WhatsappVerification";
import ProfileCompletionForm from "../onboarding/components/ProfileCompletionForm";
import CategorySelection from "../onboarding/components/CategorySelection";

const OnboardingFlow = ({ navigation }) => {
  const { COLORS, SIZES } = useTheme();
  const { updateProfile, completeOnboarding, user } = useAuth();

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
    1: "WhatsApp Verification",
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
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Prepare the final data for submission
      const profileData = {
        whatsapp: formData.whatsapp,
        role: formData.role,
        state: formData.state,
        city: formData.city,
        businessCategories: formData.businessCategories,
        businessName: formData.profileCompletion.businessName,
        email: formData.profileCompletion.email,
        onboardingCompleted: true,
      };

      const result = await updateProfile(profileData);

      if (result.success) {
        // Mark onboarding as completed
        await completeOnboarding();

        Alert.alert(
          "Welcome to Aarath!",
          "Your profile has been completed successfully.",
          [
            {
              text: "Continue",
              onPress: () => navigation.replace("Marketplace"),
            },
          ]
        );
      } else {
        Alert.alert("Error", result.error || "Failed to complete profile");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to submit profile. Please try again.");
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
          {currentStep > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={[styles.backText, { color: COLORS.primary }]}>
                ← Back
              </Text>
            </TouchableOpacity>
          )}

          <Text style={[styles.stepCounter, { color: COLORS.gray500 }]}>
            Step {currentStep} of {totalSteps}
          </Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 4,
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
