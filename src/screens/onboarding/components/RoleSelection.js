import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
const { height: screenHeight } = Dimensions.get("window");
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../constants/Theme";

const RoleSelection = ({ selectedRole, onRoleSelect }) => {
  const { COLORS, SIZES } = useTheme();
  const { t } = useTranslation();
  const roles = [
    {
      id: "FARMER",
      title: t("onboarding.Farmer"),
      description: t("onboarding.FarmerDescription"),
      icon: "accessibility-outline",
      color: COLORS.primary,
    },
    {
      id: "BROKER",
      title: t("onboarding.Broker"),
      description: t("onboarding.BrokerDescription"),
      icon: "people",
      color: COLORS.info,
    },
    {
      id: "BUYER",
      title: t("onboarding.Buyer"),
      description: t("onboarding.BuyerDescription"),
      icon: "cart",
      color: COLORS.secondary,
    },
    {
      id: "EXPORTER",
      title: t("onboarding.Exporter"),
      description: t("onboarding.ExporterDescription"),
      icon: "airplane",
      color: COLORS.secondary,
    },
  ];

  const renderRoleCard = (role) => {
    const isSelected = selectedRole === role.id;

    return (
      <TouchableOpacity
        key={role.id}
        style={[
          styles.roleCard,
          {
            borderColor: isSelected ? role.color : COLORS.gray200,
            backgroundColor: isSelected ? `${role.color}10` : COLORS.white,
          },
        ]}
        onPress={() => onRoleSelect(role.id)}
      >
        <View style={styles.roleHeader}>
          <View style={[styles.iconContainer]}>
            <Ionicons name={role.icon} size={22} color={role.color} />
          </View>

          <View style={styles.roleInfo}>
            <Text style={[styles.roleTitle, { color: COLORS.dark }]}>
              {role.title}
            </Text>
            <Text style={[styles.roleDescription, { color: COLORS.gray600 }]}>
              {role.description}
            </Text>
          </View>

          <View
            style={[
              styles.radioButton,
              {
                borderColor: isSelected ? role.color : COLORS.gray300,
                backgroundColor: isSelected ? role.color : COLORS.white,
              },
            ]}
          >
            {isSelected && (
              <View
                style={[styles.radioInner, { backgroundColor: COLORS.white }]}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.subtitle, { color: COLORS.gray600 }]}>
        {t("onboarding.selectRoleSubtitle")}
      </Text>

      <ScrollView
        style={styles.rolesContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEnabled={true}
      >
        {roles.map(renderRoleCard)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20, // Add bottom padding to account for fixed footer
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  rolesContainer: {
    flex: 1,
    maxHeight: screenHeight * 0.9, // Reduce to 60% to ensure space for Next button
  },
  scrollContent: {
    paddingTop: 4,
    paddingBottom: 120, // Add bottom padding to prevent content from hiding behind Next button
    flexGrow: 1,
  },
  roleCard: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  roleHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  roleIcon: {
    fontSize: 24,
  },
  roleInfo: {
    flex: 1,
    marginRight: 12,
    minWidth: 0, // Allows flex items to shrink below their content size
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    lineHeight: 20,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default RoleSelection;
