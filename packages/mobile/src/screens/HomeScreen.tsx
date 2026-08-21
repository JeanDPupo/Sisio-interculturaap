import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth, useSightings, useBird, type Bird } from '@sisio/shared';
import { GlassCard, BirdCard, StatItem, GradientButton } from '../components';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

const COMMUNITIES = ['Arhuaco', 'Kogui', 'Wiwa', 'Kankuamo'];

const sampleBirds: Bird[] = [
  {
    id: '1',
    nombre_cientifico: 'Aquila chrysaetos',
    nombre_espanol: 'Águila Real',
    nombre_nativo: 'Zhigoneshi',
    ecosistema_riesgo: 'medio',
    es_migratoria: false,
    historias_ancestrales: [],
    refranes: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    nombre_cientifico: 'Amazona amazonica',
    nombre_espanol: 'Loro Verde',
    nombre_nativo: 'Kuibi',
    ecosistema_riesgo: 'bajo',
    es_migratoria: false,
    historias_ancestrales: [],
    refranes: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    nombre_cientifico: 'Ramphastos toco',
    nombre_espanol: 'Tucán Toco',
    nombre_nativo: 'Seynekun',
    ecosistema_riesgo: 'bajo',
    es_migratoria: false,
    historias_ancestrales: [],
    refranes: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    nombre_cientifico: 'Archilochus colubris',
    nombre_espanol: 'Colibrí',
    nombre_nativo: 'Gunkuarua',
    ecosistema_riesgo: 'bajo',
    es_migratoria: true,
    historias_ancestrales: [],
    refranes: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const HomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { sightings, getSightings } = useSightings();
  const { birds, getBirds } = useBird();

  const [stats, setStats] = useState({
    birdsIdentified: 0,
    sightingsWeek: 0,
  });

  const photoScale = useSharedValue(1);
  const audioScale = useSharedValue(1);

  const photoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: photoScale.value }],
  }));

  const audioAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: audioScale.value }],
  }));

  const handlePhotoPressIn = () => {
    photoScale.value = withSpring(0.95);
  };
  const handlePhotoPressOut = () => {
    photoScale.value = withSpring(1);
  };
  const handleAudioPressIn = () => {
    audioScale.value = withSpring(0.95);
  };
  const handleAudioPressOut = () => {
    audioScale.value = withSpring(1);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await getBirds(10, 0);
      } catch {}
      try {
        await getSightings(user?.id, 20, 0);
      } catch {}
    };
    loadData();
  }, []);

  useEffect(() => {
    if (sightings && sightings.length > 0) {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const weekSightings = sightings.filter((s: any) => {
        const date = new Date(s.created_at || s.fecha);
        return date >= weekAgo;
      });
      setStats({
        birdsIdentified: birds?.length || sampleBirds.length,
        sightingsWeek: weekSightings.length,
      });
    } else {
      setStats({
        birdsIdentified: sampleBirds.length,
        sightingsWeek: 0,
      });
    }
  }, [sightings, birds]);

  const displayBirds = birds && birds.length > 0 ? birds : sampleBirds;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(50).springify()}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerLogo}>🦅 Sisio</Text>
              <Text style={[styles.greeting, { color: 'rgba(240, 247, 238, 0.5)' }]}>
                Hola, {user?.name || 'Explorador'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Feather name="settings" size={20} color="#D4A017" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).springify()}>
          <LinearGradient
            colors={['rgba(45, 80, 22, 0.3)', 'rgba(74, 124, 47, 0.1)', 'rgba(212, 160, 23, 0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Identificar Ave</Text>
              <View style={styles.ctaRow}>
                <Animated.View style={photoAnimatedStyle}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('PhotoCapture')}
                    onPressIn={handlePhotoPressIn}
                    onPressOut={handlePhotoPressOut}
                    activeOpacity={0.9}
                  >
                    <GlassCard borderRadius={20} intensity={60}>
                      <LinearGradient
                        colors={['rgba(45, 80, 22, 0.5)', 'rgba(212, 160, 23, 0.3)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.ctaCardGradient}
                      >
                        <View style={styles.ctaIconContainer}>
                          <Feather name="camera" size={32} color="#8BC34A" />
                        </View>
                        <Text style={styles.ctaTitle}>Identificar por Foto</Text>
                        <Text style={styles.ctaDescription}>Toma o sube una foto</Text>
                      </LinearGradient>
                    </GlassCard>
                  </TouchableOpacity>
                </Animated.View>

                <Animated.View style={audioAnimatedStyle}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('AudioCapture')}
                    onPressIn={handleAudioPressIn}
                    onPressOut={handleAudioPressOut}
                    activeOpacity={0.9}
                  >
                    <GlassCard borderRadius={20} intensity={60}>
                      <LinearGradient
                        colors={['rgba(212, 160, 23, 0.5)', 'rgba(255, 143, 0, 0.3)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.ctaCardGradient}
                      >
                        <View style={[styles.ctaIconContainer, { backgroundColor: 'rgba(245, 200, 66, 0.2)' }]}>
                          <Feather name="mic" size={32} color="#F5C842" />
                        </View>
                        <Text style={styles.ctaTitle}>Identificar por Sonido</Text>
                        <Text style={styles.ctaDescription}>Graba el canto del ave</Text>
                      </LinearGradient>
                    </GlassCard>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250).springify()}>
          <GlassCard
            style={styles.statsCard}
            intensity={50}
            gradientColors={['rgba(30, 80, 100, 0.15)', 'rgba(46, 125, 154, 0.05)']}
          >
            <View style={styles.statsContent}>
              <StatItem
                value={stats.birdsIdentified}
                label="Aves identificadas"
                color="#8BC34A"
              />
              <View style={styles.statsDivider} />
              <StatItem
                value={stats.sightingsWeek}
                label="Avistamientos esta semana"
                color="#D4A017"
              />
            </View>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(350).springify()}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Avistamientos recientes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Sightings')}>
              <Text style={styles.seeAllText}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sightingsList}
          >
            {displayBirds.map((bird, index) => (
              <BirdCard
                key={bird.id}
                bird={bird}
                onPress={() => {}}
              />
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(450).springify()}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aves de la Sierra</Text>
          </View>
          <View style={styles.birdsGrid}>
            {displayBirds.map((bird, index) => (
              <BirdCard
                key={`grid-${bird.id}`}
                bird={bird}
                onPress={() => {}}
              />
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(550).springify()}>
          <LinearGradient
            colors={['rgba(26, 58, 74, 0.4)', 'rgba(46, 125, 154, 0.15)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.culturalCard}
          >
            <View style={styles.culturalHeader}>
              <View style={styles.culturalIconContainer}>
                <Feather name="book-open" size={24} color="#2E7D9A" />
              </View>
              <View style={styles.culturalHeaderText}>
                <Text style={styles.culturalTitle}>Conocimiento Ancestral</Text>
                <Text style={styles.culturalDescription}>
                  La sabiduría de los pueblos indígenas sobre las aves de la Sierra Nevada
                </Text>
              </View>
            </View>

            <View style={styles.communityChips}>
              {COMMUNITIES.map((community, index) => (
                <Animated.View
                  key={community}
                  entering={FadeInDown.delay(600 + index * 100).springify()}
                  style={styles.communityChip}
                >
                  <Text style={styles.communityChipText}>{community}</Text>
                </Animated.View>
              ))}
            </View>

            <Text style={styles.culturalFooter}>
              Preservando la memoria viva de la Sierra Nevada de Santa Marta
            </Text>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D1B0F',
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
    flex: 1,
  },
  headerLogo: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F0F7EE',
    marginBottom: 4,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '400',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroGradient: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  heroContent: {
    padding: 20,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F0F7EE',
    marginBottom: 16,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  ctaCardGradient: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 20,
    minWidth: (width - 72) / 2,
  },
  ctaIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(139, 195, 74, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  ctaTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F0F7EE',
    marginBottom: 4,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(240, 247, 238, 0.5)',
    textAlign: 'center',
  },

  statsCard: {
    marginBottom: 24,
    overflow: 'hidden',
    borderRadius: 16,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  statsDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F0F7EE',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D4A017',
  },

  sightingsList: {
    paddingRight: 16,
    marginBottom: 24,
  },

  birdsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },

  culturalCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 154, 0.2)',
    overflow: 'hidden',
    padding: 20,
    marginBottom: 24,
  },
  culturalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 20,
  },
  culturalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(46, 125, 154, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  culturalHeaderText: {
    flex: 1,
  },
  culturalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F0F7EE',
    marginBottom: 4,
  },
  culturalDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(240, 247, 238, 0.5)',
    lineHeight: 18,
  },
  communityChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  communityChip: {
    backgroundColor: 'rgba(212, 160, 23, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 160, 23, 0.25)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  communityChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D4A017',
  },
  culturalFooter: {
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(240, 247, 238, 0.3)',
    fontStyle: 'italic',
    lineHeight: 16,
  },
});
