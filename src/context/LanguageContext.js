import React, { createContext, useContext, useState, useEffect } from "react";
import { I18nManager } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../i18n";

const LANGUAGE_KEY = "@app_language";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "en");
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage) {
        await changeLanguage(savedLanguage);
      }
    } catch (error) {
      console.error("Error loading language:", error);
    }
  };

  const changeLanguage = async (lang) => {
    try {
      await i18n.changeLanguage(lang);
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
      setCurrentLanguage(lang);

      // Handle RTL for Urdu
      const shouldBeRTL = lang === "ur";
      if (shouldBeRTL !== isRTL) {
        setIsRTL(shouldBeRTL);
        // Note: Changing RTL requires app restart in React Native
        // For full RTL support, you'd need to force reload
        // I18nManager.forceRTL(shouldBeRTL);
        // RNRestart.Restart(); // requires react-native-restart package
      }
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const value = {
    currentLanguage,
    changeLanguage,
    isRTL,
    t: i18n.t.bind(i18n),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
