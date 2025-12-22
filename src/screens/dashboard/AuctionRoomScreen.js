import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
  FlatList,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { useTheme } from "../../constants/Theme";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const AuctionRoomScreen = ({ navigation, route }) => {
  const { COLORS } = useTheme();
  const { auction } = route.params;

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bidButtonScale = useRef(new Animated.Value(1)).current;

  // State
  const [timeRemaining, setTimeRemaining] = useState("");
  const [currentBid, setCurrentBid] = useState(
    auction.currentHighestBid || auction.startingBid
  );
  const [myBidAmount, setMyBidAmount] = useState("");
  const [participants, setParticipants] = useState(auction.participants || []);
  const [bids, setBids] = useState(auction.recentBids || []);
  const [isConnected, setIsConnected] = useState(true);
  const [myHighestBid, setMyHighestBid] = useState(0);
  const [selectedTab, setSelectedTab] = useState("bidding");

  // Simulate real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(auction.endTime);
      const diff = end - now;

      if (diff <= 0) {
        setTimeRemaining("ENDED");
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [auction.endTime]);

  // Pulse animation for live indicator
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim]);

  const handlePlaceBid = () => {
    const bidAmount = parseFloat(myBidAmount);
    const minBid = currentBid + auction.minBidIncrement;

    if (!bidAmount || bidAmount < minBid) {
      Alert.alert(
        "Invalid Bid",
        `Minimum bid amount is PKR ${minBid.toLocaleString()}`,
        [{ text: "OK" }]
      );
      return;
    }

    // Animate bid button
    Animated.sequence([
      Animated.timing(bidButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bidButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulate bid placement
    const newBid = {
      id: `bid-${Date.now()}`,
      bidderId: "current-user",
      bidderName: "You",
      amount: bidAmount,
      timestamp: new Date().toISOString(),
      isWinningBid: true,
    };

    setBids((prev) => [newBid, ...prev]);
    setCurrentBid(bidAmount);
    setMyHighestBid(Math.max(myHighestBid, bidAmount));
    setMyBidAmount("");

    Alert.alert(
      "Bid Placed!",
      `Your bid of PKR ${bidAmount.toLocaleString()} has been placed successfully.`,
      [{ text: "OK" }]
    );
  };

  const handleBuyNow = () => {
    Alert.alert(
      "Buy Now",
      `Purchase this item immediately for PKR ${auction.buyNowPrice?.toLocaleString()}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Buy Now",
          style: "default",
          onPress: () => {
            Alert.alert(
              "Success!",
              "You have successfully purchased this item!"
            );
            navigation.goBack();
          },
        },
      ]
    );
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const BidItem = ({ bid, index }) => (
    <View
      style={StyleSheet.flatten([
        styles.bidItem,
        {
          backgroundColor:
            bid.bidderName === "You" ? COLORS.primary50 : COLORS.white,
        },
      ])}
    >
      <View style={styles.bidHeader}>
        <View style={styles.bidderInfo}>
          <View
            style={StyleSheet.flatten([
              styles.bidderAvatar,
              {
                backgroundColor:
                  bid.bidderName === "You" ? COLORS.primary600 : COLORS.gray400,
              },
            ])}
          >
            <Text style={StyleSheet.flatten([styles.bidderInitial, { color: COLORS.white }])}>
              {bid.bidderName.charAt(0)}
            </Text>
          </View>
          <View style={styles.bidderDetails}>
            <Text style={StyleSheet.flatten([styles.bidderName, { color: COLORS.dark }])}>
              {bid.bidderName}
              {bid.isWinningBid && (
                <Text
                  style={StyleSheet.flatten([styles.winningBadge, { color: COLORS.success600 }])}
                >
                  {" "}
                  👑 Winning
                </Text>
              )}
            </Text>
            <Text style={StyleSheet.flatten([styles.bidTime, { color: COLORS.gray600 }])}>
              {formatTime(bid.timestamp)}
            </Text>
          </View>
        </View>
        <Text style={StyleSheet.flatten([styles.bidAmount, { color: COLORS.success600 }])}>
          PKR {bid.amount.toLocaleString()}
        </Text>
      </View>
    </View>
  );

  const ParticipantItem = ({ participant }) => (
    <View style={StyleSheet.flatten([styles.participantItem, { backgroundColor: COLORS.white }])}>
      <View
        style={StyleSheet.flatten([
                styles.participantAvatar,
                { backgroundColor: COLORS.primary600 },
              ])}
      >
        <Text style={StyleSheet.flatten([styles.participantInitial, { color: COLORS.white }])}>
          {participant.userName?.charAt(0) || "U"}
        </Text>
      </View>
      <View style={styles.participantInfo}>
        <Text style={StyleSheet.flatten([styles.participantName, { color: COLORS.dark }])}>
          {participant.userName}
          {participant.isWinner && (
            <Text style={StyleSheet.flatten([styles.winnerBadge, { color: COLORS.warning600 }])}>
              {" "}
              👑
            </Text>
          )}
        </Text>
        <Text style={StyleSheet.flatten([styles.participantStats, { color: COLORS.gray600 }])}>
          {participant.totalBidsPlaced} bids • Highest: PKR{" "}
          {participant.highestBidAmount?.toLocaleString() || "0"}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={StyleSheet.flatten([styles.container, { backgroundColor: COLORS.gray50 }])}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary600} />

      {/* Header */}
      <View style={StyleSheet.flatten([styles.header, { backgroundColor: COLORS.primary600 }])}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={StyleSheet.flatten([styles.backButtonText, { color: COLORS.white }])}>
            ← Exit
          </Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.liveIndicator}>
            <Animated.View
              style={StyleSheet.flatten([
                styles.liveIcon,
                {
                  backgroundColor: COLORS.error500,
                  transform: [{ scale: pulseAnim }],
                },
              ])}
            />
            <Text style={StyleSheet.flatten([styles.liveText, { color: COLORS.white }])}>
              LIVE AUCTION
            </Text>
          </View>
          <Text style={StyleSheet.flatten([styles.timerText, { color: COLORS.white }])}>
            ⏰ {timeRemaining}
          </Text>
        </View>

        <TouchableOpacity style={styles.participantsButton}>
          <Text style={StyleSheet.flatten([styles.participantsText, { color: COLORS.white }])}>
            👥 {participants.length}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Product Info */}
      <View style={StyleSheet.flatten([styles.productSection, { backgroundColor: COLORS.white }])}>
        <Image
          source={{ uri: auction.product.images[0] }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.productInfo}>
          <Text
            style={StyleSheet.flatten([styles.productTitle, { color: COLORS.dark }])}
            numberOfLines={2}
          >
            {auction.product.title}
          </Text>
          <Text style={StyleSheet.flatten([styles.productQuantity, { color: COLORS.gray600 }])}>
            📦 {auction.product.quantity} {auction.product.unit} • Serial: #
            {auction.product.serialNumber}
          </Text>
          <View style={styles.sellerInfo}>
            <Text style={StyleSheet.flatten([styles.sellerName, { color: COLORS.primary600 }])}>
              🏪 {auction.product.user.businessName}
            </Text>
            <Text style={StyleSheet.flatten([styles.sellerLocation, { color: COLORS.gray600 }])}>
              📍 {auction.product.user.city}, {auction.product.user.state}
            </Text>
          </View>
        </View>
      </View>

      {/* Current Bid Section */}
      <View
        style={StyleSheet.flatten([
                styles.currentBidSection,
                { backgroundColor: COLORS.success50 },
              ])}
      >
        <View style={styles.bidRow}>
          <View style={styles.currentBidInfo}>
            <Text
              style={StyleSheet.flatten([styles.currentBidLabel, { color: COLORS.success800 }])}
            >
              Current Highest Bid
            </Text>
            <Text
              style={StyleSheet.flatten([styles.currentBidAmount, { color: COLORS.success600 }])}
            >
              PKR {currentBid.toLocaleString()}
            </Text>
          </View>
        </View>

        {myHighestBid > 0 && (
          <View style={styles.myBidInfo}>
            <Text style={StyleSheet.flatten([styles.myBidText, { color: COLORS.primary600 }])}>
              💎 Your highest bid: PKR {myHighestBid.toLocaleString()}
            </Text>
          </View>
        )}
      </View>

      {/* Tab Navigation */}
      <View style={StyleSheet.flatten([styles.tabContainer, { backgroundColor: COLORS.white }])}>
        {[
          { key: "bidding", label: "Place Bid", icon: "💰" },
          { key: "bids", label: "Bid History", icon: "📊" },
          { key: "participants", label: "Participants", icon: "👥" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={StyleSheet.flatten([
              styles.tabItem,
              {
                backgroundColor:
                  selectedTab === tab.key ? COLORS.primary100 : "transparent",
                borderBottomColor:
                  selectedTab === tab.key ? COLORS.primary600 : "transparent",
              },
            ])}
            onPress={() => setSelectedTab(tab.key)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text
              style={StyleSheet.flatten([
                styles.tabLabel,
                {
                  color:
                    selectedTab === tab.key
                      ? COLORS.primary700
                      : COLORS.gray600,
                },
              ])}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {selectedTab === "bidding" && (
          <View
            style={StyleSheet.flatten([styles.biddingSection, { backgroundColor: COLORS.white }])}
          >
            <Text style={StyleSheet.flatten([styles.biddingTitle, { color: COLORS.dark }])}>
              💰 Place Your Bid
            </Text>

            <View style={styles.bidInputSection}>
              <Text style={StyleSheet.flatten([styles.minBidText, { color: COLORS.gray600 }])}>
                Minimum bid: PKR{" "}
                {(currentBid + auction.minBidIncrement).toLocaleString()}
              </Text>

              <View style={styles.bidInputContainer}>
                <Text style={StyleSheet.flatten([styles.currencySymbol, { color: COLORS.dark }])}>
                  PKR
                </Text>
                <TextInput
                  style={StyleSheet.flatten([
                styles.bidInput,
                { color: COLORS.dark, borderColor: COLORS.gray300 },
              ])}
                  placeholder={(
                    currentBid + auction.minBidIncrement
                  ).toString()}
                  placeholderTextColor={COLORS.gray400}
                  value={myBidAmount}
                  onChangeText={setMyBidAmount}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Animated.View style={{ transform: [{ scale: bidButtonScale }] }}>
              <TouchableOpacity
                style={StyleSheet.flatten([
                styles.bidButton,
                { backgroundColor: COLORS.primary600 },
              ])}
                onPress={handlePlaceBid}
              >
                <Text style={StyleSheet.flatten([styles.bidButtonText, { color: COLORS.white }])}>
                  🔨 Place Bid
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {auction.buyNowPrice && (
              <TouchableOpacity
                style={StyleSheet.flatten([
                styles.buyNowButton,
                { backgroundColor: COLORS.warning500 },
              ])}
                onPress={handleBuyNow}
              >
                <Text
                  style={StyleSheet.flatten([styles.buyNowButtonText, { color: COLORS.white }])}
                >
                  🏷️ Buy Now - PKR {auction.buyNowPrice.toLocaleString()}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {selectedTab === "bids" && (
          <FlatList
            data={bids}
            renderItem={({ item, index }) => (
              <BidItem bid={item} index={index} />
            )}
            keyExtractor={(item) => item.id}
            style={styles.bidsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>💰</Text>
                <Text style={StyleSheet.flatten([styles.emptyText, { color: COLORS.gray600 }])}>
                  No bids placed yet. Be the first to bid!
                </Text>
              </View>
            )}
          />
        )}

        {selectedTab === "participants" && (
          <FlatList
            data={participants}
            renderItem={({ item }) => <ParticipantItem participant={item} />}
            keyExtractor={(item) => item.id}
            style={styles.participantsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>👥</Text>
                <Text style={StyleSheet.flatten([styles.emptyText, { color: COLORS.gray600 }])}>
                  No participants yet. Join the auction!
                </Text>
              </View>
            )}
          />
        )}
      </View>

      {/* Connection Status */}
      <View
        style={StyleSheet.flatten([
          styles.connectionStatus,
          {
            backgroundColor: isConnected ? COLORS.success500 : COLORS.error500,
          },
        ])}
      >
        <Text style={StyleSheet.flatten([styles.connectionText, { color: COLORS.white }])}>
          {isConnected ? "🟢 Connected" : "🔴 Connection Lost"}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerCenter: {
    alignItems: "center",
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  liveIcon: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  participantsButton: {
    padding: 8,
  },
  participantsText: {
    fontSize: 14,
    fontWeight: "600",
  },

  // Product Section
  productSection: {
    flexDirection: "row",
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 12,
    marginBottom: 8,
  },
  sellerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sellerName: {
    fontSize: 12,
    fontWeight: "600",
  },
  sellerLocation: {
    fontSize: 11,
  },

  // Current Bid Section
  currentBidSection: {
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  bidRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  currentBidInfo: {
    flex: 1,
  },
  currentBidLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  currentBidAmount: {
    fontSize: 28,
    fontWeight: "bold",
  },
  reserveInfo: {
    alignItems: "flex-end",
  },
  reserveLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  reserveStatus: {
    fontSize: 12,
    fontWeight: "600",
  },
  myBidInfo: {
    marginTop: 12,
    padding: 8,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 8,
  },
  myBidText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  // Tab Navigation
  tabContainer: {
    flexDirection: "row",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  tabItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
  },

  // Tab Content
  tabContent: {
    flex: 1,
    width: screenWidth - 20,
  },

  // Bidding Section
  biddingSection: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  biddingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  bidInputSection: {
    marginBottom: 24,
  },
  minBidText: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  bidInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    width: screenWidth - 80,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
  },
  bidInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    paddingVertical: 16,
    textAlign: "center",
    width: screenWidth - 120,
  },
  quickBidButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  quickBidButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  quickBidText: {
    fontSize: 14,
    fontWeight: "600",
  },
  bidButton: {
    width: screenWidth - 80,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bidButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buyNowButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buyNowButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  // Bids List
  bidsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bidItem: {
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  bidHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bidderInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  bidderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  bidderInitial: {
    fontSize: 14,
    fontWeight: "bold",
  },
  bidderDetails: {
    flex: 1,
  },
  bidderName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  winningBadge: {
    fontSize: 12,
    fontWeight: "bold",
  },
  bidTime: {
    fontSize: 11,
  },
  bidAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },

  // Participants List
  participantsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  participantItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  participantInitial: {
    fontSize: 16,
    fontWeight: "bold",
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  winnerBadge: {
    fontSize: 14,
  },
  participantStats: {
    fontSize: 12,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },

  // Connection Status
  connectionStatus: {
    position: "absolute",
    bottom: 20,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  connectionText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default AuctionRoomScreen;
