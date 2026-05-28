import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  KeyboardAvoidingView,
  TextInput,
  SafeAreaView,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { useAuthStore, apiService } from '@sisio/shared';
import { Button, GlassCard } from '../components';
import { useThemeColor } from '../hooks';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Sisio',
    subtitle: 'Conocimiento Ancestral',
    description:
      'La sabiduría de los pueblos Arhuaco, Kogui, Wiwa y Kankuamo sobre las aves de la Sierra Nevada',
    gradient: ['rgba(45, 80, 22, 0.3)', 'rgba(74, 124, 47, 0.1)'],
  },
  {
    id: 2,
    title: 'Identifica & Aprende',
    subtitle: 'Cada ave tiene una historia',
    description:
      'Captura una foto o graba el canto para descubrir la identidad y el significado ancestral',
    gradient: ['rgba(212, 160, 23, 0.3)', 'rgba(245, 200, 66, 0.1)'],
  },
  {
    id: 3,
    title: 'Preserva la Cultura',
    subtitle: 'Sé parte de la memoria viva',
    description:
      'Contribuye a la preservación del conocimiento indígena mientras exploras la naturaleza',
    gradient: ['rgba(46, 125, 154, 0.3)', 'rgba(100, 181, 246, 0.1)'],
  },
];

export const OnboardingScreen = ({ navigation }: any) => {
  const { colors, isDark } = useThemeColor();
  const scrollRef = useRef<ScrollView>(null);
  const { guestLogin } = useAuthStore();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const scrollX = useSharedValue(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slide);
    scrollX.value = e.nativeEvent.contentOffset.x;
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: (currentSlide + 1) * width, animated: true });
    } else {
      setShowRegister(true);
    }
  };

  const handleSkip = () => {
    setShowRegister(true);
  };

  const handleContinueAsGuest = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const response = await apiService.createGuestUser(name.trim());
      const data = response.data;
      guestLogin({
        name: name.trim(),
        guest_id: data.guest_id,
      });
      navigation.replace('Main');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showRegister) {
    return <ModeSelectionSlide colors={colors} isDark={isDark} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Skip Button */}
      <Animated.View entering={FadeInUp.delay(200).springify()}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 50,
            right: 16,
            zIndex: 10,
            paddingVertical: 8,
            paddingHorizontal: 14,
          }}
          onPress={handleSkip}
        >
          <Text style={{ color: colors.muted, fontSize: 13, fontWeight: '500' }}>
            Saltar
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {slides.map((slide, index) => (
          <OnboardingSlide
            key={slide.id}
            slide={slide}
            index={index}
            colors={colors}
            isDark={isDark}
            scrollX={scrollX}
          />
        ))}
      </ScrollView>

      {/* Footer */}
      <Animated.View entering={FadeInUp.delay(400).springify()}>
        <View style={{ paddingHorizontal: 16, paddingBottom: 40, paddingTop: 16 }}>
          {/* Pagination Dots */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 20,
              gap: 6,
            }}
          >
            {slides.map((_, idx) => (
              <Animated.View
                key={idx}
                style={[
                  {
                    height: 6,
                    borderRadius: 3,
                    backgroundColor:
                      idx === currentSlide
                        ? colors.accent
                        : colors.border,
                  },
                  {
                    width: idx === currentSlide ? 24 : 8,
                  },
                ]}
              />
            ))}
          </View>

          {/* Next Button */}
          <Button
            title={currentSlide < slides.length - 1 ? 'Siguiente' : 'Comenzar'}
            onPress={handleNext}
            fullWidth
          />
        </View>
      </Animated.View>
    </View>
  );
};

interface OnboardingSlidePropss {
  slide: (typeof slides)[0];
  index: number;
  colors: any;
  isDark: boolean;
  scrollX: Animated.Shared<number>;
}

