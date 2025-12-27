import React from "react";
import { Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useTheme } from "../constants/Theme";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

// Import the tab screens
import HomeScreen from "../screens/dashboard/HomeScreen";
import CategoriesTab from "../screens/dashboard/CategoriesTab";
import FavoritesScreen from "../screens/dashboard/FavoritesScreen";
import MarketplaceScreen from "../screens/dashboard/MarketplaceTab";
import ProfileTab from "../screens/dashboard/ProfileTab";
import AddProductScreen from "../screens/dashboard/AddProductScreen";
import ProductDetailScreen from "../screens/dashboard/ProductDetailScreen";
import AuctionRoomScreen from "../screens/dashboard/AuctionRoomScreen";

// Import profile screens
import BusinessCategories from "../screens/dashboard/BusinessCategories";
import ProductsManagement from "../screens/dashboard/ProductsManagement";
import ProductEdit from "../screens/dashboard/ProductEdit";
import EditProfile from "../screens/dashboard/EditProfile";
import AccountSettings from "../screens/dashboard/AccountSettings";
import Preferences from "../screens/dashboard/Preferences";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  const { COLORS } = useTheme();
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          paddingBottom: 40,
          paddingTop: 15,
          paddingHorizontal: 10,
          height: 90,
          position: "absolute",
          bottom: 0,

          elevation: 30,
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: -15 },
          shadowOpacity: 0.15,
          shadowRadius: 35,
          borderRadius: 30,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.8)",
        },
        tabBarShowLabel: false, // We'll handle labels in custom icons
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 0,
        },
        tabBarBackground: () => (
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: 0,
              flex: 1,
              backdropFilter: "blur(20px)",
            }}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={({ focused }) => ({
          tabBarIcon: ({ color, focused, size }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 60,
                height: 55,
                paddingVertical: 4,
              }}
            >
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={focused ? COLORS.primary : COLORS.gray}
              />
              <Text
                style={{
                  color: focused ? COLORS.primary : COLORS.gray + "80",
                  fontSize: 12,
                  fontWeight: focused ? "600" : "400",
                  letterSpacing: 0.2,
                  textAlign: "center",
                }}
              >
                {t("tabs.home")}
              </Text>
            </View>
          ),
        })}
      />

      <Tab.Screen
        name="My_Ads"
        component={ProductsManagement}
        options={({ focused }) => ({
          tabBarIcon: ({ color, focused, size }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 70,
                height: 55,
                paddingVertical: 4,
              }}
            >
              <Ionicons
                name={focused ? "megaphone" : "megaphone-outline"}
                size={24}
                color={focused ? COLORS.primary : COLORS.gray}
              />
              <Text
                style={{
                  color: focused ? COLORS.primary : COLORS.gray + "80",
                  fontSize: 12,
                  fontWeight: focused ? "600" : "400",
                  letterSpacing: 0.2,
                  textAlign: "center",
                }}
              >
                {t("tabs.myAds")}
              </Text>
            </View>
          ),
        })}
      />

      <Tab.Screen
        name="SellNow"
        component={View} // Placeholder component, we'll handle navigation via listeners
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 75,
                height: 75,
                borderRadius: 35,
                backgroundColor: COLORS.primary,
                marginTop: -40, // Elevate the button above the tab bar
                borderWidth: 1,
                borderColor: "white",
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 12,
              }}
            >
              <Ionicons name="add" size={30} color="white" />
              <Text
                style={{
                  color: "white",
                  fontSize: 10,
                  fontWeight: "500",
                  marginTop: 1,
                  letterSpacing: 0.2,
                }}
              >
                {t("tabs.sellNow")}
              </Text>
            </View>
          ),
          tabBarLabel: () => null, // Hide the default label
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); // Prevent default navigation

            // Check if user is authenticated
            if (!isAuthenticated || !user) {
              // Show toast notification
              Toast.show({
                type: "info",
                text1: t("auth.loginRequired") || "Login Required",
                text2:
                  t("auth.loginToPublish") ||
                  "Please login to publish a product",
                position: "top",
                visibilityTime: 3000,
              });

              // Navigate to Profile (More) tab in the MainTabs navigator
              const parent = navigation.getParent();
              if (parent) {
                parent.navigate("Profile");
              }
            } else {
              // User is authenticated, navigate to AddProduct screen
              navigation.navigate("AddProduct");
            }
          },
        })}
      />

      <Tab.Screen
        name="Categories"
        component={CategoriesTab}
        options={({ focused }) => ({
          tabBarIcon: ({ color, focused, size }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 60,
                height: 55,
                paddingVertical: 4,
              }}
            >
              <Ionicons
                name={focused ? "grid" : "grid-outline"}
                size={24}
                color={focused ? COLORS.primary : COLORS.gray}
              />
              <Text
                style={{
                  color: focused ? COLORS.primary : COLORS.gray + "80",
                  fontSize: 12,
                  fontWeight: focused ? "600" : "400",
                  marginTop: 4,
                  letterSpacing: 0.2,
                  textAlign: "center",
                }}
              >
                {t("tabs.categories")}
              </Text>
            </View>
          ),
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileTab}
        options={({ focused }) => ({
          tabBarIcon: ({ color, focused, size }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 60,
                height: 55,
                paddingVertical: 4,
              }}
            >
              <Ionicons
                name={focused ? "list" : "list-outline"}
                size={24}
                color={focused ? COLORS.primary : COLORS.gray}
              />
              <Text
                style={{
                  color: focused ? COLORS.primary : COLORS.gray + "80",
                  fontSize: 12,
                  fontWeight: focused ? "600" : "400",
                  marginTop: 4,
                  letterSpacing: 0.2,
                  textAlign: "center",
                }}
              >
                {t("tabs.more")}
              </Text>
            </View>
          ),
        })}
      />
    </Tab.Navigator>
  );
};

const DashboardNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{
          headerShown: false,
          presentation: "modal", // This makes it slide up like a modal on iOS
        }}
      />

      <Stack.Screen
        name="Marketplace"
        component={MarketplaceScreen}
        options={{
          headerShown: false,
          presentation: "modal", // This makes it slide up like a modal on iOS
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AuctionRoom"
        component={AuctionRoomScreen}
        options={{
          headerShown: false,
          gestureEnabled: false, // Prevent swipe to dismiss during live auction
        }}
      />

      {/* Profile workflow screens */}
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerShown: false,
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="BusinessCategories"
        component={BusinessCategories}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProductsManagement"
        component={ProductsManagement}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProductEdit"
        component={ProductEdit}
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="AccountSettings"
        component={AccountSettings}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Preferences"
        component={Preferences}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default DashboardNavigator;
