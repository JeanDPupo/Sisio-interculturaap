import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@sisio/shared';
import { useThemeColor } from '../hooks';

export const SplashScreen = ({ navigation }: any) => {
  const { colors } = useThemeColor();
  const birdScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const dotScale = useSharedValue(0);

  useEffect(() => {
    // Bird animation (flies in from right)
    birdScale.value = withTiming(1, { duration: 1200 });

    // Logo fades in and scales
    logoOpacity.value = withDelay(400, withTiming(1, { duration: 1200 }));

    // Loading dots pulse
    dotScale.value = withRepeat(
      withTiming(1.2, { duration: 1000 }),
      -1,
      true
    );

    // Navigate after 3 seconds
    const timer = setTimeout(() => {
      const { isGuest, isAuthenticated } = useAuthStore.getState();
      if (isGuest || isAuthenticated) {
        navigation.replace('Main');
      } else {
        navigation.replace('Onboarding');
      }
    }, 3200);

    return () => clearTimeout(timer);
  }, [navigation, birdScale, logoOpacity, dotScale]);

  const birdStyle = useAnimatedStyle(() => ({
    opacity: birdScale.value,
    transform: [{ scale: birdScale.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[
          `${colors.primaryLight}15`,
          `${colors.secondary}08`,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Main Content */}
      <View style={styles.content}>
        {/* Bird Icon Animation */}
        <Animated.View style={[styles.birdContainer, birdStyle]}>
          <View
            style={[
              styles.birdCircle,
              { borderColor: colors.primaryLight },
            ]}
          >
            <Feather
              name="feather"
              size={56}
              color={colors.primaryLight}
            />
          </View>
        </Animated.View>

        {/* Logo */}
        <Animated.Text
          style={[
            styles.logo,
            { color: colors.secondary },
            logoStyle,
          ]}
        >
          SISIO
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text
          entering={FadeInDown.delay(800).springify()}
          style={[
            styles.subtitle,
            { color: colors.foreground },
          ]}
        >
          Conocimiento Ancestral
        </Animated.Text>

        {/* Divider */}
        <Animated.View
          entering={FadeIn.delay(1000).springify()}
          style={[
            styles.divider,
            { backgroundColor: colors.accent },
          ]}
        />

        {/* Tagline */}
        <Animated.Text
          entering={FadeInUp.delay(1200).springify()}
          style={[
            styles.tagline,
            { color: colors.muted },
          ]}
        >
          Preservando la sabiduría{'\n'}de la Sierra Nevada
        </Animated.Text>
      </View>

      {/* Loading Dots */}
      <Animated.View
        entering={FadeInUp.delay(1400).springify()}
        style={styles.loadingContainer}
      >
        <View style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: colors.accent },
                dotStyle,
              ]}
            />
          ))}
        </View>
        <Text style={[styles.loadingText, { color: colors.muted }]}>
          Inicializando...
        </Text>
      </Animated.View>

      {/* Footer */}
      <Animated.Text
        entering={FadeInUp.delay(1600).springify()}
        style={[styles.footer, { color: colors.muted }]}
      >
        Sierra Nevada de Santa Marta
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    marginBottom: 60,
  },
  birdContainer: {
    marginBottom: 28,
  },
  birdCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 195, 74, 0.08)',
  },
  logo: {
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: 12,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  divider: {
    width: 60,
    height: 2,
    marginVertical: 20,
    borderRadius: 1,
  },
  tagline: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 40,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  loadingText: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