const OnboardingSlide: React.FC<OnboardingSlidePropss> = ({
  slide,
  index,
  colors,
  isDark,
  scrollX,
}) => {
  const titleOpacity = useSharedValue(0);
  const titleTranslate = useSharedValue(50);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslate = useSharedValue(50);
  const descriptionOpacity = useSharedValue(0);
  const descriptionTranslate = useSharedValue(50);

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 600 });
    titleTranslate.value = withSpring(0, { damping: 15 });

    subtitleOpacity.value = withTiming(1, { duration: 600, delay: 200 });
    subtitleTranslate.value = withSpring(0, { damping: 15, delay: 200 });

    descriptionOpacity.value = withTiming(1, { duration: 600, delay: 400 });
    descriptionTranslate.value = withSpring(0, { damping: 15, delay: 400 });
  }, [index]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslate.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslate.value }],
  }));

  const descriptionStyle = useAnimatedStyle(() => ({
    opacity: descriptionOpacity.value,
    transform: [{ translateY: descriptionTranslate.value }],
  }));

  return (
    <View
      style={{
        width,
        height,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
      }}
    >
      <LinearGradient
        colors={slide.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.3,
        }}
      />

      {/* Icon Animation */}
      <Animated.View
        entering={ZoomIn.delay(100).springify()}
        style={{ marginBottom: 32 }}
      >
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: `${slide.gradient[0]}50`,
            borderWidth: 2,
            borderColor: slide.gradient[0],
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Feather
            name={index === 0 ? 'feather' : index === 1 ? 'camera' : 'heart'}
            size={48}
            color={colors.foreground}
          />
        </View>
      </Animated.View>

      {/* Title */}
      <Animated.Text
        style={[
          {
            fontSize: 36,
            fontWeight: '800',
            color: colors.foreground,
            textAlign: 'center',
            marginBottom: 8,
          },
          titleStyle,
        ]}
      >
        {slide.title}
      </Animated.Text>

      {/* Subtitle */}
      <Animated.Text
        style={[
          {
            fontSize: 16,
            fontWeight: '600',
            color: colors.accent,
            textAlign: 'center',
            marginBottom: 20,
            letterSpacing: 0.5,
          },
          subtitleStyle,
        ]}
      >
        {slide.subtitle}
      </Animated.Text>

      {/* Description */}
      <Animated.Text
        style={[
          {
            fontSize: 15,
            color: colors.muted,
            textAlign: 'center',
            lineHeight: 24,
            paddingHorizontal: 12,
          },
          descriptionStyle,
        ]}
      >
        {slide.description}
      </Animated.Text>
    </View>
  );
};

// Mode Selection Slide Component
interface ModeSelectionSlideProps {
  colors: any;
  isDark: boolean;
}

const ModeSelectionSlide: React.FC<ModeSelectionSlideProps> = ({
  colors,
  isDark,
}) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { guestLogin } = useAuthStore();
  const navigation = useRef<any>(null);

  const handleContinueAsGuest = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const response = await apiService.createGuestUser(name.trim());
      const data = response.data;
      guestLogin({
        name: name.trim(),
        guest_id: data.guest_id,
      });
      // Navigate will happen via useEffect
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Section */}
          <Animated.View entering={FadeInUp.delay(100).springify()}>
            <View style={{ alignItems: 'center', marginBottom: 40 }}>
              <Animated.View
                entering={ZoomIn.delay(200).springify()}
                style={{ marginBottom: 16 }}
              >
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: `${colors.accent}20`,
                    borderWidth: 2,
                    borderColor: colors.accent,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Feather name="feather" size={40} color={colors.accent} />
                </View>
              </Animated.View>

              <Text
                style={{
                  fontSize: 28,
                  fontWeight: '800',
                  color: colors.foreground,
                  textAlign: 'center',
                }}
              >
                Bienvenido a{' '}
                <Text style={{ color: colors.accent }}>Sisio</Text>
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  color: colors.muted,
                  textAlign: 'center',
                  marginTop: 12,
                  lineHeight: 20,
                }}
              >
                El conocimiento ancestral sobre las aves te espera
              </Text>
            </View>
          </Animated.View>

          {/* Form Section */}
          <Animated.View entering={FadeInUp.delay(250).springify()}>
            <GlassCard
              intensity={60}
              borderRadius={20}
              gradientColors={[
                `${colors.primaryLight}10`,
                `${colors.primaryLight}05`,
              ]}
            >
              <View style={{ paddingVertical: 24, paddingHorizontal: 16 }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: colors.muted,
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  ¿Cómo te llamas?
                </Text>

                <TextInput
                  style={{
                    backgroundColor: `${colors.card}`,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontSize: 15,
                    color: colors.foreground,
                    marginBottom: 16,
                  }}
                  placeholder="Tu nombre"
                  placeholderTextColor={colors.muted}
                  value={name}
                  onChangeText={setName}
                  editable={!loading}
                  autoCapitalize="words"
                />

                <Button
                  title={loading ? 'Entrando...' : 'Explorar como Invitado'}
                  onPress={handleContinueAsGuest}
                  disabled={!name.trim() || loading}
                  loading={loading}
                  fullWidth
                />

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 20,
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      height: 1,
                      backgroundColor: colors.border,
                    }}
                  />
                  <Text style={{ color: colors.muted, fontSize: 12 }}>O</Text>
                  <View
                    style={{
                      flex: 1,
                      height: 1,
                      backgroundColor: colors.border,
                    }}
                  />
                </View>

                <Button
                  title="Crear Cuenta"
                  variant="secondary"
                  onPress={() => {
                    /* Navigation to Register */
                  }}
                  fullWidth
                  style={{ marginBottom: 12 }}
                />

                <TouchableOpacity style={{ paddingVertical: 8 }}>
                  <Text
                    style={{
                      color: colors.accent,
                      fontSize: 14,
                      fontWeight: '600',
                      textAlign: 'center',
                    }}
                  >
                    Ya tengo cuenta
                  </Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Footer Text */}
          <Animated.View
            entering={FadeInUp.delay(400).springify()}
            style={{ marginTop: 32 }}
          >
            <Text
              style={{
                fontSize: 12,
                color: colors.muted,
                textAlign: 'center',
                lineHeight: 18,
              }}
            >
              Proteges tu privacidad con nosotros.{'\n'}
              Lee nuestros términos de servicio
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
