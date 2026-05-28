import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { useAuthStore, apiService } from '@sisio/shared';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    icon: '🦅',
    title: 'Sisio',
    subtitle: 'Conocimiento Ancestral de la Sierra Nevada',
    description:
      'Descubre la sabiduría de las comunidades Arhuaco, Kogui, Wiwa y Kankuamo sobre las aves de tu territorio.',
  },
  {
    id: 2,
    icon: '📖',
    title: 'Identifica y Aprende',
    subtitle: 'Cada ave tiene una historia',
    description:
      'Toma una foto o graba su canto para identificar especies y conocer su significado ancestral, rol en la cosmovisión y las historias que las rodean.',
  },
  {
    id: 3,
    icon: '🌿',
    title: 'Preserva la Cultura',
    subtitle: 'Sé parte de la memoria viva',
    description:
      'Contribuye a la preservación del conocimiento indígena mientras exploras la riqueza natural de la Sierra Nevada.',
  },
];

export const OnboardingScreen = ({ navigation }: any) => {
  const scrollRef = useRef<ScrollView>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { guestLogin } = useAuthStore();

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slide);
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
      alert('Error al crear usuario. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (showRegister) {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.content}>
          <Text style={styles.welcomeIcon}>🦅</Text>
          <Text style={styles.welcomeTitle}>
            Bienvenido a {''}
            <Text style={styles.welcomeHighlight}>Sisio</Text>
          </Text>
          <Text style={styles.welcomeSubtitle}>
            El conocimiento ancestral sobre las aves te espera
          </Text>
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>¿Cómo te llamas?</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
            <TouchableOpacity
              style={[styles.primaryButton, (!name.trim() || loading) && styles.buttonDisabled]}
              onPress={handleContinueAsGuest}
              disabled={!name.trim() || loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Entrando...' : 'Explorar como Invitado'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Register')}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>Crear Cuenta</Text>
            </TouchableOpacity>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>O</Text>
              <View style={styles.dividerLine} />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Ya tengo cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Saltar</Text>
      </TouchableOpacity>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <Text style={styles.slideIcon}>{slide.icon}</Text>
            <Text style={styles.slideTitle}>{slide.title}</Text>
            <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
            <Text style={styles.slideDescription}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentSlide === index && styles.activeDot]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentSlide < slides.length - 1 ? 'Siguiente' : 'Comenzar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  skipText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  slideIcon: {
    fontSize: 72,
    marginBottom: 24,
  },
  slideTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    fontFamily: theme.fonts.display,
    marginBottom: 8,
  },
  slideSubtitle: {
    fontSize: 14,
    color: theme.colors.secondary,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  slideDescription: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: theme.fonts.body,
    paddingHorizontal: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: theme.colors.secondary,
    borderRadius: 4,
  },
  nextButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  welcomeIcon: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeHighlight: {
    color: theme.colors.secondary,
    fontFamily: theme.fonts.display,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  formContainer: {
    gap: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: -8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: theme.colors.text,
  },
  primaryButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: theme.colors.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: theme.colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  loginLink: {
    color: theme.colors.secondary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
