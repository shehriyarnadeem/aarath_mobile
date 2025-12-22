import React from "react";
import { Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useTheme } from "../constants/Theme";

// Import the tab screens
import HomeScreen from "../screens/dashboard/HomeScreen";
import AuctionsScreen from "../screens/dashboard/AuctionsScreen";
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

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          paddingBottom: 30,
          paddingTop: 15,
          paddingHorizontal: 15,
          height: 90,
          position: "absolute",
          bottom: 0,
          left: 15,
          right: 15,
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
              borderRadius: 30,
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
                  fontSize: 10,
                  fontWeight: focused ? "700" : "600",
                  marginTop: 4,
                  letterSpacing: 0.2,
                  textAlign: "center",
                }}
              >
                Home
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
                width: 60,
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
                  fontSize: 10,
                  fontWeight: focused ? "700" : "600",
                  marginTop: 4,
                  letterSpacing: 0.2,
                  textAlign: "center",
                }}
              >
                My Ads
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
                width: 65,
                height: 65,
                borderRadius: 32.5,
                backgroundColor: COLORS.primary,
                marginTop: -20, // Elevate the button above the tab bar
                borderWidth: 3,
                borderColor: "white",
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 12,
              }}
            >
              <Ionicons name="add" size={28} color="white" />
              <Text
                style={{
                  color: "white",
                  fontSize: 8,
                  fontWeight: "700",
                  marginTop: 1,
                  letterSpacing: 0.2,
                }}
              >
                SELL NOW
              </Text>
            </View>
          ),
          tabBarLabel: () => null, // Hide the default label
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); // Prevent default navigation
            navigation.navigate("AddProduct"); // Navigate to AddProduct screen instead
          },
        })}
      />

      <Tab.Screen
        name="Auctions"
        component={AuctionsScreen}
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
                name={focused ? "hammer" : "hammer-outline"}
                size={24}
                color={focused ? COLORS.primary : COLORS.gray}
              />
              <Text
                style={{
                  color: focused ? COLORS.primary : COLORS.gray + "80",
                  fontSize: 10,
                  fontWeight: focused ? "700" : "600",
                  marginTop: 4,
                  letterSpacing: 0.2,
                  textAlign: "center",
                }}
              >
                Auctions
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
                  fontSize: 10,
                  fontWeight: focused ? "700" : "600",
                  marginTop: 4,
                  letterSpacing: 0.2,
                  textAlign: "center",
                }}
              >
                More
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
