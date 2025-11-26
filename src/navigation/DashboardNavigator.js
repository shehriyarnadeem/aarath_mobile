import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useTheme } from "../constants/Theme";

// Import the tab screens
import MarketplaceTab from "../screens/dashboard/MarketplaceTab";
import MyProductsTab from "../screens/dashboard/MyProductsTab";
import AuctionTab from "../screens/dashboard/AuctionTab";
import ProfileTab from "../screens/dashboard/ProfileTab";
import AddProductScreen from "../screens/dashboard/AddProductScreen";
import ProductDetailScreen from "../screens/dashboard/ProductDetailScreen";
import AuctionRoomScreen from "../screens/dashboard/AuctionRoomScreen";
import AuctionTermsScreen from "../screens/dashboard/AuctionTermsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  const { COLORS } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.gray200,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: COLORS.primary600,
        tabBarInactiveTintColor: COLORS.gray500,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tab.Screen
        name="Marketplace"
        component={MarketplaceTab}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons 
              name="storefront" 
              size={focused ? 26 : 24} 
              color={color} 
            />
          ),
        }}
      />

      <Tab.Screen
        name="My Products"
        component={MyProductsTab}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name="cube-outline" 
              size={focused ? 26 : 24} 
              color={color} 
            />
          ),
        }}
      />

      <Tab.Screen
        name="Auctions"
        component={AuctionTab}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons 
              name="gavel" 
              size={focused ? 26 : 24} 
              color={color} 
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileTab}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name="person-outline" 
              size={focused ? 26 : 24} 
              color={color} 
            />
          ),
        }}
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
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name="AuctionTerms"
        component={AuctionRoomScreen}
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      /> */}
      <Stack.Screen
        name="AuctionRoom"
        component={AuctionRoomScreen}
        options={{
          headerShown: false,
          gestureEnabled: false, // Prevent swipe to dismiss during live auction
        }}
      />
    </Stack.Navigator>
  );
};

export default DashboardNavigator;
