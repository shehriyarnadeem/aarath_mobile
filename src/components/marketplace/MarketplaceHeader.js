import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";
import { TYPOGRAPHY } from "../../constants/Typography";

const MarketplaceHeader = ({
  onBackPress,
  productsCount = 0,
  showBackButton = false,
  title = "Marketplace",
  navigation,
}) => {
  const { COLORS, SHADOWS } = useTheme();

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white }}>
      <View
        style={[
          styles.header,
          { backgroundColor: COLORS.white, borderBottomColor: COLORS.gray200 },
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text
              style={[
                TYPOGRAPHY.bodySmall,
                { color: COLORS.textSecondary, marginTop: 2 },
              ]}
            >
              {productsCount} products available
            </Text>
          </View>

          {/* Notification Bell */}
          <TouchableOpacity
            style={[
              styles.notificationButton,
              { backgroundColor: COLORS.gray50 },
            ]}
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate("Favorites");
            }}
          >
            <Ionicons
              name="heart-outline"
              size={20}
              color={COLORS.textPrimary}
            />
            {/* Optional notification badge */}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 50,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  titleContainer: {
    flex: 1,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default MarketplaceHeader;
