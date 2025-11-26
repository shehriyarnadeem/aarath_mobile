import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
} from "react-native";
import { useTheme } from "../../constants/Theme";

const AddProductScreen = ({ navigation }) => {
  const { COLORS } = useTheme();

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    quantity: "",
    unit: "Kgs",
    pricePerKg: "",
    pricingType: "Fixed Price",
    listingType: "Marketplace", // Marketplace or Auction
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    "Rice",
    "Wheat",
    "Maize",
    "Pulses",
    "Vegetables",
    "Fruits",
    "Seeds",
    "Other",
  ];

  const units = ["Kgs", "Tons", "Bags", "Boxes", "Pieces"];

  const pricingTypes = ["Fixed Price", "Negotiable", "Price on Request"];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.title) newErrors.title = "Product title is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    if (!formData.pricePerKg && formData.pricingType === "Fixed Price") {
      newErrors.pricePerKg = "Price is required for fixed pricing";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert("Success!", "Your product has been listed successfully.", [
        {
          text: "View Products",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to list product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const CategorySelector = () => (
    <View style={styles.sectionContainer}>
      <Text style={[styles.label, { color: COLORS.dark }]}>Category *</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              {
                backgroundColor:
                  formData.category === category
                    ? COLORS.primary600
                    : COLORS.gray100,
                borderColor:
                  formData.category === category
                    ? COLORS.primary600
                    : COLORS.gray300,
              },
            ]}
            onPress={() => setFormData({ ...formData, category })}
          >
            <Text
              style={[
                styles.categoryChipText,
                {
                  color:
                    formData.category === category ? COLORS.white : COLORS.dark,
                },
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {errors.category && (
        <Text style={styles.errorText}>{errors.category}</Text>
      )}
    </View>
  );

  const ListingTypeSelector = () => (
    <View style={styles.sectionContainer}>
      <Text style={[styles.label, { color: COLORS.dark }]}>
        Where do you want to list this product? *
      </Text>

      <View style={styles.listingTypeContainer}>
        <TouchableOpacity
          style={[
            styles.listingTypeCard,
            {
              backgroundColor:
                formData.listingType === "Marketplace"
                  ? COLORS.primary50
                  : COLORS.white,
              borderColor:
                formData.listingType === "Marketplace"
                  ? COLORS.primary600
                  : COLORS.gray300,
            },
          ]}
          onPress={() =>
            setFormData({ ...formData, listingType: "Marketplace" })
          }
        >
          <Text style={styles.listingTypeIcon}>🏪</Text>
          <Text style={[styles.listingTypeTitle, { color: COLORS.dark }]}>
            Marketplace
          </Text>
          <Text style={[styles.listingTypeSubtitle, { color: COLORS.gray600 }]}>
            Direct sale with fixed or negotiable price
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.listingTypeCard,
            {
              backgroundColor:
                formData.listingType === "Auction"
                  ? COLORS.primary50
                  : COLORS.white,
              borderColor:
                formData.listingType === "Auction"
                  ? COLORS.primary600
                  : COLORS.gray300,
            },
          ]}
          onPress={() => setFormData({ ...formData, listingType: "Auction" })}
        >
          <Text style={styles.listingTypeIcon}>🔨</Text>
          <Text style={[styles.listingTypeTitle, { color: COLORS.dark }]}>
            Auction
          </Text>
          <Text style={[styles.listingTypeSubtitle, { color: COLORS.gray600 }]}>
            Let buyers compete with bids
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.gray50 }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.gray50} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.white }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backButtonText, { color: COLORS.primary600 }]}>
            ← Back
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: COLORS.dark }]}>
          Add Product Listing
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category Selection */}
        <CategorySelector />

        {/* Product Title */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.label, { color: COLORS.dark }]}>
            Product Title *
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: COLORS.white,
                borderColor: errors.title ? COLORS.error : COLORS.gray300,
                color: COLORS.dark,
              },
            ]}
            placeholder="e.g., Premium Basmati Rice"
            placeholderTextColor={COLORS.gray400}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        {/* Listing Type */}
        <ListingTypeSelector />

        {/* Product Description */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.label, { color: COLORS.dark }]}>
            Product Description *
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: COLORS.white,
                borderColor: errors.description ? COLORS.error : COLORS.gray300,
                color: COLORS.dark,
              },
            ]}
            placeholder="Describe your product quality, specifications, etc."
            placeholderTextColor={COLORS.gray400}
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>

        {/* Quantity and Unit */}
        <View style={styles.rowContainer}>
          <View style={[styles.halfWidth, { marginRight: 8 }]}>
            <Text style={[styles.label, { color: COLORS.dark }]}>
              Quantity *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: COLORS.white,
                  borderColor: errors.quantity ? COLORS.error : COLORS.gray300,
                  color: COLORS.dark,
                },
              ]}
              placeholder="e.g., 100"
              placeholderTextColor={COLORS.gray400}
              value={formData.quantity}
              onChangeText={(text) =>
                setFormData({ ...formData, quantity: text })
              }
              keyboardType="numeric"
            />
            {errors.quantity && (
              <Text style={styles.errorText}>{errors.quantity}</Text>
            )}
          </View>

          <View style={[styles.halfWidth, { marginLeft: 8 }]}>
            <Text style={[styles.label, { color: COLORS.dark }]}>Unit</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {units.map((unit) => (
                <TouchableOpacity
                  key={unit}
                  style={[
                    styles.unitChip,
                    {
                      backgroundColor:
                        formData.unit === unit
                          ? COLORS.primary600
                          : COLORS.white,
                      borderColor:
                        formData.unit === unit
                          ? COLORS.primary600
                          : COLORS.gray300,
                    },
                  ]}
                  onPress={() => setFormData({ ...formData, unit })}
                >
                  <Text
                    style={[
                      styles.unitChipText,
                      {
                        color:
                          formData.unit === unit ? COLORS.white : COLORS.dark,
                      },
                    ]}
                  >
                    {unit}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Price and Pricing Type */}
        <View style={styles.rowContainer}>
          <View style={[styles.halfWidth, { marginRight: 8 }]}>
            <Text style={[styles.label, { color: COLORS.dark }]}>
              Price per {formData.unit} (PKR) *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: COLORS.white,
                  borderColor: errors.pricePerKg
                    ? COLORS.error
                    : COLORS.gray300,
                  color: COLORS.dark,
                },
              ]}
              placeholder="e.g., 50000"
              placeholderTextColor={COLORS.gray400}
              value={formData.pricePerKg}
              onChangeText={(text) =>
                setFormData({ ...formData, pricePerKg: text })
              }
              keyboardType="numeric"
            />
            {errors.pricePerKg && (
              <Text style={styles.errorText}>{errors.pricePerKg}</Text>
            )}
          </View>

          <View style={[styles.halfWidth, { marginLeft: 8 }]}>
            <Text style={[styles.label, { color: COLORS.dark }]}>
              Pricing Type
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {pricingTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.pricingChip,
                    {
                      backgroundColor:
                        formData.pricingType === type
                          ? COLORS.primary600
                          : COLORS.white,
                      borderColor:
                        formData.pricingType === type
                          ? COLORS.primary600
                          : COLORS.gray300,
                    },
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, pricingType: type })
                  }
                >
                  <Text
                    style={[
                      styles.pricingChipText,
                      {
                        color:
                          formData.pricingType === type
                            ? COLORS.white
                            : COLORS.dark,
                      },
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Product Images */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.label, { color: COLORS.dark }]}>
            Product Images
          </Text>
          <TouchableOpacity
            style={[
              styles.imageUpload,
              { borderColor: COLORS.gray300, backgroundColor: COLORS.gray50 },
            ]}
          >
            <Text style={styles.uploadIcon}>📷</Text>
            <Text style={[styles.uploadText, { color: COLORS.gray600 }]}>
              Tap to add product images
            </Text>
            <Text style={[styles.uploadSubtext, { color: COLORS.gray500 }]}>
              Add up to 5 photos to showcase your product
            </Text>
          </TouchableOpacity>
        </View>

        {/* Submit Buttons */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: COLORS.gray300 }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.cancelButtonText, { color: COLORS.gray600 }]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor: isLoading ? COLORS.gray400 : COLORS.primary600,
                opacity: isLoading ? 0.7 : 1,
              },
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={[styles.submitButtonText, { color: COLORS.white }]}>
              {isLoading ? "Listing..." : "List in Marketplace"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 50,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 10,
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  placeholder: {
    width: 50,
  },
  content: {
    flex: 1,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginTop: 4,
  },
  categoryScroll: {
    marginBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  listingTypeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  listingTypeCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
  },
  listingTypeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  listingTypeTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  listingTypeSubtitle: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  rowContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  halfWidth: {
    flex: 1,
  },
  unitChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  unitChipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  pricingChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  pricingChipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  imageUpload: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  submitContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddProductScreen;
