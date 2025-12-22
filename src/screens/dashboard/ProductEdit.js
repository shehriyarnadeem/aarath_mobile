import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { useTheme } from "../../constants/Theme";
import { apiClient } from "../../utils/apiClient";
import Toast from "react-native-toast-message";
const ProductEdit = ({ navigation, route }) => {
  const { COLORS, SIZES } = useTheme();
  const { productId, product } = route?.params || {};

  // Helper function to convert image URI to base64
  const convertImageToBase64 = async (imageUri) => {
    try {
      console.log("Converting image to base64:", imageUri);
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Return base64 with data URL prefix for common image types
      const fileExtension = imageUri.split(".").pop()?.toLowerCase();
      let mimeType = "image/jpeg"; // default

      if (fileExtension === "png") mimeType = "image/png";
      else if (fileExtension === "gif") mimeType = "image/gif";
      else if (fileExtension === "webp") mimeType = "image/webp";

      return `data:${mimeType};base64,${base64}`;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      throw new Error("Failed to process image");
    }
  };

  // Helper function to check if product is editable
  const isEditable = () => {
    return formData.status === "DRAFT" || formData.environment === null;
  };

  // Helper function to get payload with only editable fields
  const getEditableFieldsPayload = async () => {
    const payload = {};

    // If product is editable, include all form fields
    payload.title = formData.title;
    payload.description = formData.description;
    payload.category = formData.category;
    payload.quantity = parseInt(formData.quantity) || 0;
    payload.unit = formData.unit;
    payload.price = parseFloat(formData.price) || 0;
    payload.priceType = formData.priceType;

    // Send existing images (URLs only)
    payload.images = formData.images.filter((img) =>
      originalImages.includes(img)
    );

    // Convert new images to base64 before sending
    if (newImages.length > 0) {
      console.log(`Converting ${newImages.length} new images to base64...`);
      setProcessingImages(true);
    }

    const newImagesBase64 = [];
    try {
      for (let i = 0; i < newImages.length; i++) {
        const imageUri = newImages[i];
        console.log(`Converting image ${i + 1}/${newImages.length}:`, imageUri);
        const base64Image = await convertImageToBase64(imageUri);
        newImagesBase64.push(base64Image);
      }
      payload.newImages = newImagesBase64;

      if (newImagesBase64.length > 0) {
        console.log(
          `Successfully converted ${newImagesBase64.length} images to base64`
        );
      }
    } catch (error) {
      console.error("Failed to convert images:", error);
      throw new Error(
        `Failed to process images. Please try with different images.`
      );
    } finally {
      setProcessingImages(false);
    }

    // Send removed images as separate field
    payload.removedImages = removedImages;

    // Quantity Management
    payload.available = parseInt(formData.available) || 0;
    payload.minOrderQty = parseInt(formData.minOrder) || 0;
    payload.maxOrderQty = parseInt(formData.maxOrder) || 0;

    // Quality Parameters
    payload.grade = formData.grade;
    payload.purity = formData.purity
      ? parseFloat(formData.purity.replace("%", ""))
      : null;
    payload.moisture = formData.moisture
      ? parseFloat(formData.moisture.replace("%", ""))
      : null;

    // General Specifications
    payload.variety = formData.variety;
    payload.type = formData.type;
    payload.sizeLength = formData.sizeLength;

    // Farming Specifications
    payload.farmingMethod = formData.farmingMethod;
    payload.harvestSeason = formData.harvestSeason;
    payload.storageConditions = formData.storageConditions;
    payload.packagingMethod = formData.packagingMethod;
    payload.shelfLife = formData.shelfLife;

    return payload;
  };
  // Form state matching schema fields
  const [formData, setFormData] = useState({
    title: product?.title || "",
    description: product?.description || "",
    category: product?.category || "",
    quantity: product?.quantity?.toString() || "",
    unit: product?.unit || "kg",
    price: product?.price?.toString() || "",
    priceType: product?.priceType || "Not Specified",
    environment: product?.environment || null, // null for draft state
    status: product.status || "DRAFT", // draft, active, inactive, out_of_stock, on_hold, sold
    auctionEndTime: null,
    images: [],

    // Quantity Management
    available: product?.availableQty?.toString() || "",
    minOrder: product?.minOrderQty?.toString() || "",
    maxOrder: product?.maxOrderQty?.toString() || "",

    // Quality Parameters
    grade: product?.grade || "",
    purity: product?.purity?.toString() || "",
    moisture: product?.moisture?.toString() || "",

    // General Specifications
    variety: product?.variety || "",
    type: product?.type || "",
    sizeLength: product?.sizeLength || "",

    // Farming Specifications
    farmingMethod: product?.farmingMethod || "",
    harvestSeason: product?.harvestSeason || "",
    storageConditions: product?.storageConditions || "",
    packagingMethod: product?.packagingMethod || "",
    shelfLife: product?.shelfLife || "",
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [processingImages, setProcessingImages] = useState(false);
  const [errors, setErrors] = useState({});

  // Image tracking state
  const [originalImages, setOriginalImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  // Options based on agricultural domain
  const categoryOptions = [
    { label: "Wheat", value: "Wheat", icon: "leaf" },
    { label: "Rice", value: "Rice", icon: "leaf" },
    { label: "Cotton", value: "Cotton", icon: "flower" },
    { label: "Corn", value: "Corn", icon: "leaf" },
    { label: "Maize", value: "Maize", icon: "leaf" },
  ];

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

  const unitOptions = [
    { label: "Kilogram (kg)", value: "Kgs" },
    { label: "Gram (g)", value: "g" },
    { label: "Ton", value: "Tons" },
    { label: "Boxes", value: "Boxes" },
    { label: "Pieces", value: "Pieces" },
    { label: "Bags", value: "Bags" },
  ];

  const priceTypeOptions = [
    { label: "Fixed Price", value: "FIXED" },
    { label: "Negotiable", value: "NEGOTIABLE" },
    { label: "Price On Request", value: "PRICE_ON_REQUEST" },
  ];

  // Add a ref to track initialization
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product?.title || "",
        description: product?.description || "",
        category: product?.category || "",
        quantity: product?.quantity?.toString() || "",
        unit: product?.unit || "kg",
        price: product?.price?.toString() || "",
        priceType: product?.priceType || "fixed",
        environment: product?.environment || null,
        status: product.status || "DRAFT",
        images: product?.images || [],

        // Quantity Management
        available: product?.availableQty?.toString() || "",
        minOrder: product?.minOrderQty?.toString() || "",
        maxOrder: product?.maxOrderQty?.toString() || "",

        // Quality Parameters
        grade: product?.grade || "",
        purity: product?.purity?.toString() || "",
        moisture: product?.moisture?.toString() || "",

        // General Specifications
        variety: product?.variety || "",
        type: product?.type || "",
        sizeLength: product?.sizeLength || "",

        // Farming Specifications
        farmingMethod: product?.farmingMethod || "",
        harvestSeason: product?.harvestSeason || "",
        storageConditions: product?.storageConditions || "",
        packagingMethod: product?.packagingMethod || "",
        shelfLife: product?.shelfLife || "",
      });

      // Initialize original images for tracking removals
      setOriginalImages(product?.images || []);
      setRemovedImages([]); // Reset removed images when loading product
      setNewImages([]); // Reset new images when loading product
    }
  }, [product, productId, isInitialized]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const getEnvironmentInfo = (env) => {
    if (env === "MARKETPLACE") {
      return { icon: "storefront", label: "Marketplace", color: COLORS.info };
    } else if (env === "AUCTION") {
      return { icon: "hammer", label: "Auction", color: COLORS.warning };
    } else {
      return { icon: "document-outline", label: "Draft", color: COLORS.text };
    }
  };

  const calculateTimeLeft = (endTime) => {
    if (!endTime) return null;
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  // Business logic for transitions
  const canTransitionToAuction = () => {
    return (
      formData.environment === "MARKETPLACE" && formData.status === "active"
    );
  };

  const canChangeStatusInMarketplace = () => {
    return formData.environment === "MARKETPLACE" && formData.status !== "sold";
  };

  const canMarkAsSoldInAuction = () => {
    return formData.environment === "AUCTION";
  };

  const getAvailableStatusOptions = () => {
    // Draft state - no environment assigned yet
    if (formData.environment === null) {
      return [
        {
          label: "draft",
          value: "DRAFT",
          icon: "document-outline",
          color: COLORS.textMuted || COLORS.gray400,
        },
      ];
    }

    if (formData.environment === "MARKETPLACE") {
      return [
        {
          label: "Active",
          value: "ACTIVE",
          icon: "checkmark-circle",
          color: COLORS.success,
        },
        {
          label: "Inactive",
          value: "INACTIVE",
          icon: "pause-circle",
          color: COLORS.textSecondary,
        },
        {
          label: "Out of Stock",
          value: "OUT_OF_STOCK",
          icon: "alert-circle",
          color: COLORS.warning,
        },
        {
          label: "Sold",
          value: "SOLD_OUT",
          icon: "trophy",
          color: COLORS.warning,
        },
      ];
    } else if (formData.environment === "AUCTION") {
      return [
        {
          label: "Active",
          value: "ACTIVE",
          icon: "checkmark-circle",
          color: COLORS.success,
        },
        {
          label: "On Hold",
          value: "on_hold",
          icon: "time",
          color: COLORS.info,
        },
        {
          label: "Sold",
          value: "sold",
          icon: "trophy",
          color: COLORS.warning,
        },
      ];
    }
    return [];
  };

  const handleStatusChange = async (newStatus) => {
    // Show confirmation for certain status changes
    if (newStatus === "SOLD_OUT" || newStatus === "INACTIVE") {
      Alert.alert(
        "Confirm Status Change",
        `Are you sure you want to mark this product as "${newStatus}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            style: "default",
            onPress: () => updateProductStatus(newStatus),
          },
        ]
      );
    } else {
      updateProductStatus(newStatus);
    }
  };

  const updateProductStatus = async (newStatus) => {
    setLoading(true);
    try {
      // Prepare the payload with current editable fields + status change
      const payload = await getEditableFieldsPayload();
      payload.status = newStatus;

      // Update the product via API
      const response = await apiClient.products.update(
        productId || product.id,
        payload
      );

      if (response.success || response.status === "success") {
        Toast.show({
          type: "success",
          text1: "Listing Completed",
          text2: `Your Ad status has been successfully listed.`,
        });
        navigation.navigate("ProductsManagement");
      } else {
        throw new Error(response.message || "Failed to update product status");
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2:
          error.message || "Failed to update product status. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToAuction = () => {
    if (canTransitionToAuction()) {
      Alert.alert(
        "Move to Auction",
        "This will move your product to the auction environment. You can set auction duration later.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Move to Auction",
            style: "default",
            onPress: () => {
              // Set auction end time to 7 days from now (default)
              const auctionEnd = new Date();
              auctionEnd.setDate(auctionEnd.getDate() + 7);
              setFormData((prev) => ({
                ...prev,
                environment: "AUCTION",
                auctionEndTime: auctionEnd.toISOString(),
              }));
            },
          },
        ]
      );
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission required",
          "Permission to access camera roll is required!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        // Add new image to newImages state and also to formData.images for display
        const newImageUri = result.assets[0].uri;
        setNewImages((prev) => [...prev, newImageUri]);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, newImageUri],
        }));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const imageToRemove = prev.images[index];

      // If the image being removed was in the original images (not a newly added one),
      // add it to removedImages tracking
      if (originalImages.includes(imageToRemove)) {
        setRemovedImages((prevRemoved) => [...prevRemoved, imageToRemove]);
      } else {
        // If it's a new image, remove it from newImages state
        setNewImages((prevNew) =>
          prevNew.filter((img) => img !== imageToRemove)
        );
      }

      return {
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      };
    });
  };

  console.log("Form Data:", formData);
  const validateForm = () => {
    // Skip validation if product is not editable
    if (!isEditable()) {
      return true;
    }

    const newErrors = {};

    // Basic Information Validation
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";

    // Quantity & Pricing Validation
    if (
      !formData.quantity ||
      isNaN(formData.quantity) ||
      parseInt(formData.quantity) <= 0
    ) {
      newErrors.quantity = "Valid quantity is required";
    }
    if (
      !formData.price ||
      isNaN(formData.price) ||
      parseFloat(formData.price) <= 0
    ) {
      newErrors.price = "Valid price is required";
    }

    // Quantity Management Validation
    if (
      !formData.available ||
      isNaN(formData.available) ||
      parseInt(formData.available) <= 0
    ) {
      newErrors.available = "Available quantity is required";
    }
    if (
      !formData.minOrder ||
      isNaN(formData.minOrder) ||
      parseInt(formData.minOrder) <= 0
    ) {
      newErrors.minOrder = "Minimum order quantity is required";
    }
    if (
      !formData.maxOrder ||
      isNaN(formData.maxOrder) ||
      parseInt(formData.maxOrder) <= 0
    ) {
      newErrors.maxOrder = "Maximum order quantity is required";
    }

    // Quantity logic validation
    const availableQty = parseInt(formData.available) || 0;
    const minOrder = parseInt(formData.minOrder) || 0;
    const maxOrder = parseInt(formData.maxOrder) || 0;

    if (minOrder > availableQty) {
      newErrors.minOrder = `Min order cannot exceed available quantity (${availableQty})`;
    }
    if (maxOrder > availableQty) {
      newErrors.maxOrder = `Max order cannot exceed available quantity (${availableQty})`;
    }
    if (minOrder > maxOrder) {
      newErrors.maxOrder =
        "Max order should be greater than or equal to min order";
    }

    // Images validation
    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async () => {
    // Only validate basic required fields for draft
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Product title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert(
        "Required Fields Missing",
        "Please fill in the required fields (title, description, category) to save as draft"
      );
      return;
    }

    setDraftLoading(true);
    try {
      // Get the payload with editable fields but ensure it stays as draft
      const payload = await getEditableFieldsPayload();
      payload.status = "DRAFT";
      payload.environment = null;

      console.log("Saving product as draft:", payload);

      // Update the product via API
      const response = await apiClient.products.update(
        productId || product.id,
        payload
      );

      if (response.success || response.status === "success") {
        Toast.show({
          type: "success",
          text1: "Draft Saved",
          text2: "Your product draft has been saved successfully.",
        });
        navigation.navigate("My_Ads");
      } else {
        throw new Error(response.message || "Failed to save draft");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      Toast.show({
        type: "error",
        text1: "Save Failed",
        text2: error.message || "Failed to save draft. Please try again.",
      });
    } finally {
      setDraftLoading(false);
    }
  };

  const CustomDropdown = ({
    label,
    data,
    value,
    onChange,
    placeholder,
    error,
    icon,
  }) => {
    // If not editable, show read-only display
    if (!isEditable()) {
      const selectedItem = data.find((item) => item.value === value);
      return (
        <DisplayField
          label={label}
          value={selectedItem?.label}
          icon={icon}
          color={COLORS.textPrimary}
        />
      );
    }

    return (
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: COLORS.textPrimary }]}>
          {label}
        </Text>
        <View
          style={[
            styles.dropdownContainer,
            error && styles.inputError,
            { borderColor: error ? COLORS.error : COLORS.border },
          ]}
        >
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={COLORS.textSecondary}
              style={styles.dropdownIcon}
            />
          )}
          <Dropdown
            style={[styles.dropdown, { backgroundColor: COLORS.white }]}
            containerStyle={[
              styles.dropdownList,
              { backgroundColor: COLORS.white },
            ]}
            data={data}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={placeholder}
            placeholderStyle={{ color: COLORS.textSecondary, fontSize: 16 }}
            selectedTextStyle={{ color: COLORS.textPrimary, fontSize: 16 }}
            itemTextStyle={{ color: COLORS.textPrimary, fontSize: 16 }}
            activeColor={COLORS.primary + "20"}
            value={value}
            onChange={(item) => onChange(item.value)}
            renderRightIcon={() => (
              <Ionicons
                name="chevron-down"
                size={20}
                color={COLORS.textSecondary}
              />
            )}
          />
        </View>
        {error && (
          <Text style={[styles.errorText, { color: COLORS.error }]}>
            {error}
          </Text>
        )}
      </View>
    );
  };

  const StatusSelector = ({ options, selectedValue, onSelect, title }) => {
    const currentStatus = options.find(
      (option) => option.value === selectedValue
    );

    return (
      <View style={styles.statusSelector}>
        <Text
          style={[styles.statusSelectorTitle, { color: COLORS.textPrimary }]}
        >
          {title}
        </Text>

        {/* Current Status Display */}
        <View
          style={[
            styles.currentStatusDisplay,
            {
              backgroundColor: currentStatus?.color + "15",
              borderColor: currentStatus?.color + "40",
            },
          ]}
        >
          <View style={styles.currentStatusInfo}>
            <View
              style={[
                styles.currentStatusIconContainer,
                { backgroundColor: currentStatus?.color + "20" },
              ]}
            >
              <Ionicons
                name={currentStatus?.icon}
                size={24}
                color={currentStatus?.color}
              />
            </View>
            <View style={styles.currentStatusTextContainer}>
              <Text
                style={[
                  styles.currentStatusLabel,
                  { color: COLORS.textSecondary },
                ]}
              >
                Current Status
              </Text>
              <Text
                style={[
                  styles.currentStatusValue,
                  { color: currentStatus?.color },
                ]}
              >
                {currentStatus?.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Change Status Options */}
        {options.filter((option) => option.value !== selectedValue).length >
          0 && (
          <>
            <Text
              style={[styles.changeStatusTitle, { color: COLORS.textPrimary }]}
            >
              Change Status To:
            </Text>
            <View style={styles.statusOptions}>
              {options
                .filter((option) => option.value !== selectedValue)
                .map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.statusOption,
                      { borderColor: COLORS.border },
                    ]}
                    onPress={() => onSelect(option.value)}
                  >
                    <Ionicons
                      name={option.icon}
                      size={20}
                      color={option.color}
                    />
                    <Text
                      style={[
                        styles.statusOptionText,
                        { color: COLORS.textPrimary },
                      ]}
                    >
                      {option.label}
                    </Text>
                    <View style={styles.statusOptionArrow}>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={COLORS.textSecondary}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          </>
        )}
      </View>
    );
  };

  const handleListInMarketplace = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fix the errors and try again");
      return;
    }

    setLoading(true);
    try {
      // Prepare the payload with only editable fields
      const payload = await getEditableFieldsPayload();

      // Update environment and status for marketplace listing
      payload.environment = "MARKETPLACE";
      payload.status = "ACTIVE";

      console.log("Listing product in marketplace:", payload);

      // Update the product via API
      const response = await apiClient.products.update(
        productId || product.id,
        payload
      );

      if (response.success || response.status === "success") {
        // Update local state
        setFormData((prev) => ({
          ...prev,
          environment: "MARKETPLACE",
          status: "ACTIVE",
        }));

        Alert.alert(
          "🎉 Product Listed Successfully!",
          `Your "${formData.title}" is now live in the marketplace and visible to buyers!`,
          [
            {
              text: "View Product",
              onPress: () => navigation.goBack(),
            },
            {
              text: "OK",
              style: "default",
            },
          ]
        );
      } else {
        throw new Error(response.message || "Failed to list product");
      }
    } catch (error) {
      console.error("Error listing product:", error);
      Alert.alert(
        "Listing Failed",
        error.message ||
          "Failed to list product in marketplace. Please try again.",
        [
          { text: "Retry", onPress: handleListInMarketplace },
          { text: "Cancel", style: "cancel" },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const StatusManagementPanel = () => {
    const envInfo = getEnvironmentInfo(formData.environment);
    const timeLeft = formData.auctionEndTime
      ? calculateTimeLeft(formData.auctionEndTime)
      : null;
    const statusOptions = getAvailableStatusOptions();
    // Draft State - Special UI for new products
    if (isEditable()) {
      return (
        <View style={styles.statusPanel}>
          <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>
            Product Management
          </Text>

          {/* Draft Status Display */}
          <View style={[styles.statusCard, { backgroundColor: COLORS.white }]}>
            <View style={styles.draftStatusContainer}>
              <View style={styles.draftStatusHeader}>
                <View
                  style={[
                    styles.draftIconContainer,
                    { backgroundColor: COLORS.text + "10" },
                  ]}
                >
                  <Ionicons
                    name="document-outline"
                    size={24}
                    color={COLORS.text}
                  />
                </View>
                <View style={styles.draftTextContainer}>
                  <Text
                    style={[styles.draftLabel, { color: COLORS.textSecondary }]}
                  >
                    Current Status
                  </Text>
                  <Text style={[styles.draftValue, { color: COLORS.text }]}>
                    Draft
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.draftDescription,
                  { color: COLORS.textSecondary },
                ]}
              >
                Your product is saved as a draft. Complete the details and list
                it in the marketplace to start selling.
              </Text>
            </View>
          </View>

          {/* Marketplace Listing Card */}
          <View
            style={[
              styles.statusCard,
              styles.marketplaceListingCard,
              {
                backgroundColor: COLORS.info + "08",
                borderColor: COLORS.info + "30",
                borderWidth: 1,
              },
            ]}
          >
            <View style={styles.marketplaceListingContent}>
              <View style={styles.marketplaceHeader}>
                <View
                  style={[
                    styles.marketplaceIconContainer,
                    { backgroundColor: COLORS.info + "15" },
                  ]}
                >
                  <Ionicons name="storefront" size={28} color={COLORS.info} />
                </View>
                <View style={styles.marketplaceTextContainer}>
                  <Text
                    style={[
                      styles.marketplaceTitle,
                      { color: COLORS.textPrimary },
                    ]}
                  >
                    Ready to Launch?
                  </Text>
                  <Text
                    style={[
                      styles.marketplaceSubtitle,
                      { color: COLORS.textSecondary },
                    ]}
                  >
                    List your product in the marketplace and start connecting
                    with buyers
                  </Text>
                </View>
              </View>

              <View style={styles.marketplaceBenefits}>
                <View style={styles.benefitItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={COLORS.success}
                  />
                  <Text
                    style={[
                      styles.benefitText,
                      { color: COLORS.textSecondary },
                    ]}
                  >
                    Reach thousands of buyers
                  </Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={COLORS.success}
                  />
                  <Text
                    style={[
                      styles.benefitText,
                      { color: COLORS.textSecondary },
                    ]}
                  >
                    Secure payment processing
                  </Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={COLORS.success}
                  />
                  <Text
                    style={[
                      styles.benefitText,
                      { color: COLORS.textSecondary },
                    ]}
                  >
                    Easy product management
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.draftActionButtons}>
                <TouchableOpacity
                  style={[
                    styles.saveDraftButton,
                    {
                      backgroundColor: COLORS.white,
                      borderColor: COLORS.primary,
                      opacity: draftLoading || processingImages ? 0.6 : 1,
                    },
                  ]}
                  onPress={handleSaveDraft}
                  disabled={draftLoading || processingImages}
                >
                  <Ionicons
                    name={draftLoading ? "sync" : "document-text"}
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text
                    style={[
                      styles.saveDraftButtonText,
                      { color: COLORS.primary },
                    ]}
                  >
                    {processingImages
                      ? "Processing..."
                      : draftLoading
                      ? "Saving..."
                      : "Save Draft"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.marketplaceButton,
                    {
                      backgroundColor: COLORS.info,
                      opacity:
                        loading || draftLoading || processingImages ? 0.6 : 1,
                    },
                  ]}
                  onPress={handleListInMarketplace}
                  disabled={loading || draftLoading || processingImages}
                >
                  <Ionicons name="rocket" size={20} color={COLORS.white} />
                  <Text
                    style={[
                      styles.marketplaceButtonText,
                      { color: COLORS.white },
                    ]}
                  >
                    {processingImages
                      ? "Processing..."
                      : loading
                      ? "Listing..."
                      : "List in Marketplace"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      );
    }

    // Listed Product - Standard UI
    return (
      <View style={styles.statusPanel}>
        <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>
          Product Management
        </Text>

        {/* Environment Display */}
        <View style={[styles.statusCard, { backgroundColor: COLORS.white }]}>
          <View style={styles.environmentHeader}>
            <View style={styles.environmentInfo}>
              <View
                style={[
                  styles.environmentIconContainer,
                  { backgroundColor: envInfo.color + "20" },
                ]}
              >
                <Ionicons name={envInfo.icon} size={24} color={envInfo.color} />
              </View>
              <View style={styles.environmentTextContainer}>
                <Text
                  style={[
                    styles.environmentLabel,
                    { color: COLORS.textSecondary },
                  ]}
                >
                  Listed in
                </Text>
                <Text
                  style={[styles.environmentValue, { color: envInfo.color }]}
                >
                  {envInfo.label}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Status Selection */}
        <View style={[styles.statusCard, { backgroundColor: COLORS.white }]}>
          <StatusSelector
            options={statusOptions}
            selectedValue={formData.status}
            onSelect={handleStatusChange}
            title="Status"
          />
        </View>

        {/* Environment Transition - Coming Soon */}
        {canTransitionToAuction() && (
          <View
            style={[
              styles.statusCard,
              { backgroundColor: COLORS.white, opacity: 0.7 },
            ]}
          >
            <View style={styles.transitionSection}>
              <View style={styles.transitionInfo}>
                <Ionicons
                  name="trending-up"
                  size={24}
                  color={COLORS.textSecondary}
                />
                <View style={styles.transitionTextContainer}>
                  <View style={styles.comingSoonHeader}>
                    <Text
                      style={[
                        styles.transitionTitle,
                        { color: COLORS.textSecondary },
                      ]}
                    >
                      Move to Auction
                    </Text>
                    <View
                      style={[
                        styles.comingSoonBadge,
                        { backgroundColor: COLORS.warning + "20" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.comingSoonText,
                          { color: COLORS.warning },
                        ]}
                      >
                        Coming Soon
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.transitionDescription,
                      { color: COLORS.textSecondary },
                    ]}
                  >
                    Move your active product to auction for competitive bidding
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.transitionButton,
                  styles.disabledTransitionButton,
                  { backgroundColor: COLORS.textSecondary },
                ]}
              >
                <Ionicons name="hammer" size={18} color={COLORS.white} />
                <Text
                  style={[styles.transitionButtonText, { color: COLORS.white }]}
                >
                  Move to Auction
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  // Read-only display component for published products
  const DisplayField = ({ label, value, icon, color, unit }) => (
    <View style={styles.displayField}>
      <Text style={[styles.displayLabel, { color: COLORS.textSecondary }]}>
        {label}
      </Text>
      <View style={styles.displayValueContainer}>
        {icon && (
          <Ionicons
            name={icon}
            size={16}
            color={color || COLORS.textPrimary}
            style={styles.displayIcon}
          />
        )}
        <Text style={[styles.displayValue, { color: COLORS.textPrimary }]}>
          {value || "Not specified"}
          {unit ? ` ${unit}` : ""}
        </Text>
      </View>
    </View>
  );

  const SpecificationCard = ({ title, items, icon, iconColor }) => (
    <View style={[styles.specCard, { backgroundColor: COLORS.white }]}>
      <View style={styles.specHeader}>
        <View
          style={[
            styles.specIconContainer,
            { backgroundColor: iconColor + "20" },
          ]}
        >
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <Text style={[styles.specTitle, { color: COLORS.textPrimary }]}>
          {title}
        </Text>
      </View>
      <View style={styles.specContent}>
        {items.map((item, index) => (
          <DisplayField
            key={index}
            label={item.label}
            value={item.value}
            unit={item.unit}
          />
        ))}
      </View>
    </View>
  );

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    multiline,
    keyboardType,
    error,
    ...props
  }) => {
    // If not editable, show read-only display
    if (!isEditable()) {
      return <DisplayField label={label} value={value} />;
    }

    return (
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: COLORS.text }]}>{label}</Text>
        <TextInput
          style={[
            styles.textInput,
            multiline && styles.textAreaInput,
            error && styles.inputError,
            {
              backgroundColor: COLORS.white,
              color: COLORS.textPrimary,
              borderColor: error ? COLORS.error : COLORS.border,
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSecondary}
          multiline={multiline}
          keyboardType={keyboardType}
          {...props}
        />
        {error && (
          <Text style={[styles.errorText, { color: COLORS.error }]}>
            {error}
          </Text>
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.backgroundLight || COLORS.gray50,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
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
      fontSize: 16,
      color: "#166534",
      fontWeight: "600",
    },
    headerTitleContainer: {
      flex: 2,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "400",
      color: "#1e293b",
      textAlign: "center",
    },
    saveButton: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    saveButtonDisabled: {
      backgroundColor: COLORS.textSecondary,
    },
    saveButtonText: {
      color: "white",
      fontWeight: "600",
      fontSize: 16,
      marginLeft: 6,
    },
    content: {
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 16,
      color: COLORS.textPrimary,
      letterSpacing: 0.2,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 8,
      letterSpacing: 0.1,
    },
    textInput: {
      borderWidth: 1.5,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      letterSpacing: 0.1,
    },
    textAreaInput: {
      height: 100,
      textAlignVertical: "top",
    },
    dropdownContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderRadius: 12,
      backgroundColor: COLORS.white,
      paddingHorizontal: 4,
      minHeight: 48,
    },
    dropdownIcon: {
      marginLeft: 12,
      marginRight: 8,
    },
    dropdown: {
      flex: 1,
      paddingHorizontal: 8,
      paddingVertical: 8,
    },
    dropdownList: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: COLORS.border,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    inputError: {
      borderColor: COLORS.error,
    },
    errorText: {
      fontSize: 14,
      marginTop: 6,
      fontWeight: "500",
    },
    imagesSection: {
      marginBottom: 24,
    },
    imagesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    imageContainer: {
      width: 80,
      height: 80,
      borderRadius: 12,
      position: "relative",
    },
    productImage: {
      width: "100%",
      height: "100%",
      borderRadius: 12,
    },
    removeImageButton: {
      position: "absolute",
      top: -6,
      right: -6,
      backgroundColor: COLORS.error,
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    addImageButton: {
      width: 80,
      height: 80,
      borderRadius: 12,
      borderWidth: 2,
      borderStyle: "dashed",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.white,
    },
    quantityPriceRow: {
      flexDirection: "row",
      display: "flex",
      gap: 10,
    },
    halfWidth: {
      flex: 1,
    },
    // Status Management Styles
    statusPanel: {
      marginBottom: 24,
    },
    statusCard: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: COLORS.border + "30",
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    // Environment Display Styles
    environmentHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    environmentInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    environmentIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    environmentTextContainer: {
      marginLeft: 12,
      flex: 1,
    },
    environmentLabel: {
      fontSize: 14,
      fontWeight: "500",
    },
    environmentValue: {
      fontSize: 18,
      fontWeight: "700",
      marginTop: 2,
    },
    timerChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      gap: 6,
    },
    timerText: {
      fontSize: 13,
      fontWeight: "600",
    },
    // Status Selector Styles
    statusSelector: {
      marginBottom: 4,
    },
    statusSelectorTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 12,
    },
    // Current Status Display
    currentStatusDisplay: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 2,
    },
    currentStatusInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    currentStatusIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    currentStatusTextContainer: {
      marginLeft: 16,
      flex: 1,
    },
    currentStatusLabel: {
      fontSize: 14,
      fontWeight: "500",
    },
    currentStatusValue: {
      fontSize: 18,
      fontWeight: "700",
      marginTop: 2,
    },
    // Change Status Section
    changeStatusTitle: {
      fontSize: 15,
      fontWeight: "600",
      marginBottom: 10,
      opacity: 0.8,
    },
    statusOptions: {
      flexDirection: "column",
      gap: 8,
    },
    statusOption: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 10,
      borderWidth: 1.5,
      backgroundColor: COLORS.white,
    },
    statusOptionText: {
      fontSize: 15,
      fontWeight: "500",
      marginLeft: 12,
      flex: 1,
    },
    statusOptionArrow: {
      marginLeft: 8,
    },
    // Transition Section Styles
    transitionSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    transitionInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    transitionTextContainer: {
      marginLeft: 12,
      flex: 1,
    },
    transitionTitle: {
      fontSize: 16,
      fontWeight: "600",
    },
    transitionDescription: {
      fontSize: 13,
      marginTop: 2,
      lineHeight: 18,
    },
    transitionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      gap: 6,
    },
    transitionButtonText: {
      fontSize: 14,
      fontWeight: "600",
    },
    // Coming Soon Styles
    comingSoonHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 2,
    },
    comingSoonBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
    },
    comingSoonText: {
      fontSize: 11,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    disabledTransitionButton: {
      opacity: 0.6,
    },
    // Draft State Styles
    draftStatusContainer: {
      padding: 20,
    },
    draftStatusHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    draftIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    draftTextContainer: {
      marginLeft: 16,
      flex: 1,
    },
    draftLabel: {
      fontSize: 14,
      fontWeight: "500",
    },
    draftValue: {
      fontSize: 18,
      fontWeight: "700",
      marginTop: 2,
    },
    draftDescription: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "400",
    },
    // Marketplace Listing Styles
    marketplaceListingCard: {
      marginTop: 16,
    },
    marketplaceListingContent: {
      padding: 20,
    },
    marketplaceHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 20,
    },
    marketplaceIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    marketplaceTextContainer: {
      marginLeft: 16,
      flex: 1,
    },
    marketplaceTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 4,
      letterSpacing: 0.3,
    },
    marketplaceSubtitle: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "400",
    },
    marketplaceBenefits: {
      marginBottom: 24,
    },
    benefitItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    benefitText: {
      fontSize: 14,
      fontWeight: "500",
      marginLeft: 8,
    },
    marketplaceButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    marketplaceButtonText: {
      fontSize: 16,
      fontWeight: "700",
      marginLeft: 8,
      letterSpacing: 0.3,
    },

    // Draft Action Buttons Styles
    draftActionButtons: {
      flexDirection: "column",
      gap: 12,
      marginTop: 8,
    },
    saveDraftButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 2,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    saveDraftButtonText: {
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
      letterSpacing: 0.2,
    },

    // New Section Styles
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
      gap: 8,
    },
    subSection: {
      marginBottom: 20,
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: COLORS.backgroundLight || COLORS.gray50,
      borderWidth: 1,
      borderColor: COLORS.border + "30",
    },
    subSectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 16,
      color: COLORS.textPrimary,
    },
    thirdWidth: {
      flex: 0.32,
      marginHorizontal: 4,
      width: "80%",
    },

    // Read-only Display Styles
    displayField: {
      marginBottom: 16,
    },
    displayLabel: {
      fontSize: 14,
      fontWeight: "500",
      marginBottom: 6,
      letterSpacing: 0.1,
    },
    displayValueContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    displayIcon: {
      marginRight: 8,
    },
    displayValue: {
      fontSize: 16,
      fontWeight: "500",
      letterSpacing: 0.1,
    },

    // Specification Card Styles
    specCard: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: COLORS.border + "30",
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    specHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    specIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    specTitle: {
      fontSize: 16,
      fontWeight: "600",
      letterSpacing: 0.2,
    },
    specContent: {
      paddingLeft: 8,
    },

    // SelectableField Styles
    label: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 8,
      color: "#1e293b",
    },
    selectableField: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1.5,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: "white",
      minHeight: 48,
    },
    selectableFieldText: {
      fontSize: 16,
      flex: 1,
    },
    optionsContainer: {
      borderWidth: 1,
      borderColor: "#e2e8f0",
      borderRadius: 12,
      backgroundColor: "white",
      marginTop: 4,
      maxHeight: 200,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
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
      fontSize: 16,
      flex: 1,
    },
  });

  // Selectable Field Component
  const SelectableField = ({
    label,
    options,
    value,
    onSelect,
    placeholder,
    error,
  }) => {
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.primary800 }]}>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: "white" }]}>
            Manage Ad
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <InputField
            label="Product Title"
            value={formData.title}
            onChangeText={(text) => handleInputChange("title", text)}
            placeholder="Enter product name"
            error={errors.title}
          />

          <InputField
            label="Description"
            value={formData.description}
            onChangeText={(text) => handleInputChange("description", text)}
            placeholder="Describe your product in detail..."
            multiline
            error={errors.description}
          />

          <CustomDropdown
            label="Category"
            data={categoryOptions}
            value={formData.category}
            onChange={(value) => handleInputChange("category", value)}
            placeholder="Select category"
            icon="leaf-outline"
            error={errors.category}
          />
        </View>
        {/* Quantity & Pricing */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="layers-outline" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Quantity Management</Text>
          </View>

          <View style={styles.quantityPriceRow}>
            <View style={styles.halfWidth}>
              <InputField
                label="Quantity"
                value={formData.quantity}
                onChangeText={(text) => handleInputChange("quantity", text)}
                placeholder="0"
                keyboardType="numeric"
                error={errors.quantity}
              />
            </View>

            <View style={styles.halfWidth}>
              <CustomDropdown
                label="Unit"
                data={unitOptions}
                value={formData.unit}
                onChange={(value) => handleInputChange("unit", value)}
                placeholder="Select unit"
              />
            </View>
          </View>

          <View style={styles.quantityPriceRow}>
            <View style={styles.halfWidth}>
              <InputField
                label="Price "
                value={formData.price}
                onChangeText={(text) => handleInputChange("price", text)}
                placeholder="0.00"
                keyboardType="numeric"
                error={errors.price}
              />
            </View>

            <View style={styles.halfWidth}>
              <CustomDropdown
                label="Price Type"
                data={priceTypeOptions}
                value={formData.priceType}
                onChange={(value) => handleInputChange("priceType", value)}
                placeholder="Select pricing"
              />
            </View>
          </View>
        </View>
        {/* Quantity Management Section */}
        <View style={styles.section}>
          {isEditable() ? (
            <View style={styles.quantityPriceRow}>
              <View style={styles.thirdWidth}>
                <InputField
                  label="Available"
                  value={formData.available}
                  onChangeText={(text) => handleInputChange("available", text)}
                  placeholder="e.g. 500"
                  keyboardType="numeric"
                  error={errors.available}
                />
              </View>
              <View style={styles.thirdWidth}>
                <InputField
                  label="Min Order"
                  value={formData.minOrder}
                  onChangeText={(text) => handleInputChange("minOrder", text)}
                  placeholder="e.g. 10"
                  keyboardType="numeric"
                  error={errors.minOrder}
                />
              </View>
              <View style={styles.thirdWidth}>
                <InputField
                  label="Max Order"
                  value={formData.maxOrder}
                  onChangeText={(text) => handleInputChange("maxOrder", text)}
                  placeholder="e.g. 1000"
                  keyboardType="numeric"
                  error={errors.maxOrder}
                />
              </View>
            </View>
          ) : (
            <SpecificationCard
              title="Quantity Management"
              icon="layers-outline"
              iconColor={COLORS.primary}
              items={[
                {
                  label: "Available Quantity",
                  value: formData.available,
                  unit: formData.unit,
                },
                {
                  label: "Minimum Order",
                  value: formData.minOrder,
                  unit: formData.unit,
                },
                {
                  label: "Maximum Order",
                  value: formData.maxOrder,
                  unit: formData.unit,
                },
              ]}
            />
          )}
        </View>
        {/* Quality Parameters Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={COLORS.success}
            />
            <Text style={styles.sectionTitle}>Quality Parameters</Text>
          </View>

          {isEditable() ? (
            <>
              <View style={styles.quantityPriceRow}>
                <View style={(styles.thirdWidth, { width: "50%" })}>
                  <SelectableField
                    label="Grade"
                    options={gradeOptions}
                    value={formData.grade}
                    onSelect={(value) => handleInputChange("grade", value)}
                    placeholder="Select grade"
                  />
                </View>
                <View style={(styles.thirdWidth, { width: "50%" })}>
                  <SelectableField
                    label="Purity"
                    options={purityOptions}
                    value={formData.purity}
                    onSelect={(value) => handleInputChange("purity", value)}
                    placeholder="Select purity"
                  />
                </View>
              </View>
              <View style={(styles.thirdWidth, { width: "50%" })}>
                <SelectableField
                  label="Moisture"
                  options={moistureOptions}
                  value={formData.moisture}
                  onSelect={(value) => handleInputChange("moisture", value)}
                  placeholder="Moisture"
                />
              </View>
            </>
          ) : (
            <SpecificationCard
              title="Quality Parameters"
              icon="checkmark-circle-outline"
              iconColor={COLORS.success}
              items={[
                { label: "Grade", value: formData.grade },
                { label: "Purity", value: formData.purity },
                { label: "Moisture Content", value: formData.moisture },
              ]}
            />
          )}
        </View>
        {/* Product Specifications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="document-text-outline"
              size={20}
              color={COLORS.warning}
            />
            <Text style={styles.sectionTitle}>Product Specifications</Text>
          </View>

          {isEditable() ? (
            <>
              {/* General Specifications - Editable */}
              <View style={styles.subSection}>
                <View style={styles.quantityPriceRow}>
                  <View style={(styles.halfWidth, { width: "70%" })}>
                    <SelectableField
                      label="Variety"
                      options={varietyOptions}
                      value={formData.variety}
                      onSelect={(value) => handleInputChange("variety", value)}
                      placeholder="Select variety"
                    />
                  </View>
                </View>
                <View style={(styles.halfWidth, { width: "70%" })}>
                  <SelectableField
                    label="Type"
                    options={typeOptions}
                    value={formData.type}
                    onSelect={(value) => handleInputChange("type", value)}
                    placeholder="Select type"
                  />
                </View>
              </View>

              {/* Farming Specifications - Editable */}
              <View style={styles.subSection}>
                <Text
                  style={[
                    styles.subSectionTitle,
                    { color: COLORS.textPrimary },
                  ]}
                >
                  Farming & Processing
                </Text>

                <View style={styles.quantityPriceRow}>
                  <View style={styles.halfWidth}>
                    <SelectableField
                      label="Farming Method"
                      options={farmingMethodOptions}
                      value={formData.farmingMethod}
                      onSelect={(value) =>
                        handleInputChange("farmingMethod", value)
                      }
                      placeholder="Method"
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <SelectableField
                      label="Harvest Season"
                      options={harvestSeasonOptions}
                      value={formData.harvestSeason}
                      onSelect={(value) =>
                        handleInputChange("harvestSeason", value)
                      }
                      placeholder="Season"
                    />
                  </View>
                </View>

                <View style={styles.quantityPriceRow}>
                  <View style={styles.halfWidth}>
                    <SelectableField
                      label="Storage"
                      options={storageOptions}
                      value={formData.storageConditions}
                      onSelect={(value) =>
                        handleInputChange("storageConditions", value)
                      }
                      placeholder="Storage"
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <SelectableField
                      label="Packaging"
                      options={packagingOptions}
                      value={formData.packagingMethod}
                      onSelect={(value) =>
                        handleInputChange("packagingMethod", value)
                      }
                      placeholder="Packaging"
                    />
                  </View>
                </View>

                <View style={[styles.halfWidth, { width: "50%" }]}>
                  <SelectableField
                    label="Shelf Life"
                    options={shelfLifeOptions}
                    value={formData.shelfLife}
                    onSelect={(value) => handleInputChange("shelfLife", value)}
                    placeholder="Shelf Life"
                  />
                </View>
              </View>
            </>
          ) : (
            <>
              {/* General Specifications - Read-only */}
              <SpecificationCard
                title="General Specifications"
                icon="information-circle-outline"
                iconColor={COLORS.info}
                items={[
                  { label: "Variety", value: formData.variety },
                  { label: "Type", value: formData.type },
                  { label: "Size/Length", value: formData.sizeLength },
                ]}
              />

              {/* Farming Specifications - Read-only */}
              <SpecificationCard
                title="Farming & Processing"
                icon="leaf-outline"
                iconColor={COLORS.success}
                items={[
                  { label: "Farming Method", value: formData.farmingMethod },
                  { label: "Harvest Season", value: formData.harvestSeason },
                  {
                    label: "Storage",
                    value: formData.storageConditions,
                  },
                  {
                    label: "Packaging",
                    value: formData.packagingMethod,
                  },
                  { label: "Shelf Life", value: formData.shelfLife },
                ]}
              />
            </>
          )}
        </View>
        {/* Images */}
        <View style={styles.imagesSection}>
          <Text style={styles.sectionTitle}>Pictures</Text>
          <View style={styles.imagesGrid}>
            {formData.images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.productImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close" size={14} color="white" />
                </TouchableOpacity>
              </View>
            ))}

            {formData.images.length < 5 && (
              <TouchableOpacity
                style={[styles.addImageButton, { borderColor: COLORS.primary }]}
                onPress={pickImage}
              >
                <Ionicons name="camera" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>
          {errors.images && (
            <Text style={[styles.errorText, { color: COLORS.error }]}>
              {errors.images}
            </Text>
          )}
        </View>
        <StatusManagementPanel />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProductEdit;
