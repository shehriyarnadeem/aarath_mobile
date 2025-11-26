import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
} from "react-native";
import { useTheme } from "../constants/Theme";

const AuctionTermsModal = ({
  visible,
  onClose,
  onAccept,
  auction,
  navigation,
}) => {
  const { COLORS } = useTheme();
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isScrolledToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isScrolledToBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAccept = () => {
    //     if (!hasScrolledToBottom) {
    //       Alert.alert(
    //         "Please Read Terms",
    //         "You must scroll to the bottom and read all terms and conditions before accepting.",
    //         [{ text: "OK", style: "default" }]
    //       );
    //       return;
    //     }

    //     onAccept();
    //     onClose();
    // Navigate to auction room
    navigation.navigate("AuctionRoom", { auction });
  };

  const handleDecline = () => {
    Alert.alert(
      "Exit Auction",
      "Are you sure you want to decline the terms and exit?",
      [
        { text: "Stay", style: "cancel" },
        {
          text: "Exit",
          style: "destructive",
          onPress: () => onClose(),
        },
      ]
    );
  };

  if (!auction) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: COLORS.gray50 }]}
      >
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.gray50} />

        {/* Header */}
        <View style={[styles.header, { backgroundColor: COLORS.white }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={[styles.closeButtonText, { color: COLORS.gray600 }]}>
              ✕
            </Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: COLORS.dark }]}>
            Auction Room Terms & Conditions
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Auction Info Header */}
        <View style={[styles.auctionHeader, { backgroundColor: COLORS.white }]}>
          <Image
            source={{ uri: auction.product.images[0] }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.auctionInfo}>
            <Text
              style={[styles.productTitle, { color: COLORS.dark }]}
              numberOfLines={2}
            >
              {auction.product.title}
            </Text>
            <Text style={[styles.currentBid, { color: COLORS.success600 }]}>
              Current Bid: PKR
              {(
                auction.currentHighestBid || auction.startingBid
              ).toLocaleString()}
            </Text>
            <Text style={[styles.participants, { color: COLORS.gray600 }]}>
              {auction.totalParticipants} participants • {auction.totalBids}{" "}
              bids
            </Text>
          </View>
        </View>

        {/* Terms Content */}
        <ScrollView
          style={styles.termsContent}
          //    onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={true}
        >
          <View
            style={[styles.termsSection, { backgroundColor: COLORS.white }]}
          >
            {/* Important Notice */}
            <View
              style={[
                styles.noticeCard,
                {
                  backgroundColor: COLORS.warning50,
                  borderColor: COLORS.warning200,
                },
              ]}
            >
              <Text style={[styles.noticeIcon, { color: COLORS.warning600 }]}>
                ⚠️
              </Text>
              <View style={styles.noticeContent}>
                <Text
                  style={[styles.noticeTitle, { color: COLORS.warning800 }]}
                >
                  Important Notice
                </Text>
                <Text style={[styles.noticeText, { color: COLORS.warning700 }]}>
                  By entering the auction room, you agree to participate in live
                  bidding for agricultural products. All bids are final and
                  legally binding.
                </Text>
              </View>
            </View>

            {/* Terms Title */}
            <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>
              Key Terms and Conditions:
            </Text>

            {/* Binding Bids */}
            <View style={styles.termItem}>
              <View
                style={[styles.termIcon, { backgroundColor: COLORS.error100 }]}
              >
                <Text style={styles.termEmoji}>⚖️</Text>
              </View>
              <View style={styles.termContent}>
                <Text style={[styles.termTitle, { color: COLORS.dark }]}>
                  Binding Bids
                </Text>
                <Text
                  style={[styles.termDescription, { color: COLORS.gray700 }]}
                >
                  All bids placed are legally binding. If you win an auction,
                  you must complete the purchase within 24 hours.
                </Text>
              </View>
            </View>

            {/* Auction Timeline */}
            <View style={styles.termItem}>
              <View
                style={[
                  styles.termIcon,
                  { backgroundColor: COLORS.primary100 },
                ]}
              >
                <Text style={styles.termEmoji}>⏰</Text>
              </View>
              <View style={styles.termContent}>
                <Text style={[styles.termTitle, { color: COLORS.dark }]}>
                  Auction Timeline
                </Text>
                <Text
                  style={[styles.termDescription, { color: COLORS.gray700 }]}
                >
                  Auctions end at the specified time. Last-minute bids may
                  extend the auction by a few minutes to prevent sniping.
                </Text>
              </View>
            </View>

            {/* Verification Required */}
            <View style={styles.termItem}>
              <View
                style={[
                  styles.termIcon,
                  { backgroundColor: COLORS.success100 },
                ]}
              >
                <Text style={styles.termEmoji}>✅</Text>
              </View>
              <View style={styles.termContent}>
                <Text style={[styles.termTitle, { color: COLORS.dark }]}>
                  Verification Required
                </Text>
                <Text
                  style={[styles.termDescription, { color: COLORS.gray700 }]}
                >
                  All participants must be verified users. Fraudulent activities
                  will result in permanent account suspension.
                </Text>
              </View>
            </View>

            {/* Payment Terms */}
            <View style={styles.termItem}>
              <View
                style={[
                  styles.termIcon,
                  { backgroundColor: COLORS.warning100 },
                ]}
              >
                <Text style={styles.termEmoji}>💳</Text>
              </View>
              <View style={styles.termContent}>
                <Text style={[styles.termTitle, { color: COLORS.dark }]}>
                  Payment Terms
                </Text>
                <Text
                  style={[styles.termDescription, { color: COLORS.gray700 }]}
                >
                  Winners must pay the full amount within 24 hours. Failure to
                  pay may result in account penalties and loss of bidding
                  privileges.
                </Text>
              </View>
            </View>

            {/* Additional Responsibilities */}
            <View style={styles.termItem}>
              <View
                style={[styles.termIcon, { backgroundColor: COLORS.info100 }]}
              >
                <Text style={styles.termEmoji}>📋</Text>
              </View>
              <View style={styles.termContent}>
                <Text style={[styles.termTitle, { color: COLORS.dark }]}>
                  Additional Responsibilities:
                </Text>
                <View style={styles.bulletPoints}>
                  <Text style={[styles.bulletPoint, { color: COLORS.gray700 }]}>
                    • Inspect product details carefully before bidding
                  </Text>
                  <Text style={[styles.bulletPoint, { color: COLORS.gray700 }]}>
                    • Contact sellers within 24 hours of winning
                  </Text>
                  <Text style={[styles.bulletPoint, { color: COLORS.gray700 }]}>
                    • Arrange pickup/delivery as agreed with seller
                  </Text>
                  <Text style={[styles.bulletPoint, { color: COLORS.gray700 }]}>
                    • Report any issues through the platform support
                  </Text>
                  <Text style={[styles.bulletPoint, { color: COLORS.gray700 }]}>
                    • Maintain respectful communication with all parties
                  </Text>
                </View>
              </View>
            </View>

            {/* Consequences */}
            <View
              style={[
                styles.consequencesCard,
                {
                  backgroundColor: COLORS.error50,
                  borderColor: COLORS.error200,
                },
              ]}
            >
              <Text
                style={[styles.consequencesTitle, { color: COLORS.error800 }]}
              >
                ⚠️ Consequences of Non-Compliance:
              </Text>
              <View style={styles.consequencesList}>
                <Text
                  style={[styles.consequenceItem, { color: COLORS.error700 }]}
                >
                  • Account suspension for failed payments
                </Text>
                <Text
                  style={[styles.consequenceItem, { color: COLORS.error700 }]}
                >
                  • Loss of bidding privileges
                </Text>
                <Text
                  style={[styles.consequenceItem, { color: COLORS.error700 }]}
                >
                  • Legal action for fraudulent activities
                </Text>
                <Text
                  style={[styles.consequenceItem, { color: COLORS.error700 }]}
                >
                  • Permanent ban from the platform
                </Text>
              </View>
            </View>

            {/* Auction Specific Details */}
            <View
              style={[
                styles.auctionDetailsCard,
                {
                  backgroundColor: COLORS.primary50,
                  borderColor: COLORS.primary200,
                },
              ]}
            >
              <Text
                style={[
                  styles.auctionDetailsTitle,
                  { color: COLORS.primary800 },
                ]}
              >
                📊 This Auction Details:
              </Text>
              <View style={styles.detailRow}>
                <Text
                  style={[styles.detailLabel, { color: COLORS.primary700 }]}
                >
                  Minimum Bid Increment:
                </Text>
                <Text
                  style={[styles.detailValue, { color: COLORS.primary800 }]}
                >
                  PKR {auction.minBidIncrement}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text
                  style={[styles.detailLabel, { color: COLORS.primary700 }]}
                >
                  Reserve Price:
                </Text>
                <Text
                  style={[styles.detailValue, { color: COLORS.primary800 }]}
                >
                  PKR {auction.reservePrice.toLocaleString()}
                </Text>
              </View>
              {auction.buyNowPrice && (
                <View style={styles.detailRow}>
                  <Text
                    style={[styles.detailLabel, { color: COLORS.primary700 }]}
                  >
                    Buy Now Price:
                  </Text>
                  <Text
                    style={[styles.detailValue, { color: COLORS.primary800 }]}
                  >
                    PKR {auction.buyNowPrice.toLocaleString()}
                  </Text>
                </View>
              )}
              <View style={styles.detailRow}>
                <Text
                  style={[styles.detailLabel, { color: COLORS.primary700 }]}
                >
                  Auction Ends:
                </Text>
                <Text
                  style={[styles.detailValue, { color: COLORS.primary800 }]}
                >
                  {new Date(auction.endTime).toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Scroll indicator */}
            {!hasScrolledToBottom && (
              <View
                style={[
                  styles.scrollIndicator,
                  { backgroundColor: COLORS.warning100 },
                ]}
              >
                <Text style={[styles.scrollText, { color: COLORS.warning700 }]}>
                  👇 Please scroll down to read all terms
                </Text>
              </View>
            )}

            {/* Bottom spacing */}
            <View style={styles.bottomSpacing} />
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={[styles.bottomActions, { backgroundColor: COLORS.white }]}>
          <TouchableOpacity
            style={[styles.declineButton, { borderColor: COLORS.error500 }]}
            onPress={handleAccept}
          >
            <Text
              style={[styles.declineButtonText, { color: COLORS.error600 }]}
            >
              Decline
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.acceptButton,
              {
                backgroundColor: hasScrolledToBottom
                  ? COLORS.success600
                  : COLORS.gray400,
              },
            ]}
            onPress={handleAccept}
            //      disabled={!hasScrolledToBottom}
          >
            <Text style={[styles.acceptButtonText, { color: COLORS.white }]}>
              Accept & Enter Auction
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  placeholder: {
    width: 32,
  },

  // Auction Header
  auctionHeader: {
    flexDirection: "row",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  auctionInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  currentBid: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  participants: {
    fontSize: 12,
  },

  // Terms Content
  termsContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  termsSection: {
    padding: 20,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },

  // Notice Card
  noticeCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  noticeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    lineHeight: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },

  // Term Items
  termItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  termIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  termEmoji: {
    fontSize: 20,
  },
  termContent: {
    flex: 1,
  },
  termTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  termDescription: {
    fontSize: 14,
    lineHeight: 20,
  },

  // Bullet Points
  bulletPoints: {
    marginTop: 8,
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },

  // Consequences Card
  consequencesCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 16,
  },
  consequencesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  consequencesList: {
    marginLeft: 8,
  },
  consequenceItem: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },

  // Auction Details Card
  auctionDetailsCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 16,
  },
  auctionDetailsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
  },

  // Scroll Indicator
  scrollIndicator: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 16,
  },
  scrollText: {
    fontSize: 14,
    fontWeight: "600",
  },

  bottomSpacing: {
    height: 20,
  },

  // Bottom Actions
  bottomActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  declineButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  acceptButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AuctionTermsModal;
