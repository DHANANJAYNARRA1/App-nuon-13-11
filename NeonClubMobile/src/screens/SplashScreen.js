import React, { useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NEON_COLORS } from '../utils/colors';
import { AuthContext } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);
  const logoAnim = new Animated.Value(0);

  console.log('Rendering SplashScreen');
  console.log('User Context in SplashScreen:', user);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto navigate after short delay, route depends on auth state

    const timer = setTimeout(() => {
      if (user) {
        if (!user.isProfileComplete) {
          navigation.replace('ProfileSetup');
        } else {
          navigation.replace('Main');
        }
      } else {
        navigation.replace('ValueProposition');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [user]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={NEON_COLORS.gradientPurpleToBlue}
        style={styles.gradientBackground}
      >
      {/* Animated floating circles */}
      <Animated.View
        style={[
          styles.floatingCircle1,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.6],
            }),
            transform: [
              {
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.2],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCircle2,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.2, 0.5],
            }),
            transform: [
              {
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1.2, 0.8],
                }),
              },
            ],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logo}>
          <Text style={styles.logoText}>⚡</Text>
        </View>
        <Animated.Text
          style={[
            styles.appName,
            {
              opacity: logoAnim,
              transform: [{ translateY: logoAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }) }],
            },
          ]}
        >
          Neon Club
        </Animated.Text>
        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: logoAnim,
              transform: [{ translateY: logoAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }) }],
            },
          ]}
        >
          Empowering Healthcare Professionals
        </Animated.Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.footer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.footerText}>In collaboration with Ozone Hospital</Text>
      </Animated.View>

      {/* Bouncing dots */}
      <Animated.View
        style={[
          styles.bouncingDots,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {[0, 1, 2].map((index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -10],
                    }),
                  },
                ],
                animationDelay: `${index * 0.2}s`,
              },
            ]}
          />
        ))}
      </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingCircle1: {
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.1,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: NEON_COLORS.neonPurpleGlow,
    blurRadius: 64,
  },
  floatingCircle2: {
    position: 'absolute',
    bottom: height * 0.3,
    right: width * 0.1,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: NEON_COLORS.neonBlueGlow,
    blurRadius: 64,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 24,
    backgroundColor: NEON_COLORS.glassBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: NEON_COLORS.neonPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: NEON_COLORS.glassBorder,
  },
  logoText: {
    fontSize: 48,
    color: NEON_COLORS.neonPurple,
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: NEON_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: NEON_COLORS.neonPurple,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 16,
    color: NEON_COLORS.neonBlue,
    textAlign: 'center',
    fontWeight: '300',
  },
  footer: {
    position: 'absolute',
    bottom: 100,
    zIndex: 10,
  },
  footerText: {
    fontSize: 14,
    color: NEON_COLORS.neonBlue,
    textAlign: 'center',
  },
  bouncingDots: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: NEON_COLORS.textPrimary,
    marginHorizontal: 4,
    shadowColor: NEON_COLORS.neonPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
});

export default SplashScreen;