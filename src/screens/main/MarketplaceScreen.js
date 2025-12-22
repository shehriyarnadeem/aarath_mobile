import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../constants/Theme";
import { useAuth } from "../../context/AuthContext";
const MarketplaceScreen = ({ navigation }) => {
  const { COLORS, SIZES } = useTheme();
  const { user, logout } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserData();
    loadAuctions();
  }, []);

  const loadUserData = async () => {
    try {
      const userName = user.name;
      const userPhone = user.phone;
      const businessName = user.businessName;
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const loadAuctions = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call to aarath_backend
      // const response = await apiClient.get('/auctions/active');
      // setAuctions(response.data);

      // Placeholder auction data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockAuctions = [
        {
          id: 1,
          title: "Premium Electronics Auction",
          description: "Latest smartphones and gadgets",
          currentBid: 15000,
          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          status: "active",
        },
        {
          id: 2,
          title: "Vintage Furniture Collection",
          description: "Antique wooden furniture pieces",
          currentBid: 25000,
          endTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
          status: "active",
        },
        {
          id: 3,
          title: "Art & Collectibles",
          description: "Rare paintings and collectible items",
          currentBid: 50000,
          endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
          status: "active",
        },
      ];
      setAuctions(mockAuctions);
    } catch (error) {
      console.error("Error loading auctions:", error);
      Alert.alert("Error", "Failed to load auctions");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAuctions();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          navigation.navigate("Login");
        },
      },
    ]);
  };

  const formatTimeRemaining = (endTime) => {
    const now = new Date();
    const diff = endTime - now;

    if (diff <= 0) return "Ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const renderAuctionCard = (auction) => (
    <TouchableOpacity
      key={auction.id}
      style={StyleSheet.flatten([styles.auctionCard, { borderColor: COLORS.light }])}
      onPress={() => {
        // TODO: Navigate to auction details screen
        Alert.alert("Auction", `Opening ${auction.title}...`);
      }}
    >
      <View style={styles.auctionHeader}>
        <Text style={StyleSheet.flatten([styles.auctionTitle, { color: COLORS.dark }])}>
          {auction.title}
        </Text>
        <View style={StyleSheet.flatten([styles.statusBadge, { backgroundColor: COLORS.success }])}>
          <Text style={StyleSheet.flatten([styles.statusText, { color: COLORS.white }])}>LIVE</Text>
        </View>
      </View>

      <Text style={StyleSheet.flatten([styles.auctionDescription, { color: COLORS.secondary }])}>
        {auction.description}
      </Text>

      <View style={styles.auctionFooter}>
        <View>
          <Text style={StyleSheet.flatten([styles.bidLabel, { color: COLORS.secondary }])}>
            Current Bid
          </Text>
          <Text style={StyleSheet.flatten([styles.bidAmount, { color: COLORS.primary }])}>
            {formatCurrency(auction.currentBid)}
          </Text>
        </View>

        <View style={styles.timeContainer}>
          <Text style={StyleSheet.flatten([styles.timeLabel, { color: COLORS.secondary }])}>
            Ends in
          </Text>
          <Text style={StyleSheet.flatten([styles.timeRemaining, { color: COLORS.danger }])}>
            {formatTimeRemaining(auction.endTime)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={StyleSheet.flatten([styles.header, { backgroundColor: COLORS.white }])}>
        <View>
          <Text style={StyleSheet.flatten([styles.welcomeText, { color: COLORS.secondary }])}>
            Welcome back,
          </Text>
          <Text style={StyleSheet.flatten([styles.userName, { color: COLORS.dark }])}>
            {user.name}
          </Text>
        </View>

        <TouchableOpacity
          style={StyleSheet.flatten([styles.logoutButton, { borderColor: COLORS.light }])}
          onPress={handleLogout}
        >
          <Text style={StyleSheet.flatten([styles.logoutText, { color: COLORS.danger }])}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={StyleSheet.flatten([styles.sectionTitle, { color: COLORS.dark }])}>
            Active Auctions
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={StyleSheet.flatten([styles.loadingText, { color: COLORS.secondary }])}>
                Loading auctions...
              </Text>
            </View>
          ) : auctions.length > 0 ? (
            auctions.map(renderAuctionCard)
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={StyleSheet.flatten([styles.emptyText, { color: COLORS.secondary }])}>
                No active auctions available
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  welcomeText: {
    fontSize: 14,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 6,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  auctionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  auctionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  auctionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  auctionDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  auctionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  bidLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  bidAmount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  timeContainer: {
    alignItems: "flex-end",
  },
  timeLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  timeRemaining: {
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
  },
});

export default MarketplaceScreen;
