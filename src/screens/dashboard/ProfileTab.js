import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useTheme } from "../../constants/Theme";
import { useAuth } from "../../context/AuthContext";

const ProfileTab = ({ navigation }) => {
  const { COLORS, SIZES } = useTheme();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data based on the schema - replace with actual user data
  const userData = {
    id: "user123",
    email: "farmer@example.com",
    name: "John Farmer",
    role: "FARMER",
    state: "Punjab",
    city: "Lahore",
    businessCategories: ["Rice", "Wheat", "Organic"],
    profileCompleted: 85,
    accountType: "Premium",
    businessAddress: "123 Farm Street, Agricultural District",
    businessRole: "Owner",
    companyName: "Green Valley Farms",
    companyPicture:
      "https://ui-avatars.com/api/?name=Green+Valley&background=10b981&color=fff&size=200",
    personalLocation: "Lahore, Punjab",
    personalName: "John Farmer",
    personalProfilePic:
      "https://ui-avatars.com/api/?name=John+Farmer&background=6366f1&color=fff&size=200",
    whatsapp: "+92 300 1234567",
    whatsappVerified: true,
    businessName: "Green Valley Farms",
    totalProducts: 12,
    totalSales: 45670,
    rating: 4.8,
    totalOrders: 28,
    joinDate: "2023-01-15",
    ...user, // Merge with actual user data
  };

  const handleSignOut = async () => {
    try {
      console.log("triggered");
      await logout();
    } catch (error) {
      console.error("Sign out error:", error);
      Toast.show({
        type: "error",
        text1: "Sign Out Failed",
        text2: "Failed to sign out. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    navigation.navigate("EditProfile", { userData });
  };

  const quickActions = [
    {
      id: "edit",
      icon: "✏️",
      title: "Edit Profile",
      color: COLORS.primary600,
      onPress: handleEditProfile,
    },
  ];

  const menuSections = [
    {
      title: "Account & Business",
      items: [
        {
          id: "personal",
          icon: "👤",
          title: "Personal Information",
          subtitle: `${userData.personalName || "Not set"} • ${
            userData.email || "No email"
          }`,
          rightText: "",
          onPress: () => navigation.navigate("PersonalInfo"),
        },
        {
          id: "business",
          icon: "🏢",
          title: "Business Profile",
          subtitle: `${userData.businessName || "Not set"} • ${
            userData.businessRole || "Not set"
          }`,
          rightText: userData.whatsappVerified ? "✓ Verified" : "Pending",
        },
        {
          id: "location",
          icon: "�",
          title: "Location & Address",
          subtitle: `${userData.city}, ${userData.state}`,
          rightText: "",
          onPress: () => navigation.navigate("LocationSettings"),
        },
      ],
    },
    {
      title: "Business Operations",
      items: [
        {
          id: "products",
          icon: "�",
          title: "My Products",
          subtitle: `${userData.totalProducts} active listings`,
          rightText: "Manage",
          onPress: () => navigation.navigate("MyProducts"),
        },

        {
          id: "categories",
          icon: "🏷️",
          title: "Business Categories",
          subtitle: userData.businessCategories?.join(", ") || "Not set",
          rightText: userData.businessCategories?.length || "0",
          onPress: () => navigation.navigate("Categories"),
        },
      ],
    },
    {
      title: "App Settings",
      items: [
        {
          id: "notifications",
          icon: "�",
          title: "Notifications",
          subtitle: "Push notifications and alerts",
          rightText: "On",
          onPress: () => navigation.navigate("NotificationSettings"),
        },
      ],
    },
  ];

  const stats = [
    {
      label: "Products",
      value: userData.totalProducts.toString(),
      icon: "📦",
      color: COLORS.primary600,
      change: "+2 this month",
    },

    {
      label: "Rating",
      value: userData.rating.toString(),
      icon: "⭐",
      color: COLORS.warning500,
      change: "Excellent",
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.gray50 }]}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary600} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <View
          style={[
            styles.headerGradient,
            { backgroundColor: COLORS.primary600 },
          ]}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <Text style={styles.headerTitle}>My Profile</Text>
            </View>

            {/* Profile Card in Header */}
            <View style={styles.profileHeaderCard}>
              <View style={styles.profileImageSection}>
                <Image
                  source={{
                    uri: userData.personalProfilePic || userData.companyPicture,
                  }}
                  style={styles.profileAvatar}
                />
                <TouchableOpacity style={styles.cameraButton}>
                  <Text style={styles.cameraIcon}>📷</Text>
                </TouchableOpacity>

                {/* Account Type Badge */}
                <View
                  style={[
                    styles.accountTypeBadge,
                    { backgroundColor: COLORS.warning500 },
                  ]}
                >
                  <Text style={styles.accountTypeText}>
                    {userData.accountType}
                  </Text>
                </View>
              </View>

              <View style={styles.profileHeaderInfo}>
                <Text style={styles.profileHeaderName}>
                  {userData.personalName || userData.businessName}
                </Text>
                <Text style={styles.profileHeaderRole}>
                  {userData.businessRole} at {userData.businessName}
                </Text>

                <View style={styles.locationRow}>
                  <Text style={styles.locationIcon}>�</Text>
                  <Text style={styles.locationText}>
                    {userData.city}, {userData.state}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.quickActionCard,
                  { backgroundColor: COLORS.white },
                ]}
                onPress={action.onPress}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: action.color + "20" },
                  ]}
                >
                  <Text style={styles.quickActionEmoji}>{action.icon}</Text>
                </View>
                <Text style={[styles.quickActionTitle, { color: COLORS.dark }]}>
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>
            Business Overview
          </Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View
                key={index}
                style={[
                  styles.modernStatCard,
                  { backgroundColor: COLORS.white },
                ]}
              >
                <View style={styles.statCardHeader}>
                  <View
                    style={[
                      styles.statIconContainer,
                      { backgroundColor: stat.color + "20" },
                    ]}
                  >
                    <Text style={styles.statCardIcon}>{stat.icon}</Text>
                  </View>
                  <Text style={[styles.statCardValue, { color: stat.color }]}>
                    {stat.value}
                  </Text>
                </View>
                <Text style={[styles.statCardLabel, { color: COLORS.dark }]}>
                  {stat.label}
                </Text>
                <Text
                  style={[styles.statCardChange, { color: COLORS.gray600 }]}
                >
                  {stat.change}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>
              {section.title}
            </Text>
            <View style={[styles.menuCard, { backgroundColor: COLORS.white }]}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.modernMenuItem,
                    itemIndex !== section.items.length - 1 &&
                      styles.menuItemBorder,
                  ]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemContent}>
                    <View style={styles.menuItemLeft}>
                      <View
                        style={[
                          styles.menuItemIconContainer,
                          { backgroundColor: COLORS.gray100 },
                        ]}
                      >
                        <Text style={styles.menuItemIcon}>{item.icon}</Text>
                      </View>
                      <View style={styles.menuItemTextContainer}>
                        <Text
                          style={[styles.menuItemTitle, { color: COLORS.dark }]}
                        >
                          {item.title}
                        </Text>
                        <Text
                          style={[
                            styles.menuItemSubtitle,
                            { color: COLORS.gray600 },
                          ]}
                        >
                          {item.subtitle}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.menuItemRight}>
                      <Text
                        style={[
                          styles.menuItemRightText,
                          { color: COLORS.gray500 },
                        ]}
                      >
                        {item.rightText}
                      </Text>
                      <Text
                        style={[
                          styles.menuItemArrow,
                          { color: COLORS.gray400 },
                        ]}
                      >
                        ›
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out Section */}
        <View style={styles.signOutSection}>
          <TouchableOpacity
            style={[
              styles.modernSignOutButton,
              {
                backgroundColor: COLORS.error50,
                borderColor: COLORS.error200,
              },
            ]}
            onPress={handleSignOut}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.signOutButtonIcon}>🚪</Text>
            <Text
              style={[styles.signOutButtonText, { color: COLORS.error600 }]}
            >
              {isLoading ? "Signing Out..." : "Sign Out"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfoSection}>
          <Text style={[styles.appVersion, { color: COLORS.gray500 }]}>
            Aarath Agricultural Marketplace v1.0.0
          </Text>
          <Text style={[styles.joinDate, { color: COLORS.gray400 }]}>
            Member since{" "}
            {new Date(userData.joinDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header Gradient Section
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  settingsIcon: {
    fontSize: 20,
  },

  // Profile Header Card
  profileHeaderCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  profileImageSection: {
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cameraIcon: {
    fontSize: 16,
  },
  accountTypeBadge: {
    position: "absolute",
    top: -8,
    right: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  accountTypeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
  },
  profileHeaderInfo: {
    alignItems: "center",
  },
  profileHeaderName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
    textAlign: "center",
  },
  profileHeaderRole: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 12,
    textAlign: "center",
  },
  verificationRow: {
    marginBottom: 8,
  },
  verificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  verificationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  verificationText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  locationText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },

  // Profile Completion
  completionCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  completionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  completionPercentage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  completionSubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },

  // Quick Actions
  quickActionsContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 8,
  },
  quickActionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: "23%",
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionEmoji: {
    fontSize: 20,
  },
  quickActionTitle: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },

  // Stats Section
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  modernStatCard: {
    width: "48%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statCardIcon: {
    fontSize: 18,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statCardLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  statCardChange: {
    fontSize: 12,
  },

  // Menu Sections
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  menuCard: {
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  modernMenuItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuItemIcon: {
    fontSize: 20,
  },
  menuItemTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemRightText: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
  },
  menuItemArrow: {
    fontSize: 18,
    fontWeight: "bold",
  },

  // Sign Out Section
  signOutSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  modernSignOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  signOutButtonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },

  // App Info
  appInfoSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  appVersion: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 12,
  },
});

export default ProfileTab;
