import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../constants/Theme";
import { TYPOGRAPHY } from "../../constants/Typography";

/**
 * BottomActionBar - Action buttons for product detail screen
 * @param {boolean} isFavorite - Favorite status
 * @param {Function} onToggleFavorite - Callback for favorite toggle
 * @param {Function} onContact - Callback for contact seller
 * @param {Function} onChat - Callback for chat with seller
 * @param {Function} onMakeOffer - Callback for make offer action
 */
const BottomActionBar = ({
  isFavorite,
  onToggleFavorite,
  onContact,
  onChat,
  onMakeOffer,
}) => {
  const { COLORS } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: COLORS.white }]}>
      <View style={styles.actionButtonsContainer}>
        {/* Favorite Button */}
        <TouchableOpacity
          style={[styles.favoriteButton, { backgroundColor: COLORS.gray100 }]}
          onPress={onToggleFavorite}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? COLORS.error : COLORS.gray600}
          />
        </TouchableOpacity>

        {/* Contact Button */}
        <TouchableOpacity
          style={[styles.contactButton, { backgroundColor: COLORS.gray100 }]}
          onPress={onContact}
        >
          <Ionicons name="call-outline" size={20} color={COLORS.dark} />
          <Text
            style={[
              TYPOGRAPHY.body2,
              { color: COLORS.dark, fontWeight: "600" },
            ]}
          >
            Contact
          </Text>
        </TouchableOpacity>

        {/* Chat Button */}
        <TouchableOpacity
          style={[
            styles.chatButton,
            { backgroundColor: COLORS.primary + "20" },
          ]}
          onPress={onChat}
        >
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={COLORS.primary}
          />
          <Text
            style={[
              TYPOGRAPHY.body2,
              { color: COLORS.primary, fontWeight: "600" },
            ]}
          >
            Chat
          </Text>
        </TouchableOpacity>
      </View>

      {/* Make Offer Button */}
      <TouchableOpacity
        style={styles.primaryActionButton}
        onPress={onMakeOffer}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.primaryActionGradient}
        >
          <Ionicons name="flash" size={20} color={COLORS.white} />
          <Text style={[TYPOGRAPHY.h4, { color: COLORS.white }]}>
            Make an Offer
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  favoriteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  contactButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  chatButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryActionButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  primaryActionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 8,
  },
});

export default BottomActionBar;
