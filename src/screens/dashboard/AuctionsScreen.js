import React from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";

const AuctionsScreen = ({ navigation }) => {
  const { COLORS } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.background }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.white }]}>
        <Text style={[styles.headerTitle, { color: COLORS.dark }]}>
          Auctions
        </Text>
      </View>

      {/* Coming Soon Content */}
      <View style={styles.content}>
        <View
          style={[styles.comingSoonCard, { backgroundColor: COLORS.white }]}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: COLORS.warning + "20" },
            ]}
          >
            <Ionicons name="hammer" size={48} color={COLORS.warning} />
          </View>

          <Text style={[styles.comingSoonTitle, { color: COLORS.dark }]}>
            Auctions Coming Soon!
          </Text>

          <Text
            style={[styles.comingSoonDescription, { color: COLORS.gray600 }]}
          >
            Get ready for competitive bidding on premium agricultural products.
            Our auction platform will allow you to participate in live auctions
            and get the best deals on quality produce.
          </Text>

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="trending-up" size={20} color={COLORS.success} />
              <Text style={[styles.featureText, { color: COLORS.gray600 }]}>
                Live Bidding
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons
                name="shield-checkmark"
                size={20}
                color={COLORS.success}
              />
              <Text style={[styles.featureText, { color: COLORS.gray600 }]}>
                Secure Transactions
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="time" size={20} color={COLORS.success} />
              <Text style={[styles.featureText, { color: COLORS.gray600 }]}>
                Real-time Updates
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.comingSoonBadge,
              { backgroundColor: COLORS.warning + "15" },
            ]}
          >
            <Text style={[styles.badgeText, { color: COLORS.warning }]}>
              COMING SOON
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  comingSoonCard: {
    width: "100%",
    maxWidth: 400,
    padding: 32,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  comingSoonDescription: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  featuresContainer: {
    width: "100%",
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingLeft: 8,
  },
  featureText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
  comingSoonBadge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
  },
});

export default AuctionsScreen;
