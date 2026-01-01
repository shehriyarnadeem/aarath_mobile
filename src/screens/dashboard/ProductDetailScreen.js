import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  Alert,
  Linking,
  FlatList,
  Animated,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../constants/Theme";
import { useLanguage } from "../../context/LanguageContext";

const { width: screenWidth } = Dimensions.get("window");
// Enhanced product data matching new comprehensive schema

const ProductDetailScreen = ({ navigation, route }) => {
  const { COLORS } = useTheme();
  const { t } = useLanguage();
  const { productId, product } = route.params;

  // State management
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeSpecTab, setActiveSpecTab] = useState(0);

  // Animation refs
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  // Utility functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateEstimatedDelivery = () => {
    const today = new Date();
    const deliveryDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    return deliveryDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  console.log("Product Data:", product.user);
  // Action handlers
  const handleContactSeller = () => {
    if (product.seller?.whatsapp) {
      const message = `Hi, I'm interested in your ${product.name} (${product.hawalaNo}). Could you provide more details about pricing and availability?`;
      const whatsappUrl = `whatsapp://send?phone=${
        product.seller.whatsapp
      }&text=${encodeURIComponent(message)}`;

      Linking.canOpenURL(whatsappUrl)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(whatsappUrl);
          } else {
            Alert.alert(
              t("productDetail.whatsappNotInstalled"),
              t("productDetail.pleaseInstallWhatsApp")
            );
          }
        })
        .catch((err) => console.error("Error opening WhatsApp:", err));
    }
  };

  const handleViewSellerProfile = () => {
    // navigation.navigate("SellerProfile", { sellerId: product.seller.id });
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Add to favorites API call
  };

  // Specification tabs configuration
  const specificationTabs = [
    { key: "general", label: t("productDetail.general") },
    { key: "farming", label: t("productDetail.farming") },
  ];

  // Specification data structure
  const getSpecifications = () => {
    const specs = {
      general: [
        { label: t("productDetail.variety"), value: product.variety },
        { label: t("productDetail.type"), value: product.type },
      ],
      farming: [
        {
          label: t("productDetail.farmingMethod"),
          value: product.farmingMethod,
        },
        {
          label: t("productDetail.harvestSeason"),
          value: product.harvestSeason,
        },
        {
          label: t("productDetail.storageConditions"),
          value: product.storageConditions,
        },
        {
          label: t("productDetail.packagingMethod"),
          value: product.packagingMethod,
        },
        { label: t("productDetail.shelfLife"), value: product.shelfLife },
      ],
    };
    return specs;
  };

  // Render specification row
  const renderSpecRow = (label, value) => {
    if (!value) return null;
    return (
      <View key={label} style={styles.specRow}>
        <Text style={[styles.specLabel, { color: COLORS.gray600 }]}>
          {label}
        </Text>
        <Text style={[styles.specValue, { color: COLORS.dark }]}>{value}</Text>
      </View>
    );
  };

  // Render Product Specifications Section
  const renderSpecifications = () => {
    const specifications = getSpecifications();
    const activeTabKey = specificationTabs[activeSpecTab]?.key;

    return (
      <View
        style={[styles.specificationsCard, { backgroundColor: COLORS.white }]}
      >
        <Text style={[styles.sectionTitle, { color: COLORS.dark }]}>
          {t("productDetail.productSpecifications")}
        </Text>

        {/* Tabs */}
        <View style={styles.specTabsContainer}>
          {specificationTabs.map((tab, index) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.specTab,
                {
                  backgroundColor:
                    activeSpecTab === index ? COLORS.primary : "transparent",
                },
              ]}
              onPress={() => setActiveSpecTab(index)}
            >
              <Text
                style={[
                  styles.specTabText,
                  {
                    color: activeSpecTab === index ? COLORS.white : COLORS.gray,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Specification Content */}
        <View style={styles.specsContent}>
          {specifications[activeTabKey]?.map((spec) =>
            renderSpecRow(spec.label, spec.value)
          )}
        </View>
      </View>
    );
  };

  // Render Components
  const renderImageGallery = () => (
    <View style={styles.imageGalleryContainer}>
      <FlatList
        data={product.images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / screenWidth
          );
          setSelectedImageIndex(index);
        }}
        renderItem={({ item, index }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.productImage} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Image Indicators */}
      <View style={styles.imageIndicators}>
        {product.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor:
                  index === selectedImageIndex
                    ? COLORS.primary
                    : COLORS.gray300,
                width: index === selectedImageIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderProductInfo = () => (
    <View
      style={[styles.productInfoContainer, { backgroundColor: COLORS.white }]}
    >
      {/* Product Title & Enhanced Category */}
      <View style={styles.titleSection}>
        <View style={styles.titleRow}>
          <Text style={[styles.productTitle, { color: COLORS.dark }]}>
            {product.title}
          </Text>
        </View>

        {/* Enhanced Category and Status Row */}
        <View style={styles.categoryRow}>
          <View
            style={[
              styles.categoryChip,
              { backgroundColor: COLORS.primary + "15" },
            ]}
          >
            <Text style={[styles.categoryText, { color: COLORS.primary }]}>
              {product.category}
            </Text>
          </View>
          <View
            style={[
              styles.gradeChip,
              { backgroundColor: COLORS.warning + "15" },
            ]}
          >
            <Ionicons name="star" size={12} color={COLORS.warning} />
            <Text style={[styles.gradeText, { color: COLORS.warning }]}>
              {product.grade}
            </Text>
          </View>
          <View
            style={[
              styles.categoryChip,
              {
                backgroundColor: COLORS.primary + "15",
                width: "20%",
                borderRadius: 0,
              },
            ]}
          >
            <Text style={[styles.categoryText, { color: COLORS.primary }]}>
              {product.priceType}
            </Text>
          </View>
        </View>
      </View>

      {/* Enhanced Price & Stock Information */}
      <View style={styles.priceSection}>
        <View style={styles.mainPriceRow}>
          <View style={styles.priceContainer}>
            <Text
              style={[
                styles.price,
                { color: COLORS.success, fontSize: 20, fontWeight: "700" },
              ]}
            >
              {formatPrice(product.price)}
            </Text>
            <Text style={[styles.priceUnit, { color: COLORS.gray }]}>
              {t("productDetail.perUnit")} {product.unit}
            </Text>
          </View>
        </View>

        <View style={styles.stockAndOrderInfo}>
          <View style={styles.stockInfoCard}>
            <View style={styles.stockItem}>
              <Text style={[styles.stockLabel, { color: COLORS.gray600 }]}>
                {t("productDetail.available")}
              </Text>
              <Text style={[styles.stockValue, { color: COLORS.success }]}>
                {product.quantity.toLocaleString()} {product.unit}
              </Text>
            </View>
            <View style={styles.stockItem}>
              <Text style={[styles.stockLabel, { color: COLORS.gray600 }]}>
                {t("productDetail.minOrder")}
              </Text>
              <Text style={[styles.stockValue, { color: COLORS.dark }]}>
                {product.minOrderQty} {product.unit}
              </Text>
            </View>
            <View style={styles.stockItem}>
              <Text style={[styles.stockLabel, { color: COLORS.gray600 }]}>
                {t("productDetail.maxOrder")}
              </Text>
              <Text style={[styles.stockValue, { color: COLORS.dark }]}>
                {product.maxOrderQty} {product.unit}
              </Text>
            </View>
          </View>
        </View>

        {/* Quality Parameters Quick View */}
        <View style={styles.qualityQuickView}>
          <View style={styles.qualityParam}>
            <Text style={[styles.paramLabel, { color: COLORS.gray600 }]}>
              {t("productDetail.moisture")}
            </Text>
            <Text style={[styles.paramValue, { color: COLORS.success }]}>
              {product.moisture ? product.moisture + "%" : "N/A"}
            </Text>
          </View>
          <View style={styles.qualityParam}>
            <Text style={[styles.paramLabel, { color: COLORS.gray600 }]}>
              {t("productDetail.purity")}
            </Text>
            <Text style={[styles.paramValue, { color: COLORS.success }]}>
              {product.purity ? product.purity + "%" : "N/A"}
            </Text>
          </View>
          <View style={styles.qualityParam}>
            <Text style={[styles.paramLabel, { color: COLORS.gray600 }]}>
              {t("productDetail.grade")}
            </Text>
            <Text style={[styles.paramValue, { color: COLORS.warning }]}>
              {product.grade ? product.grade : "N/A"}
            </Text>
          </View>
        </View>
      </View>

      {/* Agricultural Origin & Harvest Info */}
      <View style={styles.originInfo}>
        <View style={styles.originItem}>
          <Ionicons name="location-outline" size={16} color={COLORS.primary} />
          <Text style={[styles.originText, { color: COLORS.dark }]}>
            {product.user?.city}
          </Text>
        </View>
        <View style={styles.originItem}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.success} />
          <Text style={[styles.originText, { color: COLORS.dark }]}>
            {t("productDetail.harvest")}: {product.harvestSeason || "N/A"}
          </Text>
        </View>
        <View style={styles.originItem}>
          <Ionicons name="leaf-outline" size={16} color={COLORS.success} />
          <Text style={[styles.originText, { color: COLORS.dark }]}>
            {product.farmingMethod} {t("productDetail.farming")}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderSellerCard = () => (
    <TouchableOpacity
      style={[
        styles.sellerCard,
        {
          backgroundColor: COLORS.white,
          marginBottom: 100,
          flexDirection: "column",
        },
      ]}
      onPress={handleViewSellerProfile}
      activeOpacity={0.85}
    >
      <View style={styles.sellerHeader}>
        <View style={styles.sellerAvatarContainer}>
          <Image
            source={{
              uri: product.user?.personalProfilePic
                ? product.user.personalProfilePic
                : "https://ui-avatars.com/api/?name=User&background=random",
            }}
            style={styles.sellerAvatar}
          />
        </View>

        <View style={styles.sellerInfo}>
          <View style={styles.sellerNameRow}>
            <Text
              style={[styles.sellerBusinessName, { color: COLORS.primary }]}
            >
              {product?.user?.businessName}
            </Text>
          </View>
          <Text style={[styles.sellerName, { color: COLORS.gray600 }]}>
            {product?.user?.role}
          </Text>
          <Text style={[styles.sellerName, { color: COLORS.gray600 }]}>
            {product?.user?.email}
          </Text>
          <View style={styles.sellerLocationRow}>
            <Ionicons name="location-outline" size={14} color={COLORS.gray} />
            <Text style={[styles.sellerLocation, { color: COLORS.gray }]}>
              {product?.user?.city}, {product?.user?.state}
            </Text>
          </View>
        </View>
      </View>

      {/* Seller Details Row */}
      <View style={styles.sellerDetails}>
        <View style={styles.sellerDetailItem}>
          <Text style={[styles.sellerDetailLabel, { color: COLORS.gray600 }]}>
            {t("productDetail.products")}
          </Text>
          <Text style={[styles.sellerDetailValue, { color: COLORS.dark }]}>
            {product?.user?.products?.length ?? "-"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.background }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: COLORS.white,
            opacity: headerOpacity,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, { color: COLORS.dark }]}
          numberOfLines={1}
        >
          {product.name}
        </Text>
      </Animated.View>

      {/* Floating Header Buttons (over image) */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity
          style={[
            styles.floatingButton,
            { backgroundColor: COLORS.white + "90" },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <Animated.ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Image Gallery */}
        {renderImageGallery()}

        {/* Product Information */}
        {renderProductInfo()}

        {/* Seller Card */}

        {/* Product Specifications */}
        {renderSpecifications()}

        <View style={styles.sectionContainer}>
          <Text
            style={[
              styles.sectionTitle,
              { color: COLORS.dark, marginBottom: 16, marginHorizontal: 16 },
            ]}
          >
            {t("productDetail.sellerInformation")}
          </Text>
          {renderSellerCard()}
        </View>

        {/* Bottom Spacing for Action Buttons */}
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>

      {/* Modern Bottom Action Bar */}
      <View style={[styles.bottomActionBar, { backgroundColor: COLORS.white }]}>
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            disabled
            style={[
              styles.chatButton,
              { backgroundColor: COLORS.primary, disabled: true },
            ]}
          >
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color={COLORS.white}
            />
            <Text style={[styles.chatButtonText, { color: COLORS.white }]}>
              {t("productDetail.chat")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header Styles
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 16,
    textAlign: "center",
  },

  // Floating Header
  floatingHeader: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    zIndex: 200,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  floatingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  // Content Styles
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Image Gallery
  imageGalleryContainer: {
    height: 350,
    position: "relative",
  },
  imageContainer: {
    width: screenWidth,
    height: 350,
    position: "relative",
  },
  productImage: {
    width: screenWidth,
    height: 350,
  },
  qualityBadge: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  qualityBadgeGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  qualityBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  certificationContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    gap: 8,
  },
  certBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  certBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  imageIndicators: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    flexDirection: "row",
    gap: 8,
  },
  indicator: {
    height: 4,
    borderRadius: 2,
    transition: "all 0.3s ease",
  },

  // Product Info Card
  productInfoContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  titleSection: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "800",
    flex: 1,
    lineHeight: 32,
  },
  favoriteBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Enhanced Price Section
  priceSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  mainPriceRow: {
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 8,
  },

  negotiableBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  negotiableText: {
    fontSize: 12,
    fontWeight: "600",
  },
  priceTypeContainer: {
    marginBottom: 4,
  },
  priceTypeText: {
    fontSize: 12,
    fontWeight: "500",
  },

  // Enhanced Stock and Order Info
  stockAndOrderInfo: {
    marginBottom: 16,
  },
  stockInfoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.03)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  stockItem: {
    alignItems: "center",
    flex: 1,
  },
  stockLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  stockValue: {
    fontSize: 16,
    fontWeight: "700",
  },

  // Quality Parameters Quick View
  qualityQuickView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  qualityParam: {
    alignItems: "center",
    flex: 1,
  },
  paramLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  paramValue: {
    fontSize: 14,
    fontWeight: "600",
  },

  // Enhanced Category and Badge Styles
  badgesRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    flexWrap: "wrap",
  },
  organicBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  exportBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  fssaiBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  gradeChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  gradeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  // Origin and Agricultural Info
  originInfo: {
    marginTop: 12,
    gap: 8,
  },
  originItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  originText: {
    fontSize: 14,
    fontWeight: "500",
  },
  stockInfo: {
    gap: 4,
  },
  stockText: {
    fontSize: 14,
    fontWeight: "600",
  },
  minOrderText: {
    fontSize: 12,
    fontWeight: "500",
  },

  // Quick Stats
  quickStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 12,
    fontWeight: "500",
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
  shareButton: {
    padding: 4,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },

  imageIndicator: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },

  // Sections
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  // Quantity Section
  quantitySection: {
    flexDirection: "row",
    gap: 16,
  },
  quantityCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
  },
  quantityNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  statusCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
  },
  statusIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },

  // Description
  description: {
    fontSize: 16,
    lineHeight: 24,
  },

  // Details Grid
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  detailItem: {
    width: "48%",
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
  },

  // Seller Card Styles
  sellerCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sellerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sellerAvatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "white",
  },
  sellerInfo: {
    flex: 1,
    padding: 10,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  sellerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  sellerBusinessName: {
    fontSize: 16,
    fontWeight: "700",
  },
  sellerName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  sellerLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: 80,
  },
  sellerLocation: {
    fontSize: 12,
    fontWeight: "500",
  },
  sellerStats: {
    alignItems: "flex-end",
    gap: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sellerRating: {
    fontSize: 14,
    fontWeight: "600",
  },
  responseTime: {
    fontSize: 11,
    fontWeight: "600",
  },
  sellerDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  sellerDetailItem: {
    alignItems: "center",
  },
  sellerDetailLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  sellerDetailValue: {
    fontSize: 12,
    fontWeight: "600",
  },
  viewProfileHint: {
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  viewProfileText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Section Container
  sectionContainer: {
    marginBottom: 24,
  },

  // Specifications Card
  specificationsCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  specTabsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  specTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  specTabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  specsContent: {
    gap: 16,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  specLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  specValue: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  qualityChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  qualityChipText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Description and other cards
  descriptionCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  showMoreButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: "600",
  },
  featuresSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },

  // Delivery Card
  deliveryCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  deliveryInfo: {
    gap: 16,
  },
  deliveryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  deliveryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  deliveryContent: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  deliveryText: {
    fontSize: 14,
  },

  // Section Title
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },

  // Bottom Spacing
  bottomSpacing: {
    height: 20,
  },

  // Bottom Action Bar
  bottomActionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  favoriteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  contactButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  chatButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  chatButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  primaryActionButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  primaryActionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 8,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export default ProductDetailScreen;
