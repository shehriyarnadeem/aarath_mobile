import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";
import { useTheme } from "../constants/Theme";

const COUNTRY_CODES = [
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
];

const CountryCodePicker = ({ selectedCode, onSelectCode, style }) => {
  const { COLORS } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = COUNTRY_CODES.filter(
    (country) =>
      country.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.includes(searchQuery)
  );

  const handleSelectCountry = (country) => {
    onSelectCode(country);
    setModalVisible(false);
    setSearchQuery("");
  };

  const selectedCountry =
    COUNTRY_CODES.find((c) => c.code === selectedCode) || COUNTRY_CODES[4]; // Default to Pakistan

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity
      style={StyleSheet.flatten([styles.countryItem, { borderBottomColor: COLORS.gray200 }])}
      onPress={() => handleSelectCountry(item)}
    >
      <Text style={styles.flag}>{item.flag}</Text>
      <View style={styles.countryInfo}>
        <Text style={StyleSheet.flatten([styles.countryName, { color: COLORS.dark }])}>
          {item.country}
        </Text>
        <Text style={StyleSheet.flatten([styles.countryCode, { color: COLORS.gray600 }])}>
          {item.code}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={style}>
      <TouchableOpacity
        style={StyleSheet.flatten([
          styles.pickerButton,
          {
            borderColor: COLORS.gray300,
            backgroundColor: COLORS.white,
          },
        ])}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.flag}>{selectedCountry.flag}</Text>
        <Text style={StyleSheet.flatten([styles.selectedCode, { color: COLORS.dark }])}>
          {selectedCountry.code}
        </Text>
        <Text style={StyleSheet.flatten([styles.dropdownArrow, { color: COLORS.gray400 }])}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={StyleSheet.flatten([styles.modalContainer, { backgroundColor: COLORS.white }])}
        >
          {/* Header */}
          <View
            style={StyleSheet.flatten([styles.modalHeader, { backgroundColor: COLORS.primary }])}
          >
            <Text style={StyleSheet.flatten([styles.modalTitle, { color: COLORS.white }])}>
              Select Country
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={StyleSheet.flatten([styles.closeButtonText, { color: COLORS.white }])}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View
            style={StyleSheet.flatten([styles.searchContainer, { backgroundColor: COLORS.gray50 }])}
          >
            <TextInput
              style={StyleSheet.flatten([
                styles.searchInput,
                {
                  backgroundColor: COLORS.white,
                  color: COLORS.dark,
                  borderColor: COLORS.gray300,
                },
              ])}
              placeholder="Search country or code..."
              placeholderTextColor={COLORS.gray400}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Country List */}
          <FlatList
            data={filteredCountries}
            keyExtractor={(item, index) =>
              `${item.code}-${item.country}-${index}`
            }
            renderItem={renderCountryItem}
            style={styles.countryList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 12,
    minWidth: 100,
  },
  flag: {
    fontSize: 12,
    marginRight: 2,
  },
  selectedCode: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50, // Account for status bar
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  countryInfo: {
    marginLeft: 12,
    flex: 1,
  },
  countryName: {
    fontSize: 12,
    fontWeight: "500",
  },
  countryCode: {
    fontSize: 10,
    marginTop: 2,
  },
});

export default CountryCodePicker;
