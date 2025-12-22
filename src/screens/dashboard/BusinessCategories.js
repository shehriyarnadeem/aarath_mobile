import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";

const BusinessCategories = ({ navigation }) => {
  const { COLORS } = useTheme();

  // Predefined categories for agricultural marketplace
  const availableCategories = [
    "Rice",
    "Wheat",
    "Corn",
    "Barley",
    "Oats",
    "Soybeans",
    "Organic Produce",
    "Vegetables",
    "Fruits",
    "Pulses",
    "Cotton",
    "Sugarcane",
    "Tea",
    "Coffee",
    "Spices",
    "Nuts",
    "Seeds",
    "Dairy",
    "Poultry",
    "Livestock",
    "Fertilizers",
    "Pesticides",
    "Farm Equipment",
    "Irrigation",
  ];

  const [categories, setCategories] = useState([
    { id: "1", name: "Rice", isActive: true, productCount: 8 },
    { id: "2", name: "Wheat", isActive: true, productCount: 4 },
    { id: "3", name: "Organic Produce", isActive: false, productCount: 0 },
    { id: "4", name: "Corn", isActive: true, productCount: 2 },
  ]);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleAddCategory = () => {
    if (selectedCategory && categories.length < 8) {
      const newCategory = {
        id: Date.now().toString(),
        name: selectedCategory,
        isActive: true,
        productCount: 0,
      };
      setCategories([...categories, newCategory]);
      setSelectedCategory("");
      setIsAddModalVisible(false);
    } else if (categories.length >= 8) {
      Alert.alert(
        "Category Limit",
        "You can only have a maximum of 8 categories."
      );
    }
  };

  const handleEditCategory = () => {
    if (selectedCategory && editingCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id
            ? { ...cat, name: selectedCategory }
            : cat
        )
      );
      setSelectedCategory("");
      setEditingCategory(null);
      setIsEditModalVisible(false);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setCategories(categories.filter((cat) => cat.id !== categoryId));
          },
        },
      ]
    );
  };

  const renderCategoryItem = ({ item }) => (
    <View style={[styles.categoryItem, { backgroundColor: COLORS.white }]}>
      <View style={styles.categoryContent}>
        <View style={styles.categoryInfo}>
          <Text style={[styles.categoryName, { color: COLORS.dark }]}>
            {item.name}
          </Text>
          <Text style={[styles.productCount, { color: COLORS.gray }]}>
            {item.productCount} products
          </Text>
        </View>

        <View style={styles.categoryActions}>
          <TouchableOpacity
            style={[styles.actionButton]}
            onPress={() => handleDeleteCategory(item.id)}
          >
            <Ionicons name="trash" size={16} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Get remaining categories that haven't been selected yet
  const getRemainingCategories = () => {
    const selectedNames = categories
      .filter((cat) => !editingCategory || cat.id !== editingCategory.id) // Exclude current editing category
      .map((cat) => cat.name);
    return availableCategories.filter(
      (category) => !selectedNames.includes(category)
    );
  };

  const CategoryModal = ({ visible, onClose, title, onSave }) => {
    const remainingCategories = getRemainingCategories();

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: COLORS.white }]}
          >
            <Text style={[styles.modalTitle, { color: COLORS.dark }]}>
              {title}
            </Text>

            {/* Category limit warning */}
            <View style={styles.categoryInfo}>
              <Text style={[styles.categoryCount, { color: COLORS.gray }]}>
                {categories.length}/8 categories selected
              </Text>
              {remainingCategories.length === 0 && (
                <Text style={[styles.limitWarning, { color: COLORS.error }]}>
                  All available categories selected
                </Text>
              )}
            </View>

            {/* Dropdown Selection */}
            <View
              style={[
                styles.dropdownContainer,
                { borderColor: COLORS.lightGray },
              ]}
            >
              <Text style={[styles.dropdownLabel, { color: COLORS.gray }]}>
                Select Category
              </Text>
              <ScrollView
                style={styles.dropdownList}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                {remainingCategories.length > 0 ? (
                  remainingCategories.map((category, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dropdownItem,
                        selectedCategory === category && {
                          backgroundColor: COLORS.primaryLight,
                        },
                      ]}
                      onPress={() => setSelectedCategory(category)}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          {
                            color:
                              selectedCategory === category
                                ? COLORS.primary
                                : COLORS.dark,
                          },
                        ]}
                      >
                        {category}
                      </Text>
                      {selectedCategory === category && (
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color={COLORS.primary}
                        />
                      )}
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.emptyDropdown}>
                    <Text style={[styles.emptyText, { color: COLORS.gray }]}>
                      No more categories available
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: COLORS.lightGray },
                ]}
                onPress={onClose}
              >
                <Text style={[styles.modalButtonText, { color: COLORS.gray }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: selectedCategory
                      ? COLORS.primary
                      : COLORS.lightGray,
                    opacity: selectedCategory ? 1 : 0.5,
                  },
                ]}
                onPress={onSave}
                disabled={!selectedCategory}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: selectedCategory ? COLORS.white : COLORS.gray },
                  ]}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.background }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.white }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: COLORS.dark }]}>
          Business Categories
        </Text>
        <TouchableOpacity
          style={[
            styles.addButton,
            {
              backgroundColor:
                categories.length >= 8 ? COLORS.lightGray : COLORS.primary,
              opacity: categories.length >= 8 ? 0.5 : 1,
            },
          ]}
          onPress={() => {
            if (categories.length >= 8) {
              Alert.alert(
                "Category Limit",
                "You can only have a maximum of 8 categories."
              );
            } else {
              setIsAddModalVisible(true);
            }
          }}
        >
          <Ionicons
            name="add"
            size={20}
            color={categories.length >= 8 ? COLORS.gray : COLORS.white}
          />
        </TouchableOpacity>
      </View>

      {/* Categories List */}
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Category Modal */}
      <CategoryModal
        visible={isAddModalVisible}
        onClose={() => {
          setIsAddModalVisible(false);
          setSelectedCategory("");
        }}
        title="Add New Category"
        onSave={handleAddCategory}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 46,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  // Stats Container
  statsContainer: {
    flexDirection: "row",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: "100%",
    marginHorizontal: 20,
  },

  // List Container
  listContainer: {
    paddingHorizontal: 10,
  },

  // Category Item
  categoryItem: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    height: 80,
    justifyContent: "space-between",
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  productCount: {
    fontSize: 14,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Category Actions
  categoryActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    padding: 24,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },

  // Category Info and Dropdown Styles
  categoryInfo: {
    marginBottom: 16,
  },
  categoryCount: {
    fontSize: 14,
    marginBottom: 4,
  },
  limitWarning: {
    fontSize: 12,
    fontStyle: "italic",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    maxHeight: 200,
  },
  dropdownLabel: {
    fontSize: 14,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  dropdownList: {
    maxHeight: 150,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 16,
    flex: 1,
  },
  emptyDropdown: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
  },
});

export default BusinessCategories;
