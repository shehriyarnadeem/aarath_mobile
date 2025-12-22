import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../constants/Theme";
import { useAuth } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

// Advanced Particle System
const ParticleElement = ({ colors, delay, size, position, type }) => {
  const floatAnim = new Animated.Value(0);
  const rotateAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);

  React.useEffect(() => {
    const startAnimation = () => {
      // Entrance animation
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous animations
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 4000 + delay * 200,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 4000 + delay * 200,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 8000 + delay * 300,
          useNativeDriver: true,
        })
      ).start();
    };

    const timer = setTimeout(startAnimation, delay);
    return () => clearTimeout(timer);
  }, []);

  const getParticleStyle = () => {
    switch (type) {
      case "leaf":
        return {
          backgroundColor: colors.primary300,
          borderTopLeftRadius: size,
          borderTopRightRadius: size,
          borderBottomLeftRadius: size / 4,
          borderBottomRightRadius: size,
        };
      case "circle":
        return {
          backgroundColor: colors.secondary300,
          borderRadius: size / 2,
        };
      case "diamond":
        return {
          backgroundColor: colors.primary400,
          transform: [{ rotate: "45deg" }],
          borderRadius: size / 6,
        };
      default:
        return {
          backgroundColor: colors.primary200,
          borderRadius: size / 2,
        };
    }
  };

  return (
    <Animated.View
      style={[
        styles.particleElement,
        position,
        {
          width: size,
          height: size,
          opacity: opacityAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.6],
          }),
          transform: [
            {
              scale: scaleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
            {
              translateY: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -30],
              }),
            },
            {
              translateX: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, Math.sin(delay) * 15],
              }),
            },
            {
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"],
              }),
            },
          ],
        },
        getParticleStyle(),
      ]}
    />
  );
};

// Advanced Logo Component with Multiple Effects
const AarathLogo = ({ colors, animatedValue, pulseAnim, shineAnim }) => {
  const logoRotateAnim = new Animated.Value(0);
  const logoFloatAnim = new Animated.Value(0);

  React.useEffect(() => {
    // Subtle continuous rotation
    Animated.loop(
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    // Gentle floating effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(logoFloatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.logoContainer,
        {
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 0.3, 0.7, 1],
                outputRange: [0.2, 1.2, 0.9, 1],
              }),
            },
            {
              translateY: logoFloatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -8],
              }),
            },
          ],
          opacity: animatedValue,
        },
      ]}
    >
      {/* Multiple Pulsing Rings */}
      <Animated.View
        style={[
          styles.pulseRing,
          styles.pulseRingOuter,
          {
            borderColor: colors.primary200,
            transform: [
              {
                scale: pulseAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.5],
                }),
              },
            ],
            opacity: pulseAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0],
            }),
          },
        ]}
      />

      <Animated.View
        style={[
          styles.pulseRing,
          {
            borderColor: colors.primary400,
            transform: [
              {
                scale: pulseAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.3],
                }),
              },
            ],
            opacity: pulseAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 0],
            }),
          },
        ]}
      />

      {/* Rotating Background Decoration */}
      <Animated.View
        style={[
          styles.logoDecoration,
          {
            borderColor: colors.primary100,
            transform: [
              {
                rotate: logoRotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          },
        ]}
      />

      {/* Logo Container with Shine Effect */}
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            transform: [
              {
                rotate: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["-15deg", "0deg"],
                }),
              },
            ],
          },
        ]}
      >
        {/* Shine Overlay */}
        <Animated.View
          style={[
            styles.shineOverlay,
            {
              opacity: shineAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.7, 0],
              }),
              transform: [
                {
                  translateX: shineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-120, 120],
                  }),
                },
              ],
            },
          ]}
        />

        <Animated.Image
          source={require("../../assets/logo.png")}
          style={[
            styles.logoImage,
            {
              opacity: animatedValue,
              transform: [
                {
                  scale: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.05],
                  }),
                },
              ],
            },
          ]}
          resizeMode="contain"
        />
      </Animated.View>
    </Animated.View>
  );
};

