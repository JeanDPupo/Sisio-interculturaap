import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore, colors } from '@sisio/shared';

const { width, height } = Dimensions.get('window');

const LOGO_LETTERS = ['S', 'I', 'S', 'I', 'O'];
const BIRD_START_X = width + 50;
const BIRD_END_X = -100;

export const SplashScreen = ({ navigation }: any) => {
  const { isGuest, isAuthenticated } = useAuthStore();

  const birdTranslateX = useSharedValue(BIRD_START_X);
  const birdOpacity = useSharedValue(0);
  const birdScale = useSharedValue(0.6);

  const letterOpacities = LOGO_LETTERS.map(() => useSharedValue(0));
  const subtitleOpacity = useSharedValue(0);

  useEffect(() => {
    birdTranslateX.value = withTiming(BIRD_END_X, {
      duration: 2000,
      easing: Easing.inOut(Easing.quad),
    });
    birdOpacity.value = withTiming(1, { duration: 300 }, () => {
      birdOpacity.value = withTiming(0, { duration: 500 }, () => {});
    });
    birdScale.value = withTiming(1, { duration: 1000 });

    LOGO_LETTERS.forEach((_, index) => {
      letterOpacities[index].value = withDelay(
        400 + index * 200,
        withTiming(1, { duration: 400 })
      );
    });

    subtitleOpacity.value = withDelay(
      400 + LOGO_LETTERS.length * 200 + 200,
      withTiming(1, { duration: 600 })
    );

    const timer = setTimeout(() => {
      if (isGuest || isAuthenticated) {
        navigation.replace('Main');
      } else {
        navigation.replace('Onboarding');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, isGuest, isAuthenticated]);

  const birdStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: birdTranslateX.value },
      { scale: birdScale.value },
    ],
    opacity: birdOpacity.value,
  } as any));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0D1B0F', '#1A3A0F', '#0D1B0F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <LinearGradient
        colors={['rgba(45, 80, 22, 0.15)', 'rgba(139, 195, 74, 0.05)', 'rgba(45, 80, 22, 0.15)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.forestOverlay}
      />

      <Animated.View style={[styles.birdContainer, birdStyle]}>
        <Text style={styles.birdEmoji}>🦅</Text>
      </Animated.View>

      <View style={styles.logoContainer}>
        <View style={styles.logoRow}>
          {LOGO_LETTERS.map((letter, index) => {
            const letterStyle = useAnimatedStyle(() => ({
              opacity: letterOpacities[index].value,
              transform: [{ translateY: (1 - letterOpacities[index].value) * 20 }],
            }));

            return (
              <Animated.Text
                key={index}
                style={[styles.logoLetter, letterStyle]}
              >
                {letter}
              </Animated.Text>
            );
          })}
        </View>

        <Animated.View style={[styles.subtitleContainer, { opacity: subtitleOpacity }]}>
          <Text style={styles.subtitle}>Aves de la Sierra Nevada</Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.footerContainer, { opacity: subtitleOpacity }]}>
        <View style={styles.divider} />
        <Text style={styles.footerText}>Sierra Nevada de Santa Marta</Text>
        <Text style={styles.footerSubtext}>Conocimiento Ancestral</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B0F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forestOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  birdContainer: {
    position: 'absolute',
    top: height * 0.3,
  },
  birdEmoji: {
    fontSize: 48,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logoLetter: {
    fontSize: 64,
    fontWeight: '900',
    color: '#F0F7EE',
    letterSpacing: 8,
  },
  subtitleContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#D4A017',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(212, 160, 23, 0.4)',
    marginBottom: 16,
    borderRadius: 1,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(240, 247, 238, 0.4)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  footerSubtext: {
    fontSize: 10,
    fontWeight: '300',
    color: 'rgba(212, 160, 23, 0.3)',
    letterSpacing: 1,
    marginTop: 4,
  },
});
