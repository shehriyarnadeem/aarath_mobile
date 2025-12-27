import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";
import { TYPOGRAPHY } from "../../constants/Typography";

/**
 * SellerCard - Displays seller information and profile link
 * @param {Object} seller - Seller/user data
 * @param {Function} onPress - Callback when card is pressed
 */
const SellerCard = ({ seller, onPress }) => {
  const { COLORS } = useTheme();

  if (!seller) return null;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: COLORS.white }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.sellerHeader}>
        <View style={styles.sellerAvatarContainer}>
          <Image
            source={{
              uri:
                seller.personalProfilePic ||
                `https://ui-avatars.com/api/?name=${seller.businessName || "User"}&background=random`,
            }}
            style={styles.sellerAvatar}
          />
          {seller.isOnline && (
            <View
              style={[
                styles.onlineIndicator,
                { backgroundColor: COLORS.success },
              ]}
            />
          )}
        </View>

        <View style={styles.sellerInfo}>
          <View style={styles.sellerNameRow}>
            <Text style={[TYPOGRAPHY.h4, { color: COLORS.primary }]}>
              {seller.businessName}
            </Text>
            {seller.verified && (
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={COLORS.success}
              />
            )}
          </View>
          <Text style={[TYPOGRAPHY.body2, { color: COLORS.gray600 }]}>
            {seller.role}
          </Text>
          {seller.email && (
            <Text style={[TYPOGRAPHY.body2, { color: COLORS.gray600 }]}>
              {seller.email}
            </Text>
          )}
          {(seller.city || seller.state) && (
            <View style={styles.sellerLocationRow}>
              <Ionicons name="location-outline" size={14} color={COLORS.gray} />
              <Text style={[TYPOGRAPHY.caption, { color: COLORS.gray }]}>
                {seller.city && seller.state
                  ? `${seller.city}, ${seller.state}`
                  : seller.city || seller.state}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Seller Details */}
      <View style={styles.sellerDetails}>
        <View style={styles.sellerDetailItem}>
          <Text style={[TYPOGRAPHY.caption, { color: COLORS.gray600 }]}>
            Products
          </Text>
          <Text
            style={[
              TYPOGRAPHY.body1,
              { color: COLORS.dark, fontWeight: "600" },
            ]}
          >
            {seller.products?.length ?? "-"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sellerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sellerAvatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "white",
  },
  sellerInfo: {
    flex: 1,
  },
  sellerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  sellerLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  sellerDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  sellerDetailItem: {
    alignItems: "center",
  },
});

export default SellerCard;
