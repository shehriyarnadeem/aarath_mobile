import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const ProfileTab = ({ navigation }) => {
  const { COLORS, SIZES } = useTheme();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data - replace with actual user data
  const userData = {
    id: "user123",
    email: "farmer@example.com",
    name: "John Farmer",
    role: "FARMER",
    state: "Punjab",
    city: "Lahore",
    businessCategories: ["Rice", "Wheat", "Organic"],
    businessName: "Green Valley Farms",
    personalProfilePic:
      "https://ui-avatars.com/api/?name=John+Farmer&background=6366f1&color=fff&size=200",
    whatsapp: "+92 300 1234567",
    whatsappVerified: true,
    totalProducts: 12,
    rating: 4.8,
    joinDate: "2023-01-15",
    ...user,
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation handlers
  const navigateToBusinessCategories = () => {
    navigation.navigate("BusinessCategories");
  };

  const navigateToProducts = () => {
    navigation.navigate("ProductsManagement");
  };

  const navigateToEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const navigateToSettings = () => {
    navigation.navigate("AccountSettings");
  };

  const navigateToPreferences = () => {
    navigation.navigate("Preferences");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.background }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Profile Header */}
        {/* <View style={[styles.profileHeader, { backgroundColor: COLORS.white }]}>
          <View style={styles.profileImageContainer}>
            {/* <Image
              source={{ uri: userData.personalProfilePic }}
              style={styles.profileImage}
            /> */}
            <TouchableOpacity
              style={[
                styles.editImageButton,
                { backgroundColor: COLORS.primary },
              ]}
            >
              <Ionicons name="camera" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View> */}

          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: COLORS.dark }]}>
              {userData.name}
            </Text>
            <Text style={[styles.businessName, { color: COLORS.gray }]}>
              {userData.businessName}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={[styles.rating, { color: COLORS.dark }]}>
                {userData.rating}
              </Text>
              <Text style={[styles.joinDate, { color: COLORS.gray }]}>
                • Joined {new Date(userData.joinDate).getFullYear()}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={navigateToEditProfile}
          >
            <Ionicons name="pencil" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={[styles.statsCard, { backgroundColor: COLORS.white }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: COLORS.dark }]}>
              {userData.totalProducts}
            </Text>
            <Text style={[styles.statLabel, { color: COLORS.gray }]}>
              Products
            </Text>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: COLORS.lightGray }]}
          />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: COLORS.dark }]}>
              {userData.businessCategories.length}
            </Text>
            <Text style={[styles.statLabel, { color: COLORS.gray }]}>
              Categories
            </Text>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: COLORS.lightGray }]}
          />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: COLORS.dark }]}>4.8★</Text>
            <Text style={[styles.statLabel, { color: COLORS.gray }]}>
              Rating
            </Text>
          </View>
        </View>

        {/* Business Management Section */}
        <View style={[styles.section, { backgroundColor: COLORS.white }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>
            Business
          </Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={navigateToBusinessCategories}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: COLORS.primary + "15" },
              ]}
            >
              <Ionicons name="grid-outline" size={22} color={COLORS.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: COLORS.dark }]}>
                Business Categories
              </Text>
              <Text style={[styles.menuSubtitle, { color: COLORS.gray }]}>
                Manage your business categories
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={navigateToProducts}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: COLORS.secondary + "15" },
              ]}
            >
              <Ionicons
                name="cube-outline"
                size={22}
                color={COLORS.secondary}
              />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: COLORS.dark }]}>
                Products
              </Text>
              <Text style={[styles.menuSubtitle, { color: COLORS.gray }]}>
                Manage your products and inventory
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={[styles.section, { backgroundColor: COLORS.white }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>
            Account
          </Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={navigateToSettings}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: "#6B7280" + "15" },
              ]}
            >
              <Ionicons name="settings-outline" size={22} color="#6B7280" />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: COLORS.dark }]}>
                Account Settings
              </Text>
              <Text style={[styles.menuSubtitle, { color: COLORS.gray }]}>
                Privacy, security, and account details
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={navigateToPreferences}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: "#8B5CF6" + "15" },
              ]}
            >
              <Ionicons name="options-outline" size={22} color="#8B5CF6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: COLORS.dark }]}>
                Preferences
              </Text>
              <Text style={[styles.menuSubtitle, { color: COLORS.gray }]}>
                Notifications and app preferences
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={[styles.section, { backgroundColor: COLORS.white }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>
            Support
          </Text>

          <TouchableOpacity style={styles.menuItem}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: "#F59E0B" + "15" },
              ]}
            >
              <Ionicons name="help-circle-outline" size={22} color="#F59E0B" />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: COLORS.dark }]}>
                Help Center
              </Text>
              <Text style={[styles.menuSubtitle, { color: COLORS.gray }]}>
                Get help with your account
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: "#EF4444" + "15" },
              ]}
            >
              <Ionicons name="mail-outline" size={22} color="#EF4444" />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, { color: COLORS.dark }]}>
                Contact Support
              </Text>
              <Text style={[styles.menuSubtitle, { color: COLORS.gray }]}>
                Reach out to our support team
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: COLORS.white,
              borderColor: COLORS.error,
              borderWidth: 1,
            },
          ]}
          onPress={handleLogout}
          disabled={isLoading}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={[styles.logoutText, { color: COLORS.error }]}>
            {isLoading ? "Logging out..." : "Logout"}
          </Text>
        </TouchableOpacity>

        {/* Footer spacing */}
        <View style={{ height: 20 }} />
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
    position: "relative",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  businessName: {
    fontSize: 14,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  joinDate: {
    fontSize: 12,
    marginLeft: 8,
  },
  editButton: {
    padding: 8,
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
