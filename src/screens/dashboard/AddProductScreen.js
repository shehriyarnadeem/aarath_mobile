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
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";
import { TYPOGRAPHY } from "../../constants/Typography";
import { useLanguage } from "../../context/LanguageContext";
import { apiClient } from "../../utils/apiClient";
import Toast from "react-native-toast-message";
// Selectable Field Component
const SelectableField = ({
  label,
  options,
  value,
  onSelect,
  placeholder,
  error,
}) => {
  const { COLORS } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={[styles.label, { color: "#1e293b" }]}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.selectableField,
          {
            borderColor: error ? COLORS.error : "#e2e8f0",
            backgroundColor: "white",
          },
        ]}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text
          style={[
            styles.selectableFieldText,
            { color: value ? "#1e293b" : "#64748b" },
          ]}
        >
          {value || placeholder}
        </Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#64748b"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionItem,
                { backgroundColor: value === option ? "#f0fdf4" : "white" },
              ]}
              onPress={() => {
                onSelect(option);
                setIsExpanded(false);
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: value === option ? "#166534" : "#1e293b" },
                ]}
              >
                {option}
              </Text>
              {value === option && (
                <Ionicons name="checkmark" size={16} color="#166534" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// Helper function to convert image URI to base64
const convertImageToBase64 = async (imageUri) => {
  try {
    console.log("Converting image to base64:", imageUri);

    // Use legacy FileSystem API
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log(
      "Successfully converted image to base64, length:",
      base64?.length
    );
    return base64;
  } catch (error) {
    console.error("Error converting image to base64:", error.message);

    // For development/testing, return null so we can use placeholder
    // In production, you might want to show an error to the user
    return null;
  }
};

const AddProductScreen = ({ navigation }) => {
  const { COLORS } = useTheme();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    quantity: "",
    unit: "",
    pricePerUnit: "",
    pricingType: "",
    environment: null, // Marketplace or Auction
    status: "", // draft or active
    // Quantity Management
    available: "",
    minOrderQty: "",
    maxOrderQty: "",

    // Quality Parameters
    grade: "",
    purity: "",
    moisture: "",

    // General Specifications
    variety: "",
    type: "",
    sizeLength: "",

    // Farming Specifications
    farmingMethod: "",
    harvestSeason: "",
    storageConditions: "",
    packagingMethod: "",
    shelfLife: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [images, setImages] = useState([]);
  const MAX_IMAGES = 10;

  const categories = ["Rice", "Wheat", "Corn", "Barley", "Cotton"];

  const units = ["Kgs", "Tons", "Bags", "Boxes", "Pieces"];

  const pricingTypes = ["FIXED", "NEGOTIABLE"];

  // Quality Parameters Options
  const gradeOptions = [
    "A Grade",
    "B Grade",
    "Premium",
    "Standard",
    "Export Quality",
  ];
  const purityOptions = ["95%", "96%", "97%", "98%", "99%", "99+%"];
  const moistureOptions = ["10%", "11%", "12%", "13%", "14%", "15%"];

  // General Specifications Options
  const varietyOptions = [
    "Basmati",
    "Super Basmati",
    "1121 Basmati",
    "IRRI-6",
    "IRRI-9",
    "Sella Rice",
  ];
  const typeOptions = [
    "Long Grain",
    "Extra Long Grain",
    "Short Grain",
    "Medium Grain",
    "Broken Rice",
  ];
  const sizeLengthOptions = [
    "5-6mm",
    "6-7mm",
    "7-8mm",
    "8mm+",
    "Premium Length",
  ];

  // Farming & Processing Options
  const farmingMethodOptions = [
    "Organic Certified",
    "Traditional Organic",
    "Conventional",
    "IPM Certified",
    "Sustainable",
  ];
  const harvestSeasonOptions = [
    "Kharif 2024",
    "Rabi 2024",
    "Kharif 2023",
    "Rabi 2023",
    "Fresh Harvest",
  ];
  const storageOptions = [
    "Climate Controlled",
    "Warehouse Storage",
    "Cold Storage",
    "Ventilated Storage",
  ];
  const packagingOptions = [
    "Jute Bags 50kg",
    "PP Bags 25kg",
    "PP Bags 50kg",
    "Custom Packaging",
  ];
  const shelfLifeOptions = ["6 months", "12 months", "18 months", "24 months"];

  const pickImages = async () => {
    try {
      if (images.length >= MAX_IMAGES) {
        Alert.alert(
          t("addProduct.alerts.maxImagesTitle"),
          t("addProduct.alerts.maxImagesMessage", { max: MAX_IMAGES })
        );
        return;
      }

      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          t("addProduct.alerts.permissionRequired"),
          t("addProduct.alerts.permissionMessage")
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: MAX_IMAGES - images.length,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.slice(0, MAX_IMAGES - images.length);
        const imageObjects = newImages.map((asset, index) => ({
          id: Date.now() + index,
          uri: asset.uri,
          type: asset.type || "image",
          fileName: asset.fileName || `image_${Date.now()}_${index}.jpg`,
        }));
        setImages((prev) => [...prev, ...imageObjects]);
      }
    } catch (error) {
      console.error("Error picking images:", error);
      Alert.alert("Error", "Failed to pick images. Please try again.");
    }
  };

  const removeImage = (imageId) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.title) newErrors.title = "Product title is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    if (!formData.pricePerUnit && formData.pricingType === "Fixed Price") {
      newErrors.pricePerUnit = "Price is required for fixed pricing";
    }

    // Quantity Management Validation - ALL FIELDS MANDATORY
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    if (!formData.unit) newErrors.unit = "Unit is required";
    if (!formData.pricePerUnit && formData.pricingType === "Fixed Price") {
      newErrors.pricePerUnit = "Price per unit is required for fixed pricing";
    }
    if (!formData.pricingType)
      newErrors.pricingType = "Pricing type is required";
    if (!formData.available)
      newErrors.available = "Available quantity is required";
    if (!formData.minOrderQty)
      newErrors.minOrderQty = "Minimum order quantity is required";
    if (!formData.maxOrderQty)
      newErrors.maxOrderQty = "Maximum order quantity is required";

    // Validate quantity logic with proper relationships
    const availableQty = parseInt(formData.available) || 0;
    const minOrder = parseInt(formData.minOrderQty) || 0;
    const maxOrder = parseInt(formData.maxOrderQty) || 0;

    // Min order should be less than or equal to available quantity
    if (formData.minOrderQty && formData.available && minOrder > availableQty) {
      newErrors.minOrderQty = `Min order (${minOrder} ${
        formData.unit || "units"
      }) cannot exceed available quantity (${availableQty} ${
        formData.unit || "units"
      })`;
    }

    // Max order should be less than or equal to available quantity
    if (formData.maxOrderQty && formData.available && maxOrder > availableQty) {
      newErrors.maxOrderQty = `Max order (${maxOrder} ${
        formData.unit || "units"
      }) cannot exceed available quantity (${availableQty} ${
        formData.unit || "units"
      })`;
    }

    // Max order should be greater than or equal to min order
    if (formData.minOrderQty && formData.maxOrderQty && minOrder > maxOrder) {
      newErrors.maxOrderQty = `Max order (${maxOrder} ${
        formData.unit || "units"
      }) should be greater than or equal to min order (${minOrder} ${
        formData.unit || "units"
      })`;
    }

    // Additional validation: Min order should be at least 1
    if (formData.minOrderQty && minOrder < 1) {
      newErrors.minOrderQty = "Minimum order quantity should be at least 1";
    }

    // Additional validation: Available quantity should be at least equal to min order
    if (formData.available && formData.minOrderQty && availableQty < minOrder) {
      newErrors.available = `Available quantity (${availableQty} ${
        formData.unit || "units"
      }) should be at least equal to minimum order (${minOrder} ${
        formData.unit || "units"
      })`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async () => {
    setIsLoadingDraft(true);
    // Enhanced validation for draft - require all quantity management fields
    if (!validateForm()) {
      setIsLoadingDraft(false);
      return;
    }
    try {
      // Convert images to base64
      const imageBase64Array = [];
      for (const image of images) {
        const base64 = await convertImageToBase64(image.uri);
        if (base64) {
          imageBase64Array.push(base64);
        }
      }

      // Prepare product data for API (matching backend expectations)
      const productData = {
        category: formData.category,
        title: formData.title,
        description:
          formData.description ||
          `${formData.title} - Quality agricultural product`,
        quantity: formData.quantity,
        unit: formData.unit,
        images:
          imageBase64Array.length > 0
            ? imageBase64Array
            : ["https://via.placeholder.com/400x400?text=Product+Image"], // Use base64 images or placeholder
        auction_live: false, // Since we're in marketplace mode
        price: formData.pricePerUnit,
        priceType: formData.pricingType,

        // Additional fields from our form
        available: formData.available,
        minOrderQty: formData.minOrderQty,
        maxOrderQty: formData.maxOrderQty,
        grade: formData.grade,
        purity: formData.purity,
        moisture: formData.moisture,
        variety: formData.variety,
        type: formData.type,
        sizeLength: formData.sizeLength,
        farmingMethod: formData.farmingMethod,
        harvestSeason: formData.harvestSeason,
        storageConditions: formData.storageConditions,
        packagingMethod: formData.packagingMethod,
        shelfLife: formData.shelfLife,
      };

      const response = await apiClient.products.create(productData);
      if (response.success) {
        setIsLoadingDraft(false);
        Toast.show({
          type: "success",
          text1: "Draft Saved",
          text2: "Your Add draft has been saved successfully.",
        });
        navigation.navigate("My_Ads");
      } else {
        throw new Error(response.message || "Failed to save draft");
      }
    } catch (error) {
      setIsLoadingDraft(false);
      let errorMessage = "Failed to save draft. Please try again.";

      if (error.error?.includes("Network")) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.error?.includes("Authorization")) {
        errorMessage = "Authorization error. Please log in again.";
      } else {
        errorMessage = error.error || error.message || "Server Error";
      }
      console.log("Error saving draft11:", errorMessage);
      Toast.show({
        type: "error",
        text1: "Failed to Save Draft",
        text2: errorMessage,
        text1Style: { color: COLORS.textPrimary, fontSize: 16 },
        text2Style: { color: COLORS.textPrimary, fontSize: 14 },
      });
      setErrors(errorMessage);
    } finally {
      setIsLoadingDraft(false);
    }
  };

  const handleListInMarketplace = async () => {
    // Comprehensive validation for marketplace listing
    if (!validateForm()) {
      Alert.alert(
        "Incomplete Information",
        "Please fill in all required fields before publishing your ad.",
        [{ text: "OK" }]
      );
      return;
    }

    // Additional validation for marketplace listing
    if (images.length === 0) {
      Alert.alert(
        "Images Required",
        "Please add at least one product image before publishing.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsLoading(true);
    try {
      // Convert images to base64
      const imageBase64Array = [];
      for (const image of images) {
        const base64 = await convertImageToBase64(image.uri);
        if (base64) {
          imageBase64Array.push(base64);
        }
      }

      // Prepare product data for API (matching backend expectations)
      const productData = {
        category: formData.category,
        title: formData.title,
        description:
          formData.description ||
          `${formData.title} - Quality agricultural product`,
        quantity: formData.quantity,
        unit: formData.unit,
        images:
          imageBase64Array.length > 0
            ? imageBase64Array
            : ["https://via.placeholder.com/400x400?text=Product+Image"], // Use base64 images or placeholder
        auction_live: false, // Since we're in marketplace mode
        price: formData.pricePerUnit,
        priceType: formData.pricingType,
        status: "ACTIVE",

        // Additional fields from our form
        available: formData.available,
        minOrderQty: formData.minOrderQty,
        maxOrderQty: formData.maxOrderQty,
        grade: formData.grade,
        purity: formData.purity,
        moisture: formData.moisture,
        variety: formData.variety,
        type: formData.type,
        sizeLength: formData.sizeLength,
        farmingMethod: formData.farmingMethod,
        harvestSeason: formData.harvestSeason,
        storageConditions: formData.storageConditions,
        packagingMethod: formData.packagingMethod,
        shelfLife: formData.shelfLife,
      };

      const response = await apiClient.products.create(productData);

      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Ad Published",
          text2: "Your product has been listed in the marketplace.",
        });
        navigation.navigate("My_Ads");
      } else {
        throw new Error(response.message || "Failed to publish product");
      }
    } catch (error) {
      let errorMessage = "Failed to publish your ad. Please try again.";

      if (error.message?.includes("Network")) {
        errorMessage =
          "Network error. Please check your internet connection and try again.";
      } else if (error.message?.includes("timeout")) {
        errorMessage =
          "Upload timed out. This might be due to large images. Try compressing your images or try again with better internet.";
      } else if (error.response?.status === 413) {
        errorMessage =
          "Images are too large. Please select smaller images (max 5MB each).";
      } else if (error.response?.status === 400) {
        errorMessage =
          "Invalid product data. Please check all fields and try again.";
      } else if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }
    } finally {
      setIsLoading(false);
    }
  };

  const CategorySelector = () => (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: "#1e293b" }]}>
        Category *
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 4 }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              {
                backgroundColor:
                  formData.category === category ? "#166534" : "#f8fafc",
                borderColor:
                  formData.category === category ? "#166534" : "#e2e8f0",
              },
            ]}
            onPress={() => setFormData({ ...formData, category })}
          >
            <Text
              style={[
                styles.categoryChipText,
                {
                  color: formData.category === category ? "white" : "#64748b",
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

  const ImageUploadSection = () => (
    <View style={styles.sectionContainer}>
      {/* Upload Button */}
      <TouchableOpacity
        style={[
          styles.imageUpload,
          {
            borderColor: COLORS.primary600,
            backgroundColor:
              images.length === 0 ? COLORS.primary50 : COLORS.gray50,
            opacity: images.length >= MAX_IMAGES ? 0.5 : 1,
          },
        ]}
        onPress={pickImages}
        disabled={images.length >= MAX_IMAGES}
      >
        <Ionicons
          name={images.length === 0 ? "camera" : "add"}
          size={32}
          color={
            images.length >= MAX_IMAGES ? COLORS.gray400 : COLORS.primary600
          }
        />
        <Text
          style={[
            styles.uploadText,
            {
              color:
                images.length >= MAX_IMAGES
                  ? COLORS.gray400
                  : COLORS.primary600,
            },
          ]}
        >
          {images.length === 0
            ? "Add Product Photos"
            : images.length >= MAX_IMAGES
              ? `Maximum ${MAX_IMAGES} images reached`
              : `Add More Photos (${MAX_IMAGES - images.length} remaining)`}
        </Text>
        <Text style={[styles.uploadSubtext, { color: COLORS.gray500 }]}>
          {images.length === 0
            ? t("addProduct.uploadHighQuality")
            : t("addProduct.tapToAddMore")}
        </Text>
      </TouchableOpacity>

      {/* Image Grid */}
      {images.length > 0 && (
        <View style={styles.imageGrid}>
          {images.map((image, index) => (
            <View key={image.id} style={styles.imageContainer}>
              <Image source={{ uri: image.uri }} style={styles.uploadedImage} />
              <TouchableOpacity
                style={[
                  styles.removeImageButton,
                  { backgroundColor: COLORS.error },
                ]}
                onPress={() => removeImage(image.id)}
              >
                <Ionicons name="close" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      {images.length > 1 && (
        <Text style={[styles.label, { color: COLORS.textPrimary }]}>
          ({images.length}/{MAX_IMAGES})
        </Text>
      )}
    </View>
  );

  const ListingTypeSelector = () => (
    <View style={styles.sectionContainer}>
      <Text style={[styles.label, { color: COLORS.textPrimary }]}>
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
          <Text
            style={[styles.listingTypeTitle, { color: COLORS.textPrimary }]}
          >
            Marketplace
          </Text>
          <Text style={[styles.listingTypeSubtitle, { color: COLORS.gray600 }]}>
            Direct sale with fixed or negotiable price
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.listingTypeCard,
            styles.disabledCard,
            {
              backgroundColor: COLORS.gray100,
              borderColor: COLORS.gray300,
              opacity: 0.7,
            },
          ]}
          disabled={true}
        >
          <View style={styles.listingTypeHeader}>
            <Text style={styles.listingTypeIcon}>🔨</Text>
            <View
              style={[
                styles.comingSoonBadge,
                { backgroundColor: COLORS.warning + "20" },
              ]}
            >
              <Text style={[styles.comingSoonText, { color: COLORS.warning }]}>
                COMING SOON
              </Text>
            </View>
          </View>
          <Text style={[styles.listingTypeTitle, { color: COLORS.gray600 }]}>
            Auction
          </Text>
          <Text style={[styles.listingTypeSubtitle, { color: COLORS.gray500 }]}>
            Let buyers compete with bids
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.background }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.gray50} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.primary800 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backButtonText, { color: "white" }]}>
            {t("addProduct.cancel")}
          </Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: "white" }]}>
            {t("addProduct.title")}
          </Text>
        </View>
        <View style={styles.headerRightSpace} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Images - First Section */}
        <ImageUploadSection />

        {/* Category Selection */}
        <CategorySelector />

        {/* Product Title */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.label, { color: "#1e293b" }]}>
            {t("addProduct.productTitle")}
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: "white",
                borderColor: errors.title ? "#dc2626" : "#e2e8f0",
                color: "#1e293b",
              },
            ]}
            placeholder={t("addProduct.productTitlePlaceholder")}
            placeholderTextColor="#64748b"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        {/* Quantity Management Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="layers-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>
              {t("addProduct.quantityManagement")}
            </Text>
          </View>

          {/* First Row: Quantity and Unit */}
          <View style={styles.rowContainer}>
            <View style={styles.halfWidth}>
              <Text style={[styles.label, { color: COLORS.textPrimary }]}>
                {t("addProduct.quantityRequired")}
              </Text>
              <View
                style={[
                  styles.inputWithIcon,
                  {
                    backgroundColor: COLORS.white,
                    borderColor: errors.quantity
                      ? COLORS.error
                      : COLORS.gray300,
                  },
                ]}
              >
                <TextInput
                  style={[
                    styles.textInputInline,
                    { color: COLORS.textPrimary },
                  ]}
                  placeholder="e.g. 100"
                  placeholderTextColor={COLORS.gray400}
                  value={formData.quantity}
                  onChangeText={(text) =>
                    setFormData({ ...formData, quantity: text })
                  }
                  keyboardType="numeric"
                />
              </View>
              {errors.quantity && (
                <Text style={styles.errorText}>{errors.quantity}</Text>
              )}
            </View>

            <View style={styles.halfWidth}>
              <SelectableField
                label={t("addProduct.unitRequired")}
                options={units}
                value={formData.unit}
                onSelect={(value) => setFormData({ ...formData, unit: value })}
                placeholder={t("addProduct.selectUnit")}
              />
            </View>
          </View>

          {/* Second Row: Price and Pricing Type */}
          <View style={styles.rowContainer}>
            <View style={styles.halfWidth}>
              <Text style={[styles.label, { color: COLORS.textPrimary }]}>
                {t("addProduct.priceRequired", {
                  unit: formData.unit || "unit",
                })}
              </Text>
              <View
                style={[
                  styles.inputWithIcon,
                  {
                    backgroundColor: COLORS.white,
                    borderColor: errors.pricePerUnit
                      ? COLORS.error
                      : COLORS.gray300,
                  },
                ]}
              >
                <Text
                  style={[styles.currencySymbol, { color: COLORS.gray600 }]}
                >
                  ₨
                </Text>
                <TextInput
                  style={[
                    styles.textInputInline,
                    { color: COLORS.textPrimary, paddingLeft: 8 },
                  ]}
                  placeholder="e.g. 5000"
                  placeholderTextColor={COLORS.gray400}
                  value={formData.pricePerUnit}
                  onChangeText={(text) =>
                    setFormData({ ...formData, pricePerUnit: text })
                  }
                  keyboardType="numeric"
                />
              </View>
              {errors.pricePerUnit && (
                <Text style={styles.errorText}>{errors.pricePerUnit}</Text>
              )}
            </View>

            <View style={styles.halfWidth}>
              <SelectableField
                label={t("addProduct.pricingTypeRequired")}
                options={pricingTypes}
                value={formData.pricingType}
                onSelect={(value) =>
                  setFormData({ ...formData, pricingType: value })
                }
                placeholder={t("addProduct.selectPricingType")}
              />
            </View>
          </View>

          {/* Third Row: Available, Min Order, Max Order */}
          <View style={[styles.rowContainer, { marginBottom: 0 }]}>
            <View style={styles.thirdWidth}>
              <Text style={[styles.label, { color: COLORS.textPrimary }]}>
                {t("addProduct.availableRequired", {
                  unit: formData.unit || "Units",
                })}
              </Text>
              <View
                style={[
                  styles.inputWithIcon,
                  {
                    backgroundColor: COLORS.white,
                    borderColor: errors.available
                      ? COLORS.error
                      : COLORS.gray300,
                  },
                ]}
              >
                <TextInput
                  style={[
                    styles.textInputInline,
                    { color: COLORS.textPrimary },
                  ]}
                  placeholder="e.g. 500"
                  placeholderTextColor={COLORS.gray400}
                  value={formData.available}
                  onChangeText={(text) =>
                    setFormData({ ...formData, available: text })
                  }
                  keyboardType="numeric"
                />
              </View>
              {errors.available && (
                <Text style={styles.errorText}>{errors.available}</Text>
              )}
            </View>

            <View style={styles.thirdWidth}>
              <Text style={[styles.label, { color: COLORS.textPrimary }]}>
                {t("addProduct.minOrderRequired", {
                  unit: formData.unit || "Units",
                })}
              </Text>
              <View
                style={[
                  styles.inputWithIcon,
                  {
                    backgroundColor: COLORS.white,
                    borderColor: errors.minOrderQty
                      ? COLORS.error
                      : COLORS.gray300,
                  },
                ]}
              >
                <TextInput
                  style={[
                    styles.textInputInline,
                    { color: COLORS.textPrimary },
                  ]}
                  placeholder="e.g. 10"
                  placeholderTextColor={COLORS.gray400}
                  value={formData.minOrderQty}
                  onChangeText={(text) =>
                    setFormData({ ...formData, minOrderQty: text })
                  }
                  keyboardType="numeric"
                />
              </View>
              {errors.minOrderQty && (
                <Text style={styles.errorText}>{errors.minOrderQty}</Text>
              )}
            </View>

            <View style={styles.thirdWidth}>
              <Text style={[styles.label, { color: COLORS.textPrimary }]}>
                {t("addProduct.maxOrderRequired", {
                  unit: formData.unit || "Units",
                })}
              </Text>
              <View
                style={[
                  styles.inputWithIcon,
                  {
                    backgroundColor: COLORS.white,
                    borderColor: errors.maxOrderQty
                      ? COLORS.error
                      : COLORS.gray300,
                  },
                ]}
              >
                <TextInput
                  style={[
                    styles.textInputInline,
                    { color: COLORS.textPrimary },
                  ]}
                  placeholder="e.g. 1000"
                  placeholderTextColor={COLORS.gray400}
                  value={formData.maxOrderQty}
                  onChangeText={(text) =>
                    setFormData({ ...formData, maxOrderQty: text })
                  }
                  keyboardType="numeric"
                />
              </View>
              {errors.maxOrderQty && (
                <Text style={styles.errorText}>{errors.maxOrderQty}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Quality Parameters Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={COLORS.primary}
            />
            <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>
              {t("addProduct.qualityParameters")}
            </Text>
          </View>

          <View style={styles.rowContainer}>
            <View style={styles.thirdWidth}>
              <SelectableField
                label={t("addProduct.grade")}
                options={gradeOptions}
                value={formData.grade}
                onSelect={(value) => setFormData({ ...formData, grade: value })}
                placeholder={t("addProduct.selectGrade")}
              />
            </View>

            <View style={styles.thirdWidth}>
              <SelectableField
                label={t("addProduct.purity")}
                options={purityOptions}
                value={formData.purity}
                onSelect={(value) =>
                  setFormData({ ...formData, purity: value })
                }
                placeholder={t("addProduct.selectPurity")}
              />
            </View>
          </View>
          <View style={[styles.thirdWidth, { width: "50%" }]}>
            <SelectableField
              label={t("addProduct.moisture")}
              options={moistureOptions}
              value={formData.moisture}
              onSelect={(value) =>
                setFormData({ ...formData, moisture: value })
              }
              placeholder={t("addProduct.moisture")}
            />
          </View>
        </View>

        {/* Product Specifications Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cube-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>
              {t("addProduct.specifications")}
            </Text>
          </View>

          <View style={styles.rowContainer}>
            <View style={styles.thirdWidth}>
              <SelectableField
                label={t("addProduct.variety")}
                options={varietyOptions}
                value={formData.variety}
                onSelect={(value) =>
                  setFormData({ ...formData, variety: value })
                }
                placeholder={t("addProduct.selectVariety")}
              />
            </View>

            <View style={styles.thirdWidth}>
              <SelectableField
                label={t("addProduct.type")}
                options={typeOptions}
                value={formData.type}
                onSelect={(value) => setFormData({ ...formData, type: value })}
                placeholder={t("addProduct.selectType")}
              />
            </View>
          </View>
        </View>

        {/* Farming & Processing Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="leaf-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>
              {t("addProduct.farmingProcessing")}
            </Text>
          </View>

          <View style={styles.rowContainer}>
            <View style={styles.halfWidth}>
              <SelectableField
                label={t("addProduct.farmingMethod")}
                options={farmingMethodOptions}
                value={formData.farmingMethod}
                onSelect={(value) =>
                  setFormData({ ...formData, farmingMethod: value })
                }
                placeholder={t("addProduct.farmingMethod")}
              />
            </View>

            <View style={styles.halfWidth}>
              <SelectableField
                label={t("addProduct.harvestSeason")}
                options={harvestSeasonOptions}
                value={formData.harvestSeason}
                onSelect={(value) =>
                  setFormData({ ...formData, harvestSeason: value })
                }
                placeholder={t("addProduct.harvestSeason")}
              />
            </View>
          </View>

          <View style={styles.rowContainer}>
            <View style={styles.halfWidth}>
              <SelectableField
                label={t("addProduct.storageConditions")}
                options={storageOptions}
                value={formData.storageConditions}
                onSelect={(value) =>
                  setFormData({ ...formData, storageConditions: value })
                }
                placeholder={t("addProduct.storageConditions")}
              />
            </View>

            <View style={styles.halfWidth}>
              <SelectableField
                label={t("addProduct.packagingMethod")}
                options={packagingOptions}
                value={formData.packagingMethod}
                onSelect={(value) =>
                  setFormData({ ...formData, packagingMethod: value })
                }
                placeholder={t("addProduct.packagingMethod")}
              />
            </View>
          </View>

          <View style={styles.rowContainer}>
            <View style={[styles.halfWidth, { width: "50%" }]}>
              <SelectableField
                label={t("addProduct.shelfLife")}
                options={shelfLifeOptions}
                value={formData.shelfLife}
                onSelect={(value) =>
                  setFormData({ ...formData, shelfLife: value })
                }
                placeholder={t("addProduct.shelfLife")}
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <View style={styles.mainActionsRow}>
            {/* Save Draft */}
            <TouchableOpacity
              style={[
                styles.draftButton,
                {
                  backgroundColor: COLORS.white,
                  borderColor: COLORS.primaryDark,
                  opacity: isLoadingDraft ? 0.6 : 1,
                },
              ]}
              onPress={handleSaveDraft}
              disabled={isLoadingDraft}
              activeOpacity={0.7}
            >
              {isLoadingDraft ? (
                <Ionicons
                  name="hourglass-outline"
                  size={20}
                  color={COLORS.primaryDark}
                />
              ) : (
                <Ionicons
                  name="ticket-outline"
                  size={20}
                  color={COLORS.primaryDark}
                />
              )}
              <Text
                style={[styles.listButtonText, { color: COLORS.primaryDark }]}
              >
                {isLoadingDraft
                  ? t("addProduct.saving")
                  : t("addProduct.saveDraft")}
              </Text>
            </TouchableOpacity>

            {/* List in Marketplace */}
            <TouchableOpacity
              style={[
                styles.listButton,
                {
                  backgroundColor: isLoading
                    ? COLORS.gray400
                    : COLORS.primaryDark,
                  opacity: isLoading ? 0.6 : 1,
                },
              ]}
              onPress={handleListInMarketplace}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <Ionicons name="hourglass-outline" size={20} color="white" />
              ) : (
                <Ionicons name="megaphone" size={20} color="white" />
              )}
              <Text style={[styles.listButtonText, { color: "white" }]}>
                {isLoading
                  ? t("addProduct.publishing")
                  : t("addProduct.publishAd")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "white",
  },
  backButton: {
    padding: 8,
    flex: 1,
    alignItems: "flex-start",
  },
  backButtonText: {
    ...TYPOGRAPHY.body1,
    color: "#166534",
    fontWeight: "600",
  },
  headerTitleContainer: {
    flex: 2,
    alignItems: "center",
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: "#1e293b",
    textAlign: "center",
  },
  headerRightSpace: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: "#1e293b",
    marginBottom: 20,
  },
  label: {
    ...TYPOGRAPHY.body2,
    color: "#1e293b",
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...TYPOGRAPHY.body1,
    color: "#1e293b",
  },
  selectableField: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
  selectableFieldText: {
    ...TYPOGRAPHY.body1,
    flex: 1,
  },
  optionsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginTop: 4,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  optionText: {
    ...TYPOGRAPHY.body1,
    flex: 1,
  },
  textArea: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: "500",
    minHeight: 120,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: "400",
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 12,
  },
  categoryChipText: {
    ...TYPOGRAPHY.body2,
    fontWeight: "600",
  },
  listingTypeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  listingTypeCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  listingTypeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  listingTypeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    position: "relative",
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
  disabledCard: {
    cursor: "not-allowed",
  },
  comingSoonBadge: {
    position: "absolute",
    top: -8,
    right: -12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  comingSoonText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  rowContainer: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  thirdWidth: {
    flex: 1,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 50,
  },
  textInputInline: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  inputIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "600",
  },
  chipSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  chipOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    minWidth: 60,
    alignItems: "center",
  },
  chipOptionText: {
    fontSize: 13,
    fontWeight: "600",
  },
  pricingChipOption: {
    minWidth: 80,
    paddingHorizontal: 10,
  },
  // Image Upload Styles
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  imageContainer: {
    position: "relative",
    width: 100,
    height: 100,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryImageBadge: {
    position: "absolute",
    bottom: -6,
    left: 0,
    right: 0,
    paddingVertical: 2,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryImageText: {
    fontSize: 10,
    fontWeight: "700",
  },
  imageUpload: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 8,
    textAlign: "center",
  },
  uploadSubtext: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  imageHelpText: {
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 8,
  },

  // Action Buttons Styles
  actionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "white",
  },
  mainActionsRow: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
    alignItems: "center",
  },
  draftButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 8,
    minHeight: 52,
  },
  draftButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  listButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    minHeight: 52,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },

  // New Section Styles
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  subSection: {
    marginTop: 16,
    marginBottom: 20,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: "#334155",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
  },
  fieldContainer: {
    marginBottom: 16,
  },

  // Enhanced Input Styles
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 10,
    minHeight: 52,
    backgroundColor: "#ffffff",
  },
  textInputInline: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 8,
    color: "#1f2937",
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
    color: "#6b7280",
  },
});

export default AddProductScreen;
