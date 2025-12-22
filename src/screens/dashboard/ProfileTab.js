import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTheme } from "../../constants/Theme";
import { useAuth } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const ProfileTab = ({ navigation }) => {
  const { COLORS, SIZES } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Logout Failed", "Failed to logout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleSignup = () => {
    navigation.navigate("Signup");
  };

  // If user is not authenticated, show login prompt
  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: COLORS.background || COLORS.gray50 },
        ]}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background || COLORS.gray50}
        />

        <View style={styles.unauthenticatedContainer}>
          <View
            style={[styles.loginPromptCard, { backgroundColor: COLORS.white }]}
          >
            <Image
              source={require("../../../assets/logo.png")}
              style={{ width: 80, height: 80, marginBottom: 16 }}
              resizeMode="contain"
            />

            <Text
              style={[
                styles.welcomeSubtitle,
                { color: COLORS.textSecondary || "#6b7280" },
              ]}
            >
              Join Pakistan's leading agricultural marketplace to buy and sell
              quality products.
            </Text>

            <View style={styles.authButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: COLORS.primary || "#166534" },
                ]}
                onPress={handleLogin}
              >
                <Ionicons name="log-in-outline" size={20} color="white" />
                <Text style={styles.primaryButtonText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  {
                    borderColor: COLORS.primary || "#166534",
                    backgroundColor: "transparent",
                  },
                ]}
                onPress={handleSignup}
              >
                <Ionicons
                  name="person-add-outline"
                  size={20}
                  color={COLORS.primary || "#166534"}
                />
                <Text
                  style={[
                    styles.secondaryButtonText,
                    { color: COLORS.primary || "#166534" },
                  ]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.featuresContainer}>
              <Text
                style={[
                  styles.featuresTitle,
                  { color: COLORS.textPrimary || "#1f2937" },
                ]}
              >
                What you can do after logging in:
              </Text>

              {[
                {
                  icon: "storefront-outline",
                  text: "Manage your products and listings",
                },

                {
                  icon: "settings-outline",
                  text: "Customize your account settings",
                },
              ].map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons
                    name={feature.icon}
                    size={20}
                    color={COLORS.primary || "#166534"}
                    style={styles.featureIcon}
                  />
                  <Text
                    style={[
                      styles.featureText,
                      { color: COLORS.textSecondary || "#6b7280" },
                    ]}
                  >
                    {feature.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Use actual user data with fallbacks for authenticated users
  const userData = {
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    city: user?.city || "City",
    state: user?.state || "State",
    whatsapp: user?.whatsapp || "+92 300 0000000",
    whatsappVerified: user?.whatsappVerified || false,
    totalProducts: user?.totalProducts || 0,
    rating: user?.rating || 4.5,
    personalProfilePic:
      user?.personalProfilePic ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user?.name || "User"
      )}&background=166534&color=fff&size=200`,
    ...user,
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: COLORS.background || COLORS.gray50 },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background || COLORS.gray50}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Profile Header */}
        <View
          style={[styles.profileHeader, { backgroundColor: COLORS.textWhite }]}
        >
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: userData.personalProfilePic,
              }}
              resizeMode="cover"
              style={styles.profileImage}
            />
          </View>

          <View style={styles.profileInfo}>
            <Text
              style={[
                styles.profileName,
                { color: COLORS.dark || COLORS.textPrimary },
              ]}
            >
              {userData.name}
            </Text>
            <Text
              style={[
                styles.userEmail,
                { color: COLORS.gray || COLORS.textSecondary },
              ]}
            >
              {userData.email}
            </Text>
            <View style={styles.locationContainer}>
              <Ionicons
                name="location-outline"
                size={14}
                color={COLORS.gray || COLORS.textMuted}
              />
              <Text
                style={[
                  styles.locationText,
                  { color: COLORS.gray || COLORS.textMuted },
                ]}
              >
                {userData.city}, {userData.state}
              </Text>
              {userData.whatsappVerified && (
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={COLORS.success || "#10B981"}
                  style={{ marginLeft: 8 }}
                />
              )}
            </View>
          </View>
        </View>
        {/* Quick Stats */}
        <View style={[styles.statsCard, { backgroundColor: COLORS.white }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: COLORS.primary600 }]}>
              {userData.totalProducts || 0}
            </Text>
            <Text
              style={[
                styles.statLabel,
                { color: COLORS.textSecondary || COLORS.textSecondary },
              ]}
            >
              Products
            </Text>
          </View>
          <View
            style={[
              styles.statDivider,
              { backgroundColor: COLORS.lightGray || COLORS.gray200 },
            ]}
          />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: COLORS.primary600 }]}>
              {userData.rating || "4.5"}
            </Text>
            <Text
              style={[
                styles.statLabel,
                { color: COLORS.gray || COLORS.textSecondary },
              ]}
            >
              Rating
            </Text>
          </View>
          <View
            style={[
              styles.statDivider,
              { backgroundColor: COLORS.lightGray || COLORS.gray200 },
            ]}
          />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: COLORS.primary600 }]}>
              {userData.whatsappVerified ? "✓" : "✗"}
            </Text>
            <Text
              style={[
                styles.statLabel,
                { color: COLORS.gray || COLORS.textSecondary },
              ]}
            >
              Verified
            </Text>
          </View>
        </View>

        {/* Products Section */}
        <View style={[styles.section, { backgroundColor: COLORS.white }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("ProductsManagement")}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: COLORS.primary + "15" },
              ]}
            >
              <Ionicons
                name="cube-outline"
                size={22}
                color={COLORS.primary || COLORS.textPrimary}
              />
            </View>
            <View style={styles.menuContent}>
              <Text
                style={[
                  styles.menuTitle,
                  { color: COLORS.dark || COLORS.textPrimary },
                ]}
              >
                Manage Ads
              </Text>
              <Text
                style={[
                  styles.menuSubtitle,
                  { color: COLORS.gray || COLORS.textSecondary },
                ]}
              >
                View and manage your listings
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.gray || COLORS.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={[styles.section, { backgroundColor: COLORS.white }]}>
          <Text
            style={[
              styles.sectionTitle,
              { color: COLORS.dark || COLORS.textPrimary },
            ]}
          >
            Account
          </Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <View style={[styles.iconContainer]}>
              <Ionicons
                name="person-outline"
                size={25}
                color={COLORS.dark || COLORS.textPrimary}
              />
            </View>
            <View style={styles.menuContent}>
              <Text
                style={[
                  styles.menuTitle,
                  { color: COLORS.dark || COLORS.textPrimary },
                ]}
              >
                Edit Profile
              </Text>
              <Text
                style={[
                  styles.menuSubtitle,
                  { color: COLORS.gray || COLORS.textSecondary },
                ]}
              >
                Update your personal information
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.gray || COLORS.textMuted}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("AccountSettings")}
          >
            <View style={[styles.iconContainer]}>
              <Ionicons
                name="settings-outline"
                size={22}
                color={COLORS.dark || COLORS.textPrimary}
              />
            </View>
            <View style={styles.menuContent}>
              <Text
                style={[
                  styles.menuTitle,
                  { color: COLORS.dark || COLORS.textPrimary },
                ]}
              >
                Settings
              </Text>
              <Text
                style={[
                  styles.menuSubtitle,
                  { color: COLORS.gray || COLORS.textSecondary },
                ]}
              >
                Privacy, security, and preferences
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.gray || COLORS.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={[styles.section, { backgroundColor: COLORS.white }]}>
          <Text
            style={[
              styles.sectionTitle,
              { color: COLORS.dark || COLORS.textPrimary },
            ]}
          >
            Support
          </Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              console.log("Navigate to Help Center");
            }}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: "#F59E0B" + "15" },
              ]}
            >
              <Ionicons
                name="help-circle-outline"
                size={22}
                color={COLORS.dark || COLORS.textPrimary}
              />
            </View>
            <View style={styles.menuContent}>
              <Text
                style={[
                  styles.menuTitle,
                  { color: COLORS.dark || COLORS.textPrimary },
                ]}
              >
                Help Center
              </Text>
              <Text
                style={[
                  styles.menuSubtitle,
                  { color: COLORS.gray || COLORS.textSecondary },
                ]}
              >
                Get help with your account
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.gray || COLORS.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: COLORS.white,
              borderColor: COLORS.error || "#EF4444",
              borderWidth: 1,
            },
          ]}
          onPress={handleLogout}
          disabled={isLoading}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={COLORS.error || "#EF4444"}
          />
          <Text
            style={[styles.logoutText, { color: COLORS.error || "#EF4444" }]}
          >
            {isLoading ? "Logging out..." : "Logout"}
          </Text>
        </TouchableOpacity>

        {/* Footer spacing for new tab bar */}
        <View style={{ height: 140 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 45,
  },

  // Profile Header Styles
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    marginLeft: 4,
  },

  // Stats Card Styles
  statsCard: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    marginHorizontal: 15,
  },

  // Section Styles
  section: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    padding: 20,
    paddingBottom: 10,
  },

  // Menu Item Styles
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#f0f0f0",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
  },

  // Logout Button Styles
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  // Unauthenticated State Styles
  unauthenticatedContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  loginPromptCard: {
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  loginIcon: {
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  authButtonsContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 30,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "100%",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 2,
    width: "100%",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  featuresContainer: {
    width: "100%",
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});

export default ProfileTab;
