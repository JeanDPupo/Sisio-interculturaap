import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@sisio/shared';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Sisio',
    subtitle: 'Conocimiento Ancestral',
    description: 'Conexión ancestral con las aves de la Sierra Nevada',
    communities: 'Arhuaco · Kogui · Wiwa · Kankuamo',
    gradient: ['#0D1B0F', '#1A3A0F', '#2D5016'],
  },
  {
    id: '2',
    title: 'Identifica y Aprende',
    subtitle: 'Cada ave tiene una historia',
    description:
      'Captura una foto o graba el canto para descubrir la identidad y el significado ancestral de cada ave',
    features: [
      { icon: '📷', title: 'Identificación por Foto', description: 'Captura y reconoce especies al instante' },
      { icon: '🎙️', title: 'Identificación por Sonido', description: 'Graba el canto del ave para identificarla' },
      { icon: '🗺️', title: 'Mapa de Avistamientos', description: 'Explora avistamientos cerca de ti' },
    ],
    gradient: ['#1A3A0F', '#2D5016', '#4A7C2F'],
  },
  {
    id: '3',
    title: 'Bienvenido',
    subtitle: 'Elige cómo quieres explorar',
    description: 'Únete a la comunidad o explora sin compromiso',
    gradient: ['#0D1B0F', '#1A3A4A', '#2E7D9A'],
  },
];