const SplashScreen = ({ navigation }) => {
  const { COLORS, SIZES } = useTheme();
  const { isAuthenticated } = useAuth();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const pulseAnim = React.useRef(new Animated.Value(0)).current;
  const bounceAnim = React.useRef(new Animated.Value(0)).current;
  const colorAnim = React.useRef(new Animated.Value(0)).current;
  const shineAnim = React.useRef(new Animated.Value(0)).current;
  const waveAnim = React.useRef(new Animated.Value(0)).current;
  const sparkleAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start multiple animated sequences
    Animated.parallel([
      // Main fade and slide
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
      // Color animation
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }),
    ]).start();

    // Advanced pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Dynamic bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shine effect animation
    const startShineAnimation = () => {
      Animated.loop(
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();
    };

    setTimeout(startShineAnimation, 1000);

    // Wave effect animation
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();

    // Sparkle effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colorAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [
              COLORS.primary50,
              COLORS.primary100,
              COLORS.primary50,
            ],
          }),
        },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Advanced Particle System */}
      <ParticleElement
        colors={COLORS}
        delay={0}
        size={50}
        type="leaf"
        position={{ top: height * 0.15, left: width * 0.1 }}
      />
      <ParticleElement
        colors={COLORS}
        delay={300}
        size={35}
        type="circle"
        position={{ top: height * 0.25, right: width * 0.12 }}
      />
      <ParticleElement
        colors={COLORS}
        delay={600}
        size={60}
        type="diamond"
        position={{ top: height * 0.65, left: width * 0.08 }}
      />
      <ParticleElement
        colors={COLORS}
        delay={900}
        size={40}
        type="leaf"
        position={{ top: height * 0.75, right: width * 0.15 }}
      />
      <ParticleElement
        colors={COLORS}
        delay={1200}
        size={25}
        type="circle"
        position={{ top: height * 0.35, left: width * 0.85 }}
      />
      <ParticleElement
        colors={COLORS}
        delay={1500}
        size={45}
        type="diamond"
        position={{ top: height * 0.85, left: width * 0.75 }}
      />

      {/* Background Wave Effect */}
      <Animated.View
        style={[
          styles.waveBackground,
          {
            backgroundColor: COLORS.primary100,
            opacity: waveAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.1, 0.3, 0.1],
            }),
            transform: [
              {
                scale: waveAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.2],
                }),
              },
            ],
          },
        ]}
      />

      {/* Sparkle Effects */}
      {[...Array(8)].map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.sparkle,
            {
              top: Math.random() * height,
              left: Math.random() * width,
              backgroundColor: COLORS.secondary400,
              opacity: sparkleAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 1, 0],
              }),
              transform: [
                {
                  scale: sparkleAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 1, 0],
                  }),
                },
                {
                  rotate: `${index * 45}deg`,
                },
              ],
            },
          ]}
        />
      ))}

      {/* Main Content Container */}
      <View style={styles.contentWrapper}>
        {/* Animated Logo Section */}
        <Animated.View
          style={[
            styles.logoSection,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 50],
                    outputRange: [0, -30],
                  }),
                },
              ],
              opacity: fadeAnim,
            },
          ]}
        >
          <AarathLogo
            colors={COLORS}
            animatedValue={fadeAnim}
            pulseAnim={pulseAnim}
            shineAnim={shineAnim}
          />
        </Animated.View>

        {/* Dynamic Text Section */}
        <Animated.View
          style={[
            styles.textSection,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 50],
                    outputRange: [0, 20],
                  }),
                },
                {
                  scale: bounceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.05],
                  }),
                },
              ],
              opacity: fadeAnim.interpolate({
                inputRange: [0, 0.6, 1],
                outputRange: [0, 0, 1],
              }),
            },
          ]}
        >
          <Animated.Text
            style={[
              styles.dynamicTitle,
              {
                color: colorAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [
                    COLORS.primary600,
                    COLORS.primary700,
                    COLORS.primary600,
                  ],
                }),
              },
            ]}
          >
            Pakistan's First
          </Animated.Text>
          <Animated.Text
            style={[
              styles.dynamicSubtitle,
              {
                color: COLORS.primary800,
                transform: [
                  {
                    scale: bounceAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.02],
                    }),
                  },
                ],
              },
            ]}
          >
            Agricultural Marketplace
          </Animated.Text>
        </Animated.View>

        {/* Creative Loading Section */}
        <Animated.View
          style={[
            styles.creativeLoadingSection,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 0.7, 1],
                outputRange: [0, 0, 1],
              }),
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 50],
                    outputRange: [0, 15],
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.loadingContainer,
              {
                backgroundColor: COLORS.white,
                transform: [
                  {
                    scale: pulseAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.05],
                    }),
                  },
                ],
              },
            ]}
          >
            <ActivityIndicator
              size="large"
              color={COLORS.primary600}
              style={styles.modernLoader}
            />
            <Animated.Text
              style={[
                styles.loadingMessage,
                {
                  color: COLORS.primary700,
                  opacity: bounceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1],
                  }),
                },
              ]}
            >
              🌾 Growing your marketplace experience...
            </Animated.Text>
          </Animated.View>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  particleElement: {
    position: "absolute",
  },
  waveBackground: {
    position: "absolute",
    width: width * 2,
    height: width * 2,
    borderRadius: width,
    top: -width / 2,
    left: -width / 2,
  },
  sparkle: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 60,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  logoSection: {
    marginBottom: 50,
  },
  logoContainer: {
    alignItems: "center",
    position: "relative",
  },
  pulseRing: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    top: -20,
    left: -20,
  },
  pulseRingOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    top: -40,
    left: -40,
  },
  logoDecoration: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderStyle: "dashed",
    top: -30,
    left: -30,
    opacity: 0.2,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    overflow: "hidden",
    position: "relative",
  },
  shineOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    transform: [{ skewX: "-20deg" }],
    width: 30,
  },
  logoImage: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
  },
  textSection: {
    alignItems: "center",
    marginBottom: 70,
    paddingHorizontal: 25,
  },
  dynamicTitle: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 1.5,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  dynamicSubtitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 18,
    letterSpacing: 0.8,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  dynamicDescription: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 28,
  },
  creativeLoadingSection: {
    alignItems: "center",
    width: "100%",
  },
  loadingContainer: {
    paddingVertical: 35,
    paddingHorizontal: 45,
    borderRadius: 30,
    alignItems: "center",
    minWidth: width * 0.85,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  modernLoader: {
    marginBottom: 25,
    transform: [{ scale: 1.4 }],
  },
  loadingMessage: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 26,
    letterSpacing: 0.8,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default SplashScreen;
