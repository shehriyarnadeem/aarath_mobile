import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../constants/Theme";

const LanguageSwitcher = ({ backgroundColor = "green" }) => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { modernColors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.languageButton, { backgroundColor: backgroundColor }]}
      onPress={() => changeLanguage(currentLanguage === "en" ? "ur" : "en")}
      activeOpacity={0.7}
    >
      <Ionicons name="language" size={22} color={modernColors.white} />
      <Text style={[styles.languageText, { color: modernColors.white }]}>
        {currentLanguage === "en" ? "اردو" : "EN"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    minWidth: 70,
  },
  languageText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default LanguageSwitcher;
