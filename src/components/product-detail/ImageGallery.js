import React from "react";
import { View, Image, FlatList, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/Theme";

const { width: screenWidth } = Dimensions.get("window");

/**
 * ImageGallery - Product image carousel with indicators
 * @param {Array} images - Array of image URLs
 * @param {number} selectedIndex - Currently selected image index
 * @param {Function} onIndexChange - Callback when image index changes
 */
const ImageGallery = ({ images = [], selectedIndex = 0, onIndexChange }) => {
  const { COLORS } = useTheme();

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onIndexChange}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.productImage} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Image Indicators */}
      <View style={styles.imageIndicators}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor:
                  index === selectedIndex ? COLORS.primary : COLORS.gray300,
                width: index === selectedIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  },
});

export default ImageGallery;
