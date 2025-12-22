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
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Use actual user data with fallbacks
  const userData = {
    name: user?.name || "User",
    businessName: user?.businessName || "Business",
    email: user?.email || "user@example.com",
    city: user?.city || "City",
    state: user?.state || "State",
    whatsapp: user?.whatsapp || "+92 300 0000000",
    whatsappVerified: user?.whatsappVerified || false,
    totalProducts: user?.totalProducts || 0,
    rating: user?.rating || 4.5,
    businessCategories: user?.businessCategories || [],
    personalProfilePic:
      user?.personalProfilePic ||
      "https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&size=200",
    ...user,
  };

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

  const handleFeatureAlert = (feature) => {
    Alert.alert(feature, "This feature will be available soon.");
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
        <View style={[styles.profileHeader, { backgroundColor: COLORS.white }]}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: userData.personalProfilePic }}
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
                styles.businessName,
                { color: COLORS.gray || COLORS.textSecondary },
              ]}
            >
              {userData.businessName}
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
            <Text
              style={[
                styles.statValue,
                { color: COLORS.dark || COLORS.textPrimary },
              ]}
            >
              {userData.totalProducts}
            </Text>
            <Text
              style={[
                styles.statLabel,
                { color: COLORS.gray || COLORS.textSecondary },
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
            <Text
              style={[
                styles.statValue,
                { color: COLORS.dark || COLORS.textPrimary },
              ]}
            >
              {userData.businessCategories?.length || 0}
            </Text>
            <Text
              style={[
                styles.statLabel,
                { color: COLORS.gray || COLORS.textSecondary },
              ]}
            >
              Categories
            </Text>
          </View>
          <View
            style={[
              styles.statDivider,
              { backgroundColor: COLORS.lightGray || COLORS.gray200 },
            ]}
          />
          <View style={styles.statItem}>
            <Text
              style={[
                styles.statValue,
                { color: COLORS.dark || COLORS.textPrimary },
              ]}
            >
              {userData.rating}★
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
        </View>

        {/* Business Management Section */}
        <View style={[styles.section, { backgroundColor: COLORS.white }]}>
          <Text
            style={[
              styles.sectionTitle,
              { color: COLORS.dark || COLORS.textPrimary },
            ]}
          >
            Business
          </Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleFeatureAlert("Business Categories")}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: (COLORS.primary || COLORS.primary600) + "15",
                },
              ]}
            >
              <Ionicons
                name="grid-outline"
                size={22}
                color={COLORS.primary || COLORS.primary600}
              />
            </View>
            <View style={styles.menuContent}>
              <Text
                style={[
                  styles.menuTitle,
                  { color: COLORS.dark || COLORS.textPrimary },
                ]}
              >
                Business Categories
              </Text>
              <Text
                style={[
                  styles.menuSubtitle,
                  { color: COLORS.gray || COLORS.textSecondary },
                ]}
              >
                Manage your business categories
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
            onPress={() => handleFeatureAlert("Products Management")}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: (COLORS.secondary || "#F59E0B") + "15" },
              ]}
            >
              <Ionicons
                name="cube-outline"
                size={22}
                color={COLORS.secondary || "#F59E0B"}
              />
            </View>
            <View style={styles.menuContent}>
              <Text
                style={[
                  styles.menuTitle,
                  { color: COLORS.dark || COLORS.textPrimary },
                ]}
              >
                Products
              </Text>
              <Text
                style={[
                  styles.menuSubtitle,
                  { color: COLORS.gray || COLORS.textSecondary },
                ]}
              >
                Manage your products and inventory
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
            onPress={() => handleFeatureAlert("Edit Profile")}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: "#6B7280" + "15" },
              ]}
            >
              <Ionicons name="person-outline" size={22} color="#6B7280" />
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
            onPress={() => handleFeatureAlert("Account Settings")}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: "#8B5CF6" + "15" },
              ]}
            >
              <Ionicons name="settings-outline" size={22} color="#8B5CF6" />
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
            onPress={() => handleFeatureAlert("Help Center")}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: "#F59E0B" + "15" },
              ]}
            >
              <Ionicons name="help-circle-outline" size={22} color="#F59E0B" />
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

        {/* Footer spacing */}
        <View style={{ height: 40 }} />
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
    paddingTop: 20,
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
  businessName: {
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
    alignItems: "center",
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
    height: "100%",
    marginHorizontal: 20,
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
});

export default ProfileTab;
