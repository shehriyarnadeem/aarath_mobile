import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../constants/Theme";

const AuctionsTab = () => {
  const { COLORS, SIZES } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.gray50 }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.gray50} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.white }]}>
        <Text style={[styles.title, { color: COLORS.dark }]}>Auctions 🔨</Text>
      </View>

      {/* Coming Soon Content */}
      <View style={styles.content}>
        <View style={styles.comingSoonContainer}>
          <Text style={styles.comingSoonEmoji}>🚧</Text>
          <Text style={[styles.comingSoonTitle, { color: COLORS.dark }]}>
            Auctions Coming Soon!
          </Text>
          <Text style={[styles.comingSoonSubtitle, { color: COLORS.gray600 }]}>
            We're building an amazing auction system where farmers can bid on
            agricultural products in real-time.
          </Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>⚡</Text>
              <Text style={[styles.featureText, { color: COLORS.gray700 }]}>
                Real-time bidding system
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>🏆</Text>
              <Text style={[styles.featureText, { color: COLORS.gray700 }]}>
                Competitive pricing for better deals
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>🔔</Text>
              <Text style={[styles.featureText, { color: COLORS.gray700 }]}>
                Smart notifications and alerts
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>🛡️</Text>
              <Text style={[styles.featureText, { color: COLORS.gray700 }]}>
                Secure payment and delivery
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.notifyButton,
              { backgroundColor: COLORS.primary600 },
            ]}
          >
            <Text style={[styles.notifyButtonText, { color: COLORS.white }]}>
              🔔 Notify Me When Ready
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.progressContainer,
              { backgroundColor: COLORS.white },
            ]}
          >
            <Text style={[styles.progressTitle, { color: COLORS.dark }]}>
              Development Progress
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: COLORS.primary600,
                    width: "65%",
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: COLORS.gray600 }]}>
              65% Complete
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
    paddingVertical: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  comingSoonContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  comingSoonEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  comingSoonTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  comingSoonSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresList: {
    width: "100%",
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  featureEmoji: {
    fontSize: 20,
    marginRight: 16,
    width: 30,
  },
  featureText: {
    fontSize: 16,
    flex: 1,
  },
  notifyButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 32,
  },
  notifyButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressContainer: {
    width: "100%",
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default AuctionsTab;
