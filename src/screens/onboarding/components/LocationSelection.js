import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import { useTheme } from "../../../constants/Theme";

const LocationSelection = ({
  selectedState,
  selectedCity,
  onLocationSelect,
}) => {
  const { COLORS, SIZES } = useTheme();
  const [showStateModal, setShowStateModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  // Pakistan states and cities data
  const locationData = {
    Punjab: [
      "Lahore",
      "Karachi",
      "Faisalabad",
      "Rawalpindi",
      "Gujranwala",
      "Peshawar",
      "Multan",
      "Sialkot",
      "Sargodha",
      "Bahawalpur",
      "Jhang",
      "Sheikhupura",
      "Gujrat",
      "Sahiwal",
      "Kasur",
      "Okara",
      "Hafizabad",
      "Narowal",
      "Chiniot",
      "Mandi Bahauddin",
    ],
    Sindh: [
      "Karachi",
      "Hyderabad",
      "Sukkur",
      "Larkana",
      "Nawabshah",
      "Mirpur Khas",
      "Jacobabad",
      "Shikarpur",
      "Khairpur",
      "Dadu",
      "Badin",
      "Thatta",
      "Sanghar",
      "Tando Allahyar",
      "Tando Muhammad Khan",
      "Matiari",
      "Umerkot",
      "Tharparkar",
    ],
    "Khyber Pakhtunkhwa": [
      "Peshawar",
      "Mardan",
      "Mingora",
      "Kohat",
      "Dera Ismail Khan",
      "Bannu",
      "Swabi",
      "Charsadda",
      "Nowshera",
      "Mansehra",
      "Abbottabad",
      "Karak",
      "Hangu",
      "Wazirabad",
      "Lakki Marwat",
    ],
    Balochistan: [
      "Quetta",
      "Gwadar",
      "Turbat",
      "Khuzdar",
      "Sibi",
      "Zhob",
      "Loralai",
      "Pishin",
      "Chaman",
      "Hub",
      "Mastung",
      "Kalat",
      "Lasbela",
      "Nasirabad",
      "Jaffarabad",
    ],
    "Gilgit-Baltistan": [
      "Gilgit",
      "Skardu",
      "Hunza",
      "Ghanche",
      "Shigar",
      "Nagar",
      "Diamer",
      "Astore",
      "Ghizar",
      "Kharmang",
    ],
    "Azad Kashmir": [
      "Muzaffarabad",
      "Mirpur",
      "Rawalakot",
      "Palandri",
      "Kotli",
      "Bhimber",
      "Bagh",
      "Neelum",
      "Haveli",
      "Poonch",
    ],
  };

  const states = Object.keys(locationData);
  const cities = selectedState ? locationData[selectedState] : [];

  const handleStateSelect = (state) => {
    onLocationSelect(state, ""); // Reset city when state changes
    setShowStateModal(false);
  };

  const handleCitySelect = (city) => {
    onLocationSelect(selectedState, city);
    setShowCityModal(false);
  };

  const renderModal = (
    visible,
    onClose,
    title,
    items,
    onSelect,
    selectedItem
  ) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: COLORS.white }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: COLORS.dark }]}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.closeButton, { color: COLORS.primary }]}>
                ×
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.itemsList}>
            {items.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.modalItem,
                  {
                    backgroundColor:
                      selectedItem === item ? COLORS.primary50 : COLORS.white,
                  },
                ]}
                onPress={() => onSelect(item)}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    {
                      color:
                        selectedItem === item ? COLORS.primary : COLORS.dark,
                      fontWeight: selectedItem === item ? "600" : "400",
                    },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.subtitle, { color: COLORS.gray600 }]}>
        Select your business location to connect with local opportunities
      </Text>

      <View style={styles.formContainer}>
        {/* State Selection */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: COLORS.dark }]}>
            State/Province *
          </Text>
          <TouchableOpacity
            style={[
              styles.selector,
              {
                borderColor: selectedState ? COLORS.primary : COLORS.gray300,
                backgroundColor: COLORS.white,
              },
            ]}
            onPress={() => setShowStateModal(true)}
          >
            <Text
              style={[
                styles.selectorText,
                {
                  color: selectedState ? COLORS.dark : COLORS.gray400,
                },
              ]}
            >
              {selectedState || "Select State/Province"}
            </Text>
            <Text style={[styles.chevron, { color: COLORS.gray400 }]}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* City Selection */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: COLORS.dark }]}>City *</Text>
          <TouchableOpacity
            style={[
              styles.selector,
              {
                borderColor: selectedCity ? COLORS.primary : COLORS.gray300,
                backgroundColor: selectedState ? COLORS.white : COLORS.gray100,
              },
            ]}
            onPress={() => selectedState && setShowCityModal(true)}
            disabled={!selectedState}
          >
            <Text
              style={[
                styles.selectorText,
                {
                  color: selectedCity
                    ? COLORS.dark
                    : selectedState
                    ? COLORS.gray400
                    : COLORS.gray300,
                },
              ]}
            >
              {selectedCity ||
                (selectedState ? "Select City" : "Select State First")}
            </Text>
            <Text style={[styles.chevron, { color: COLORS.gray400 }]}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Location Info */}
        {selectedState && selectedCity && (
          <View
            style={[styles.locationInfo, { backgroundColor: COLORS.primary50 }]}
          >
            <Text style={[styles.locationIcon]}>📍</Text>
            <Text
              style={[styles.selectedLocation, { color: COLORS.primary700 }]}
            >
              {selectedCity}, {selectedState}
            </Text>
          </View>
        )}
      </View>

      {/* Modals */}
      {renderModal(
        showStateModal,
        () => setShowStateModal(false),
        "Select State/Province",
        states,
        handleStateSelect,
        selectedState
      )}

      {renderModal(
        showCityModal,
        () => setShowCityModal(false),
        "Select City",
        cities,
        handleCitySelect,
        selectedCity
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  selectorText: {
    fontSize: 16,
    flex: 1,
  },
  chevron: {
    fontSize: 12,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  selectedLocation: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    fontSize: 30,
    fontWeight: "300",
  },
  itemsList: {
    maxHeight: 400,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalItemText: {
    fontSize: 16,
  },
});

export default LocationSelection;
