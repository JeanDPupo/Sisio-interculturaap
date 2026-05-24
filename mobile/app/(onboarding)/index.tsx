import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  ViewToken,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAppStore } from '@/store/useAppStore';
import { OnboardingSlides } from '@/constants';
import { Button } from '@/components/ui';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColor();
  const setHasSeenOnboarding = useAppStore((state) => state.setHasSeenOnboarding);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const handleNext = () => {
    if (currentIndex < OnboardingSlides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = () => {
    setHasSeenOnboarding(true);
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    setHasSeenOnboarding(true);
    router.replace('/(tabs)');
  };

  const renderSlide = ({ item, index }: { item: typeof OnboardingSlides[0]; index: number }) => {
    return (
      <View style={[styles.slide, { width }]}>
        <Image source={item.image} style={styles.backgroundImage} />
        <LinearGradient
          colors={['transparent', 'rgba(13,27,15,0.7)', 'rgba(13,27,15,0.95)']}
          style={styles.gradient}
        />
        <View style={[styles.content, { paddingBottom: insets.bottom + 120 }]}>
          {index === 0 && (
            <Animated.View
              entering={FadeInUp.delay(300).springify()}
              style={styles.logoContainer}
            >
              <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>
          )}
          <Animated.Text entering={FadeInDown.delay(400).springify()} style={styles.title}>
            {item.title}
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(500).springify()} style={styles.subtitle}>
            {item.subtitle}
          </Animated.Text>
          {item.subtitleNative && (
            <Animated.Text entering={FadeInDown.delay(600).springify()} style={styles.subtitleNative}>
              {item.subtitleNative}
            </Animated.Text>
          )}
          <Animated.Text
            entering={FadeInDown.delay(700).springify()}
            style={[styles.description, { color: colors.muted }]}
          >
            {item.description}
          </Animated.Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        ref={flatListRef}
        data={OnboardingSlides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        keyExtractor={(item) => item.id.toString()}
      />

      <TouchableOpacity style={[styles.skipButton, { top: insets.top + 16 }]} onPress={handleSkip}>
        <Text style={[styles.skipText, { color: colors.muted }]}>Saltar</Text>
      </TouchableOpacity>

      <View style={[styles.bottomControls, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.pagination}>
          {OnboardingSlides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentIndex ? colors.accent : colors.muted,
                  width: index === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonsContainer}>
          {currentIndex === OnboardingSlides.length - 1 ? (
            <>
              <Button
                title="Crear cuenta"
                onPress={handleGetStarted}
                variant="primary"
                fullWidth
                icon={<Feather name="user-plus" size={20} color="#F0F7EE" />}
              />
              <View style={{ height: 12 }} />
              <Button
                title="Explorar como invitado"
                onPress={handleGetStarted}
                variant="outline"
                fullWidth
                icon={<Feather name="compass" size={20} color={colors.primary} />}
              />
            </>
          ) : (
            <Button
              title="Siguiente"
              onPress={handleNext}
              variant="primary"
              fullWidth
              icon={<Feather name="arrow-right" size={20} color="#F0F7EE" />}
              iconPosition="right"
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: { flex: 1, justifyContent: 'flex-end' },
  backgroundImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', resizeMode: 'cover' },
  gradient: { ...StyleSheet.absoluteFillObject },
  content: { paddingHorizontal: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 120, height: 120 },
  title: { fontSize: 48, fontWeight: '800', color: '#F0F7EE', textAlign: 'center', letterSpacing: -1 },
  subtitle: { fontSize: 20, fontWeight: '600', color: '#F0F7EE', textAlign: 'center', marginTop: 8 },
  subtitleNative: { fontSize: 16, fontStyle: 'italic', color: '#F5C842', textAlign: 'center', marginTop: 4 },
  description: { fontSize: 16, textAlign: 'center', marginTop: 16, lineHeight: 24 },
  skipButton: { position: 'absolute', right: 24 },
  skipText: { fontSize: 16, fontWeight: '500' },
  bottomControls: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24 },
  pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 24, gap: 8 },
  dot: { height: 8, borderRadius: 4 },
  buttonsContainer: { gap: 12 },
});
