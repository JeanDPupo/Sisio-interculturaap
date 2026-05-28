import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useAuthStore,
  useOfflineStore,
  type Bird,
} from '@sisio/shared';
import {
  GlassCard,
  Button,
  BirdCard,
  StatItem,
  Header,
} from '../components';
import { useThemeColor } from '../hooks';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

// Sample birds for demo
const sampleBirds: Bird[] = [
  {
    id: '1',
    nombre_cientifico: 'Aquila chrysaetos',
    nombre_espanol: 'Aguila Real',
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
  const { colors, isDark } = useThemeColor();
  const { user, isGuest } = useAuthStore();
  const { isOnline } = useOfflineStore();
  const queueStats = useOfflineStore((state) => state.getQueueStats());
  const stats = {
    birdsIdentifiedToday: 0,
    totalSightingsWeek: 0
  };

  const [displayBirds, setDisplayBirds] = useState<Bird[]>(sampleBirds);

  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 0.5 + pulse.value * 0.5,
  }));

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {!isOnline && (
        <Animated.View
          entering={FadeInDown}
          style={[
            styles.offlineBanner,
            { backgroundColor: colors.danger },
          ]}
        >
          <Feather name="wifi-off" size={16} color="#FFFFFF" />
          <Text style={styles.offlineText}>
            Sin conexión · {queueStats.total} en cola
          </Text>
        </Animated.View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(50).springify()}>
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.greeting, { color: colors.muted }]}>
                Hola a
              </Text>
              <Text style={[styles.greetingName, { color: colors.foreground }]}>
                {user?.name || 'Sisio'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Settings')}
              style={[
                styles.settingsButton,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
              ]}
            >
              <Feather name="settings" size={20} color={colors.accent} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Main CTA Buttons */}
        <Animated.View entering={FadeInDown.delay(150).springify()}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Identificar Ave
          </Text>

          <View style={styles.ctaButtons}>
            <TouchableOpacity
              onPress={() => navigation.navigate('PhotoCapture')}
              activeOpacity={0.9}
              style={styles.ctaCard}
            >
              <BlurView
                intensity={isDark ? 40 : 20}
                tint={isDark ? 'dark' : 'light'}
                style={styles.ctaBlur}
              >
                <LinearGradient
                  colors={[
                    'rgba(45, 80, 22, 0.4)',
                    'rgba(74, 124, 47, 0.2)',
                  ]}
                  style={styles.ctaGradient}
                >
                  <View
                    style={[
                      styles.ctaIconContainer,
                      { backgroundColor: 'rgba(139, 195, 74, 0.2)' },
                    ]}
                  >
                    <Feather
                      name="camera"
                      size={28}
                      color={colors.primaryLight}
                    />
                  </View>
                  <Text
                    style={[
                      styles.ctaTitle,
                      { color: colors.foreground },
                    ]}
                  >
                    Por Foto
                  </Text>
                  <Text
                    style={[
                      styles.ctaDescription,
                      { color: colors.muted },
                    ]}
                  >
                    Toma o sube una foto
                  </Text>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('AudioCapture')}
              activeOpacity={0.9}
              style={styles.ctaCard}
            >
              <BlurView
                intensity={isDark ? 40 : 20}
                tint={isDark ? 'dark' : 'light'}
                style={styles.ctaBlur}
              >
                <LinearGradient
                  colors={[
                    'rgba(212, 160, 23, 0.4)',
                    'rgba(245, 200, 66, 0.2)',
                  ]}
                  style={styles.ctaGradient}
                >
                  <View
                    style={[
                      styles.ctaIconContainer,
                      { backgroundColor: 'rgba(245, 200, 66, 0.2)' },
                    ]}
                  >
                    <Feather
                      name="mic"
                      size={28}
                      color={colors.accent}
                    />
                  </View>
                  <Text
                    style={[
                      styles.ctaTitle,
                      { color: colors.foreground },
                    ]}
                  >
                    Por Sonido
                  </Text>
                  <Text
                    style={[
                      styles.ctaDescription,
                      { color: colors.muted },
                    ]}
                  >
                    Graba el canto del ave
                  </Text>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(250).springify()}>
          <GlassCard
            style={styles.statsCard}
            intensity={50}
            gradientColors={[
              'rgba(30, 80, 100, 0.2)',
              'rgba(46, 125, 154, 0.1)',
            ]}
          >
            <View style={styles.statsContent}>
              <StatItem
                value={stats.birdsIdentifiedToday || 0}
                label="Hoy"
                color={colors.primaryLight}
              />
              <View
                style={[
                  styles.statsDivider,
                  { backgroundColor: colors.border },
                ]}
              />
              <StatItem
                value={stats.totalSightingsWeek || 0}
                label="Esta semana"
                color={colors.accent}
              />
              <View
                style={[
                  styles.statsDivider,
                  { backgroundColor: colors.border },
                ]}
              />
              <StatItem
                value={displayBirds.length}
                label="Especies"
                color={colors.secondaryLight}
              />
            </View>
          </GlassCard>
        </Animated.View>

        {/* Recent Birds */}
        <Animated.View entering={FadeInDown.delay(350).springify()}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Aves de la Sierra
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Sightings')}
            >
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
                onPress={() => {
                  /* Navigate to bird detail */
                }}
                index={index}
                variant="horizontal"
              />
            )}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.birdsList}
            scrollEnabled
          />
        </Animated.View>

        {/* Quick Links */}
        <Animated.View entering={FadeInDown.delay(450).springify()}>
          <View style={styles.quickLinksContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Map')}
              activeOpacity={0.8}
            >
              <GlassCard
                intensity={60}
                borderRadius={16}
                gradientColors={[
                  'rgba(26, 58, 74, 0.2)',
                  'rgba(46, 125, 154, 0.1)',
                ]}
              >
                <View style={styles.quickLinkContent}>
                  <View
                    style={[
                      styles.quickLinkIcon,
                      { backgroundColor: 'rgba(46, 125, 154, 0.2)' },
                    ]}
                  >
                    <Feather name="map" size={20} color={colors.secondary} />
                  </View>
                  <View style={styles.quickLinkText}>
                    <Text
                      style={[
                        styles.quickLinkTitle,
                        { color: colors.foreground },
                      ]}
                    >
                      Mapa
                    </Text>
                    <Text
                      style={[
                        styles.quickLinkDesc,
                        { color: colors.muted },
                      ]}
                    >
                      Avistamientos cercanos
                    </Text>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={colors.muted}
                  />
                </View>
              </GlassCard>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Sightings')}
              activeOpacity={0.8}
            >
              <GlassCard
                intensity={60}
                borderRadius={16}
                gradientColors={[
                  'rgba(45, 80, 22, 0.2)',
                  'rgba(74, 124, 47, 0.1)',
                ]}
              >
                <View style={styles.quickLinkContent}>
                  <View
                    style={[
                      styles.quickLinkIcon,
                      {
                        backgroundColor: 'rgba(139, 195, 74, 0.2)',
                      },
                    ]}
                  >
                    <Feather
                      name="list"
                      size={20}
                      color={colors.primaryLight}
                    />
                  </View>
                  <View style={styles.quickLinkText}>
                    <Text
                      style={[
                        styles.quickLinkTitle,
                        { color: colors.foreground },
                      ]}
                    >
                      Avistamientos
                    </Text>
                    <Text
                      style={[
                        styles.quickLinkDesc,
                        { color: colors.muted },
                      ]}
                    >
                      Tus observaciones
                    </Text>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={colors.muted}
                  />
                </View>
              </GlassCard>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Cultural Section */}
        <Animated.View entering={FadeInDown.delay(550).springify()}>
          <TouchableOpacity activeOpacity={0.9}>
            <LinearGradient
              colors={[
                'rgba(26, 58, 74, 0.5)',
                'rgba(46, 125, 154, 0.2)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.culturalCard,
                {
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <View style={styles.culturalContent}>
                <View
                  style={[
                    styles.culturalIconContainer,
                    {
                      backgroundColor: 'rgba(46, 125, 154, 0.2)',
                    },
                  ]}
                >
                  <Feather
                    name="book-open"
                    size={24}
                    color={colors.secondary}
                  />
                </View>
                <View style={styles.culturalText}>
                  <Text
                    style={[
                      styles.culturalTitle,
                      { color: colors.foreground },
                    ]}
                  >
                    Conocimiento Ancestral
                  </Text>
                  <Text
                    style={[
                      styles.culturalDescription,
                      { color: colors.muted },
                    ]}
                  >
                    Descubre la cosmovisión de los pueblos Arhuaco, Kogui y Wiwa
                  </Text>
                </View>
                <Feather
                  name="chevron-right"
                  size={20}
                  color={colors.muted}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  offlineText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 12,
    fontWeight: '500',
  },
  greetingName: {
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
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 12,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
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
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  ctaIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  birdsList: {
    paddingRight: 16,
    marginBottom: 24,
  },
  quickLinksContainer: {
    gap: 12,
    marginBottom: 24,
  },
  quickLinkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  quickLinkIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLinkText: {
    flex: 1,
  },
  quickLinkTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  quickLinkDesc: {
    fontSize: 12,
  },
  culturalCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24,
  },
  culturalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  culturalIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  culturalText: {
    flex: 1,
  },
  culturalTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  culturalDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});
