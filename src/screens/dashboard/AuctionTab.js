import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Image,
  FlatList,
  Dimensions,
  Alert,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  AntDesign,
  FontAwesome,
} from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";

const { width: screenWidth } = Dimensions.get("window");

const AuctionTab = ({ navigation }) => {
  const { COLORS } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("live");
  const [auctions, setAuctions] = useState([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Sample auction data based on your schema
  const sampleAuctions = [
    {
      id: "auction-001",
      productId: "prod-001",
      startingBid: 10000,
      currentHighestBid: 15500,
      currentHighestBidderId: "user-456",
      winnerId: null,
      reservePrice: 12000,
      minBidIncrement: 500,
      startTime: "2024-11-26T10:00:00Z",
      endTime: "2024-11-26T16:00:00Z",
      status: "active",
      totalBids: 23,
      totalParticipants: 8,
      isReserveReached: true,
      buyNowPrice: 18000,
      closed: false,
      product: {
        serialNumber: 1001,
        userId: "user-123",
        category: "Rice",
        title: "Premium Basmati Rice - Export Quality",
        description:
          "High-quality premium Basmati rice with excellent grain length and aroma.",
        quantity: 1000,
        unit: "Kg",
        images: [
          "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&auto=format",
        ],
        price: 110.0,
        priceType: "Auction",
        environment: "AUCTION",
        user: {
          name: "Ahmed Rice Traders",
          businessName: "Premium Grains Co.",
          city: "Okara",
          state: "Punjab",
          whatsappVerified: true,
        },
      },
      participants: [
        {
          id: "part-001",
          userId: "user-456",
          userName: "Buyer One",
          totalBidsPlaced: 5,
          highestBidAmount: 15500,
          isWinner: false,
        },
        {
          id: "part-002",
          userId: "user-789",
          userName: "Buyer Two",
          totalBidsPlaced: 3,
          highestBidAmount: 14000,
          isWinner: false,
        },
      ],
      recentBids: [
        {
          id: "bid-001",
          bidderId: "user-456",
          bidderName: "Buyer One",
          amount: 15500,
          timestamp: "2024-11-26T14:45:00Z",
          isWinningBid: true,
        },
        {
          id: "bid-002",
          bidderId: "user-789",
          bidderName: "Buyer Two",
          amount: 15000,
          timestamp: "2024-11-26T14:30:00Z",
          isWinningBid: false,
        },
      ],
    },
    {
      id: "auction-002",
      productId: "prod-002",
      startingBid: 25000,
      currentHighestBid: 28000,
      currentHighestBidderId: "user-321",
      winnerId: null,
      reservePrice: 26000,
      minBidIncrement: 1000,
      startTime: "2024-11-26T12:00:00Z",
      endTime: "2024-11-28T18:00:00Z",
      status: "active",
      totalBids: 15,
      totalParticipants: 6,
      isReserveReached: true,
      buyNowPrice: 35000,
      closed: false,
      product: {
        serialNumber: 1002,
        userId: "user-234",
        category: "Wheat",
        title: "Organic Wheat Grade A - Certified",
        description:
          "Certified organic wheat grown without chemicals or pesticides.",
        quantity: 2000,
        unit: "Kg",
        images: [
          "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop&auto=format",
        ],
        price: 125.0,
        priceType: "Auction",
        environment: "AUCTION",
        user: {
          name: "Organic Farms Pakistan",
          businessName: "Green Valley Organics",
          city: "Faisalabad",
          state: "Punjab",
          whatsappVerified: true,
        },
      },
      participants: [
        {
          id: "part-003",
          userId: "user-321",
          userName: "Wheat Buyer",
          totalBidsPlaced: 7,
          highestBidAmount: 28000,
          isWinner: false,
        },
      ],
      recentBids: [
        {
          id: "bid-003",
          bidderId: "user-321",
          bidderName: "Wheat Buyer",
          amount: 28000,
          timestamp: "2024-11-26T15:20:00Z",
          isWinningBid: true,
        },
      ],
    },
    {
      id: "auction-003",
      productId: "prod-003",
      startingBid: 5000,
      currentHighestBid: null,
      currentHighestBidderId: null,
      winnerId: null,
      reservePrice: 6000,
      minBidIncrement: 250,
      startTime: "2024-11-26T18:00:00Z",
      endTime: "2024-11-27T10:00:00Z",
      status: "scheduled",
      totalBids: 0,
      totalParticipants: 0,
      isReserveReached: false,
      buyNowPrice: 8000,
      closed: false,
      product: {
        serialNumber: 1003,
        userId: "user-345",
        category: "Pulses",
        title: "Red Kidney Beans - Premium Quality",
        description:
          "Premium quality red kidney beans, rich in protein and fiber.",
        quantity: 500,
        unit: "Kg",
        images: [
          "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=600&h=400&fit=crop&auto=format",
        ],
        price: 450.0,
        priceType: "Auction",
        environment: "AUCTION",
        user: {
          name: "Health Grains Co.",
          businessName: "Nutrition Plus Trading",
          city: "Islamabad",
          state: "Federal",
          whatsappVerified: true,
        },
      },
      participants: [],
      recentBids: [],
    },
  ];

  // Filter auctions based on selected tab
  const filteredAuctions = sampleAuctions.filter((auction) => {
    switch (selectedTab) {
      case "live":
        return auction.status === "active";
      case "scheduled":
        return auction.status === "scheduled";
      case "completed":
        return auction.status === "completed";
      default:
        return true;
    }
  });

  // Calculate time remaining for auction
  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return "Ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    } else {
      return `${minutes}m left`;
    }
  };

  // Calculate time until start for scheduled auctions
  const getTimeUntilStart = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;

    if (diff <= 0) return "Starting soon";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `Starts in ${hours}h ${minutes}m`;
    } else {
      return `Starts in ${minutes}m`;
    }
  };

  const handleJoinAuction = (auction) => {
    navigation.navigate("AuctionRoom", { auction });
  };

  // Auction Card Component
  const AuctionCard = ({ auction }) => {
    const isLive = auction.status === "active";
    const isScheduled = auction.status === "scheduled";
    const currentBid = auction.currentHighestBid || auction.startingBid;

    return (
      <TouchableOpacity
        style={[styles.auctionCard, { backgroundColor: COLORS.white }]}
        activeOpacity={0.9}
        onPress={() => (isLive ? handleJoinAuction(auction) : null)}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: auction.product.images[0] }}
            style={styles.productImage}
            resizeMode="cover"
          />

          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isLive
                  ? "#ef4444"
                  : isScheduled
                  ? "#f59e0b"
                  : "#10b981",
              },
            ]}
          >
            <View style={styles.statusContent}>
              {isLive && (
                <Ionicons name="radio-button-on" size={12} color="#ffffff" />
              )}
              {isScheduled && (
                <MaterialIcons name="schedule" size={12} color="#ffffff" />
              )}
              {!isLive && !isScheduled && (
                <AntDesign name="checkcircle" size={12} color="#ffffff" />
              )}
              <Text style={styles.statusText}>
                {isLive ? " LIVE" : isScheduled ? " SCHEDULED" : " ENDED"}
              </Text>
            </View>
          </View>

          {/* Timer */}
          <View
            style={[styles.timerBadge, { backgroundColor: "rgba(0,0,0,0.8)" }]}
          >
            <Text style={[styles.timerText, { color: COLORS.white }]}>
              {isLive
                ? getTimeRemaining(auction.endTime)
                : isScheduled
                ? getTimeUntilStart(auction.startTime)
                : "Completed"}
            </Text>
          </View>
        </View>

        {/* Auction Info */}
        <View style={styles.auctionInfo}>
          {/* Product Title */}
          <Text
            style={[styles.productTitle, { color: COLORS.dark }]}
            numberOfLines={2}
          >
            {auction.product.title}
          </Text>

          {/* Seller Info */}
          <View style={styles.sellerRow}>
            <View
              style={[
                styles.sellerAvatar,
                { backgroundColor: COLORS.primary600 },
              ]}
            >
              <Text style={[styles.sellerInitial, { color: COLORS.white }]}>
                {auction.product.user.businessName?.charAt(0) || "S"}
              </Text>
            </View>
            <View style={styles.sellerInfo}>
              <Text
                style={[styles.sellerName, { color: COLORS.dark }]}
                numberOfLines={1}
              >
                {auction.product.user.businessName}
              </Text>
              <View style={styles.locationRow}>
                <Ionicons
                  name="location-outline"
                  size={12}
                  color={COLORS.gray600}
                />
                <Text
                  style={[styles.sellerLocation, { color: COLORS.gray600 }]}
                >
                  {auction.product.user.city}, {auction.product.user.state}
                </Text>
              </View>
            </View>
          </View>

          {/* Bid Information */}
          <View style={styles.bidSection}>
            <View style={styles.bidRow}>
              <View style={styles.currentBidContainer}>
                <Text style={[styles.bidLabel, { color: COLORS.gray600 }]}>
                  {auction.currentHighestBid ? "Current Bid" : "Starting Bid"}
                </Text>
                <Text style={[styles.bidAmount, { color: COLORS.success600 }]}>
                  PKR {currentBid.toLocaleString()}
                </Text>
              </View>
              <View style={styles.reserveContainer}>
                <Text style={[styles.reserveLabel, { color: COLORS.gray600 }]}>
                  Reserve Price
                </Text>
                <Text style={[styles.reserveAmount, { color: COLORS.dark }]}>
                  PKR {auction.reservePrice.toLocaleString()}
                </Text>
              </View>
            </View>

            {auction.buyNowPrice && (
              <View style={styles.buyNowContainer}>
                <View style={styles.buyNowRow}>
                  <MaterialIcons
                    name="local-offer"
                    size={14}
                    color={COLORS.warning600}
                  />
                  <Text
                    style={[styles.buyNowLabel, { color: COLORS.warning600 }]}
                  >
                    Buy Now: PKR {auction.buyNowPrice.toLocaleString()}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Auction Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: COLORS.primary600 }]}>
                {auction.totalParticipants}
              </Text>
              <Text style={[styles.statLabel, { color: COLORS.gray600 }]}>
                Bidders
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: COLORS.primary600 }]}>
                {auction.totalBids}
              </Text>
              <Text style={[styles.statLabel, { color: COLORS.gray600 }]}>
                Bids
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: COLORS.primary600 }]}>
                {auction.product.quantity}
              </Text>
              <Text style={[styles.statLabel, { color: COLORS.gray600 }]}>
                {auction.product.unit}
              </Text>
            </View>
          </View>

          {/* Reserve Status */}
          {auction.isReserveReached && (
            <View
              style={[
                styles.reserveReachedBadge,
                { backgroundColor: COLORS.success100 },
              ]}
            >
              <View style={styles.reserveReachedRow}>
                <AntDesign
                  name="checkcircle"
                  size={12}
                  color={COLORS.success700}
                />
                <Text
                  style={[
                    styles.reserveReachedText,
                    { color: COLORS.success700 },
                  ]}
                >
                  Reserve Price Met
                </Text>
              </View>
            </View>
          )}

          {/* Action Button */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: isLive
                  ? COLORS.primary600
                  : isScheduled
                  ? COLORS.warning500
                  : COLORS.gray400,
              },
            ]}
            onPress={() => handleJoinAuction(auction)}
            disabled={!isLive && !isScheduled}
          >
            <View style={styles.actionButtonContent}>
              {isLive && (
                <MaterialIcons name="gavel" size={16} color={COLORS.white} />
              )}
              {isScheduled && (
                <MaterialIcons
                  name="notification-add"
                  size={16}
                  color={COLORS.white}
                />
              )}
              {!isLive && !isScheduled && (
                <MaterialIcons
                  name="assessment"
                  size={16}
                  color={COLORS.white}
                />
              )}
              <Text style={[styles.actionButtonText, { color: COLORS.white }]}>
                {isLive
                  ? " Join Auction"
                  : isScheduled
                  ? " Set Reminder"
                  : " View Results"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.gray50 }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.gray50} />
      {/* Modern Marketplace-style Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: "#17414F",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 22,
            borderBottomWidth: 0,
            borderBottomColor: "transparent",
          },
        ]}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 26,
            fontWeight: "bold",
            marginBottom: 4,
            letterSpacing: 0.5,
          }}
        >
          Live Auction Marketplace
        </Text>
        <Text
          style={{
            color: "#B6F0E6",
            fontSize: 15,
            fontWeight: "bold",
            marginBottom: 18,
          }}
        >
          Connect directly with verified farmers across Pakistan. Bid on quality
          agricultural products in real-time auctions with transparent pricing.
        </Text>
        {/* Search Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#F3F6FB",
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 8,
            width: "100%",
            marginBottom: 18,
          }}
        >
          <Ionicons
            name="search"
            size={20}
            color="#A0AEC0"
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: "#A0AEC0", fontSize: 15, flex: 1 }}>
            Search products, categories...
          </Text>
        </View>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#7C3AED",
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 5,
                marginRight: 8,
              }}
            >
              <MaterialIcons
                name="star"
                size={14}
                color="#fff"
                style={{ marginRight: 4 }}
              />
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 13 }}>
                Sort: Featured
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#D1FAE5",
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 5,
                marginRight: 8,
              }}
            >
              <Ionicons
                name="location"
                size={14}
                color="#059669"
                style={{ marginRight: 4 }}
              />
              <Text
                style={{ color: "#059669", fontWeight: "bold", fontSize: 13 }}
              >
                Location
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FDE68A",
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 5,
              }}
            >
              <MaterialIcons
                name="attach-money"
                size={14}
                color="#F59E0B"
                style={{ marginRight: 4 }}
              />
              <Text
                style={{ color: "#F59E0B", fontWeight: "bold", fontSize: 13 }}
              >
                Price
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: COLORS.gray50,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.gray100,
        }}
      >
        {/* You can add more filter buttons here if needed */}
      </View>

      <FlatList
        data={filteredAuctions}
        renderItem={({ item }) => <AuctionCard auction={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.auctionsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              {selectedTab === "live" && (
                <MaterialIcons name="gavel" size={48} color={COLORS.gray400} />
              )}
              {selectedTab === "scheduled" && (
                <MaterialIcons
                  name="schedule"
                  size={48}
                  color={COLORS.gray400}
                />
              )}
              {selectedTab === "completed" && (
                <MaterialIcons
                  name="assessment"
                  size={48}
                  color={COLORS.gray400}
                />
              )}
            </View>
            <Text style={[styles.emptyTitle, { color: COLORS.dark }]}>
              No {selectedTab} auctions
            </Text>
            <Text style={[styles.emptyText, { color: COLORS.gray600 }]}>
              {selectedTab === "live"
                ? "All auctions have ended for today"
                : selectedTab === "scheduled"
                ? "No upcoming auctions scheduled"
                : "No completed auctions to show"}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerContent: {
    alignItems: "center",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: "center",
  },

  // Tab Navigation
  tabContainer: {
    paddingVertical: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
    position: "relative",
  },
  tabIcon: {
    marginRight: 8,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  tabBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },

  // Auctions List
  auctionsList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  auctionCard: {
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },

  // Image Container
  imageContainer: {
    position: "relative",
    height: 180,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    elevation: 2,
  },
  statusContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
  },
  timerBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timerText: {
    fontSize: 12,
    fontWeight: "bold",
  },

  // Auction Info
  auctionInfo: {
    padding: 16,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    lineHeight: 24,
  },

  // Seller Row
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sellerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  sellerInitial: {
    fontSize: 14,
    fontWeight: "bold",
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sellerLocation: {
    fontSize: 12,
    marginLeft: 4,
  },

  // Bid Section
  bidSection: {
    marginBottom: 16,
  },
  bidRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  currentBidContainer: {
    flex: 1,
    marginRight: 16,
  },
  bidLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  bidAmount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  reserveContainer: {
    flex: 1,
  },
  reserveLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  reserveAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  buyNowContainer: {
    marginTop: 8,
  },
  buyNowRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  buyNowLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },

  // Stats Row
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
  },

  // Reserve Status
  reserveReachedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  reserveReachedRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  reserveReachedText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },

  // Action Button
  actionButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  actionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
});

export default AuctionTab;
