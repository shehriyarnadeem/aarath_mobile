import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../context/LanguageContext";

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <TouchableOpacity
      style={styles.languageSwitcher}
      onPress={() => changeLanguage(currentLanguage === "en" ? "ur" : "en")}
      activeOpacity={0.7}
    >
      <Ionicons name="language-outline" size={20} color="#6B7280" />
      <Text style={styles.languageText}>
        {currentLanguage === "en" ? "اردو" : "EN"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  languageSwitcher: {
    position: "absolute",
    top: 55,
    right: 24,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  languageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
});

export default LanguageSwitcher;