export const OnboardingScreen = ({ navigation }: any) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guestName, setGuestName] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(false);
  const { createGuestUser, loading } = useAuth();

  const scrollX = useSharedValue(0);

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }, []);

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

  const goToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
    }
  };

  const handleGuestContinue = async () => {
    if (!guestName.trim()) return;
    try {
      await createGuestUser(guestName.trim());
      navigation.replace('Main');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderSlide1 = ({ item }: any) => (
    <View style={[styles.slideContainer, { width }]}>
      <LinearGradient
        colors={item.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.slideBackground}
      />
      <View style={styles.slideContent}>
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.slide1BirdContainer}>
          <Text style={styles.slide1BirdEmoji}>🦅</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Text style={styles.slide1Title}>{item.title}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).springify()}>
          <Text style={styles.slide1Subtitle}>{item.subtitle}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(800).springify()}>
          <Text style={styles.slide1Description}>{item.description}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1000).springify()} style={styles.slide1Communities}>
          <Text style={styles.slide1CommunitiesText}>{item.communities}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1200).springify()}>
          <GradientButton
            title="Comenzar"
            onPress={goToNext}
            gradientColors={['#D4A017', '#F5C842']}
            textColor="#0D1B0F"
          />
        </Animated.View>
      </View>
    </View>
  );

  const renderSlide2 = ({ item }: any) => (
    <View style={[styles.slideContainer, { width }]}>
      <LinearGradient
        colors={item.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.slideBackground}
      />
      <View style={styles.slideContent}>
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Text style={styles.slide2Title}>{item.title}</Text>
          <Text style={styles.slide2Subtitle}>{item.subtitle}</Text>
        </Animated.View>

        {item.features.map((feature: any, index: number) => (
          <Animated.View
            key={index}
            entering={FadeInDown.delay(400 + index * 150).springify()}
            style={styles.featureRow}
          >
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );

  const renderSlide3 = ({ item }: any) => (
    <View style={[styles.slideContainer, { width }]}>
      <LinearGradient
        colors={item.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.slideBackground}
      />
      <View style={styles.slideContent}>
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Text style={styles.slide3Title}>{item.title}</Text>
          <Text style={styles.slide3Subtitle}>{item.description}</Text>
        </Animated.View>

        {showGuestForm ? (
          <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.guestFormContainer}>
            <GlassCard
              intensity={60}
              borderRadius={20}
              gradientColors={['rgba(45, 80, 22, 0.1)', 'rgba(74, 124, 47, 0.05)']}
            >
              <View style={styles.guestFormContent}>
                <Text style={styles.guestFormLabel}>¿Cómo te llamas?</Text>
                <TextInput
                  style={styles.guestInput}
                  placeholder="Tu nombre"
                  placeholderTextColor="rgba(240, 247, 238, 0.3)"
                  value={guestName}
                  onChangeText={setGuestName}
                  autoCapitalize="words"
                />
                <GradientButton
                  title={loading ? 'Entrando...' : 'Explorar como Invitado'}
                  onPress={handleGuestContinue}
                  disabled={!guestName.trim() || loading}
                  gradientColors={['#2D5016', '#4A7C2F']}
                  textColor="#F0F7EE"
                />
                <TouchableOpacity
                  onPress={() => setShowGuestForm(false)}
                  style={styles.backButton}
                >
                  <Text style={styles.backButtonText}>Volver</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.slide3Buttons}>
            <GradientButton
              title="Entrar como Usuario"
              onPress={() => navigation.navigate('Login')}
              gradientColors={['#D4A017', '#F5C842']}
              textColor="#0D1B0F"
              style={{ marginBottom: 16 }}
            />
            <GradientButton
              title="Explorar como Invitado"
              onPress={() => setShowGuestForm(true)}
              gradientColors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              textColor="#F0F7EE"
            />
            <Text style={styles.slide3Communities}>
              Arhuaco · Kogui · Wiwa · Kankuamo
            </Text>
          </Animated.View>
        )}
      </View>
    </View>
  );

  const renderItem = ({ item, index }: any) => {
    switch (index) {
      case 0:
        return renderSlide1({ item });
      case 1:
        return renderSlide2({ item });
      case 2:
        return renderSlide3({ item });
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
        />

        {currentIndex > 0 && (
          <TouchableOpacity
            style={[styles.navArrow, styles.navArrowLeft]}
            onPress={goToPrevious}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={24} color="#F0F7EE" />
          </TouchableOpacity>
        )}

        {currentIndex < SLIDES.length - 1 && (
          <TouchableOpacity
            style={[styles.navArrow, styles.navArrowRight]}
            onPress={goToNext}
            activeOpacity={0.7}
          >
            <Feather name="chevron-right" size={24} color="#F0F7EE" />
          </TouchableOpacity>
        )}

        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => {
            const dotStyle = useAnimatedStyle(() => ({
              width: index === currentIndex ? 28 : 8,
              opacity: index === currentIndex ? 1 : 0.4,
            }));

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  dotStyle,
                  { backgroundColor: index === currentIndex ? '#D4A017' : 'rgba(240, 247, 238, 0.3)' },
                ]}
              />
            );
          })}
        </View>

        {currentIndex < SLIDES.length - 1 && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => flatListRef.current?.scrollToIndex({ index: SLIDES.length - 1, animated: true })}
          >
            <Text style={styles.skipButtonText}>Saltar</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D1B0F',
  },
  container: {
    flex: 1,
  },
  slideContainer: {
    flex: 1,
  },
  slideBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  slide1BirdContainer: {
    marginBottom: 24,
  },
  slide1BirdEmoji: {
    fontSize: 64,
  },
  slide1Title: {
    fontSize: 56,
    fontWeight: '900',
    color: '#F0F7EE',
    fontFamily: theme.fonts.display,
    letterSpacing: 4,
    marginBottom: 12,
  },
  slide1Subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D4A017',
    fontFamily: theme.fonts.native,
    letterSpacing: 2,
    marginBottom: 8,
  },
  slide1Description: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(240, 247, 238, 0.6)',
    fontFamily: theme.fonts.body,
    textAlign: 'center',
    marginBottom: 12,
  },
  slide1Communities: {
    marginTop: 8,
    marginBottom: 40,
  },
  slide1CommunitiesText: {
    fontSize: 12,
    fontWeight: '300',
    color: 'rgba(212, 160, 23, 0.5)',
    letterSpacing: 1.5,
  },

  slide2Title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F0F7EE',
    textAlign: 'center',
    marginBottom: 8,
  },
  slide2Subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(240, 247, 238, 0.6)',
    textAlign: 'center',
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
    gap: 16,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(212, 160, 23, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F0F7EE',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(240, 247, 238, 0.5)',
    lineHeight: 18,
  },

  slide3Title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F0F7EE',
    textAlign: 'center',
    marginBottom: 8,
  },
  slide3Subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(240, 247, 238, 0.6)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  slide3Buttons: {
    width: '100%',
    alignItems: 'center',
  },
  slide3Communities: {
    marginTop: 32,
    fontSize: 11,
    fontWeight: '300',
    color: 'rgba(212, 160, 23, 0.4)',
    letterSpacing: 1.5,
  },
  guestFormContainer: {
    width: '100%',
  },
  guestFormContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  guestFormLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(240, 247, 238, 0.5)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  guestInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#F0F7EE',
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(240, 247, 238, 0.5)',
  },

  navArrow: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navArrowLeft: {
    left: 16,
  },
  navArrowRight: {
    right: 16,
  },

  dotsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },

  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(240, 247, 238, 0.5)',
  },
});
