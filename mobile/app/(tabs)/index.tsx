import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAppStore } from '@/store/useAppStore';
import { useBirds } from '@/hooks/useBirds';
import { GlassCard, BirdCard, Button } from '@/components/ui';
import type { Bird } from '@/types';

const { width } = Dimensions.get('window');

// Sample data for demo
const sampleBirds: Bird[] = [
  {
    id: '1',
    nombre_cientifico: 'Aquila chrysaetos',
    nombre_espanol: 'Aguila Real',
    nombre_nativo: 'Zhigoneshi',
    ecosistema_riesgo: 'medio',
    es_migratoria: false,
    conocimiento_ancestral: 'Mensajera entre mundos',
  },
  {
    id: '2',
    nombre_cientifico: 'Amazona amazonica',
    nombre_espanol: 'Loro Verde',
    nombre_nativo: 'Kuibi',
    ecosistema_riesgo: 'bajo',
    es_migratoria: false,
    conocimiento_ancestral: 'Guardian de la selva',
  },
  {
    id: '3',
    nombre_cientifico: 'Ramphastos toco',
    nombre_espanol: 'Tucan Toco',
    nombre_nativo: 'Seynekun',
    ecosistema_riesgo: 'bajo',
    es_migratoria: false,
    conocimiento_ancestral: 'Portador de colores',
  },
  {
    id: '4',
    nombre_cientifico: 'Archilochus colubris',
    nombre_espanol: 'Colibri',
    nombre_nativo: 'Gunkuarua',
    ecosistema_riesgo: 'bajo',
    es_migratoria: true,
    conocimiento_ancestral: 'Espiritu del nectar',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColor();
  const { birds, fetchBirds, isLoading } = useBirds();
  const stats = useAppStore((state) => state.stats);
  
  const [displayBirds, setDisplayBirds] = useState<Bird[]>(sampleBirds);

  useEffect(() => {
    fetchBirds({ limit: 10 }).then((response) => {
      if (response.data && response.data.length > 0) {
        setDisplayBirds(response.data);
      }
    });
  }, []);

  const handleIdentifyPhoto = () => {
    router.push('/identify/photo');
  };

  const handleIdentifyAudio = () => {
    router.push('/identify/audio');
  };

  const handleBirdPress = (bird: Bird) => {
    router.push(`/bird/${bird.id}`);
  };

  const handleViewCatalog = () => {
    router.push('/(tabs)/catalog');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={styles.header}
        >
          <View style={styles.headerLeft}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <View>
              <Text style={[styles.welcomeText, { color: colors.muted }]}>
                Bienvenido a
              </Text>
              <Text style={[styles.appName, { color: colors.foreground }]}>
                Sisio
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/settings')}
            style={[styles.settingsButton, { backgroundColor: colors.card }]}
          >
            <Feather name="settings" size={20} color={colors.foreground} />
          </TouchableOpacity>
        </Animated.View>

        {/* Main CTA Buttons */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={styles.ctaSection}
        >
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Identificar Ave
          </Text>

          <View style={styles.ctaButtons}>
            {/* Photo CTA */}
            <TouchableOpacity
              onPress={handleIdentifyPhoto}
              activeOpacity={0.9}
              style={styles.ctaCard}
            >
              <BlurView
                intensity={isDark ? 40 : 20}
                tint={isDark ? 'dark' : 'light'}
                style={styles.ctaBlur}
              >
                <LinearGradient
                  colors={['rgba(45,80,22,0.4)', 'rgba(74,124,47,0.2)']}
                  style={styles.ctaGradient}
                >
                  <View style={styles.ctaIconContainer}>
                    <Feather name="camera" size={32} color={colors.primaryLight} />
                  </View>
                  <Text style={[styles.ctaTitle, { color: colors.foreground }]}>
                    Por Foto
                  </Text>
                  <Text style={[styles.ctaDescription, { color: colors.muted }]}>
                    Toma o sube una foto
                  </Text>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>

            {/* Audio CTA */}
            <TouchableOpacity
              onPress={handleIdentifyAudio}
              activeOpacity={0.9}
              style={styles.ctaCard}
            >
              <BlurView
                intensity={isDark ? 40 : 20}
                tint={isDark ? 'dark' : 'light'}
                style={styles.ctaBlur}
              >
                <LinearGradient
                  colors={['rgba(212,160,23,0.4)', 'rgba(245,200,66,0.2)']}
                  style={styles.ctaGradient}
                >
                  <View style={styles.ctaIconContainer}>
                    <Feather name="mic" size={32} color={colors.accent} />
                  </View>
                  <Text style={[styles.ctaTitle, { color: colors.foreground }]}>
                    Por Sonido
                  </Text>
                  <Text style={[styles.ctaDescription, { color: colors.muted }]}>
                    Graba el canto del ave
                  </Text>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Stats Counter */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={styles.statsSection}
        >
          <View
            style={[
              styles.statsCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <StatItem
              value={stats.birdsIdentifiedToday}
              label="Aves hoy"
              color={colors.primaryLight}
            />
            <View style={[styles.statsDivider, { backgroundColor: colors.border }]} />
            <StatItem
              value={stats.totalSightingsWeek}
              label="Esta semana"
              color={colors.accent}
            />
            <View style={[styles.statsDivider, { backgroundColor: colors.border }]} />
            <StatItem
              value={displayBirds.length}
              label="Especies"
              color={colors.secondaryLight}
            />
          </View>
        </Animated.View>

        {/* Recent Sightings */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={styles.sightingsSection}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Aves de la Sierra
            </Text>
            <TouchableOpacity onPress={handleViewCatalog}>
              <Text style={[styles.seeAllText, { color: colors.accent }]}>
                Ver todo
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            data={displayBirds}
            renderItem={({ item, index }) => (
              <BirdCard
                bird={item}
                onPress={() => handleBirdPress(item)}
                index={index}
                variant="horizontal"
              />
            )}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.birdsList}
          />
        </Animated.View>

        {/* Cultural Section */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          style={styles.culturalSection}
        >
          <TouchableOpacity activeOpacity={0.9}>
            <LinearGradient
              colors={['rgba(26,58,74,0.8)', 'rgba(46,125,154,0.4)']}
              style={[styles.culturalCard, { borderColor: colors.border }]}
            >
              <View style={styles.culturalContent}>
                <Feather name="book-open" size={24} color={colors.secondaryLight} />
                <View style={styles.culturalText}>
                  <Text style={[styles.culturalTitle, { color: colors.foreground }]}>
                    Conocimiento Ancestral
                  </Text>
                  <Text style={[styles.culturalDescription, { color: colors.muted }]}>
                    Descubre la cosmovision de los pueblos Arhuaco, Kogui y Wiwa
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color={colors.muted} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function StatItem({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  const { colors } = useThemeColor();
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(value, { duration: 1000 });
  }, [value]);

  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  ctaCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  ctaBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  ctaGradient: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  ctaIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  ctaDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  statsSection: {
    marginTop: 24,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statsDivider: {
    width: 1,
    height: 40,
  },
  sightingsSection: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  birdsList: {
    paddingRight: 16,
  },
  culturalSection: {
    marginTop: 24,
  },
  culturalCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  culturalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  culturalText: {
    flex: 1,
    marginLeft: 12,
  },
  culturalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  culturalDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});
