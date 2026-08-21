import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  Layout,
  FadeOut,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBirdStore, useAuthStore, useSightings } from '@sisio/shared';
import { GlassCard, GradientButton } from '../components';
import { useThemeColor } from '../hooks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const COLORS_CONFIG = {
  bajo: '#4CAF50',
  medio: '#FFC107',
  alto: '#F44336',
};

export const BirdResultScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColor();
  const { identificationResult } = useBirdStore();
  const { user } = useAuthStore();
  const { createSighting } = useSightings();
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const scaleValue = useSharedValue(0);
  const opacityValue = useSharedValue(0);

  useEffect(() => {
    scaleValue.value = withSpring(1, { damping: 12, stiffness: 100 });
    opacityValue.value = withTiming(1, { duration: 600 });
  }, [scaleValue, opacityValue]);

  const heroStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
    opacity: opacityValue.value,
  }));

  if (!identificationResult?.bird) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.errorContainer}>
          <Animated.View entering={FadeIn.springify()}>
            <Feather name="alert-circle" size={64} color={colors.danger} />
            <Text style={[styles.errorText, { color: colors.muted }]}>
              No hay resultado de identificación
            </Text>
            <GradientButton
              title="Volver"
              onPress={() => navigation.goBack()}
              icon="arrow-left"
              style={{ marginTop: 24 }}
              borderRadius={16}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  const bird = identificationResult.bird;
  const confidence = Math.round((identificationResult.confidence || 0) * 100);
  const riskColor = COLORS_CONFIG[bird.ecosistema_riesgo || 'bajo'];

  const handleSaveSighting = async () => {
    setSaving(true);
    try {
      await createSighting({
        bird_id: bird.id,
        user_id: user?.id,
        confidence: confidence / 100,
        ecosystem_risk: bird.ecosistema_riesgo,
      } as any);
      navigation.replace('HomeScreen', { savedSuccess: true });
    } catch (err) {
      console.error('Error saving sighting:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpanded(expanded === sectionId ? null : sectionId);
  };

  const sections = [
    {
      id: 'significado',
      icon: 'feather' as const,
      title: 'Significado Ancestral',
      content: bird.significado_ancestral,
      borderColor: '#F5C842',
      accentColor: colors.accent,
    },
    {
      id: 'cosmovision',
      icon: 'sun' as const,
      title: 'Rol en la Cosmovisión',
      content: bird.rol_cosmovision,
      borderColor: '#8BC34A',
      accentColor: colors.primaryLight,
    },
    {
      id: 'historias',
      icon: 'book' as const,
      title: 'Historias',
      content: bird.historias_ancestrales?.join('\n\n'),
      borderColor: '#2E7D9A',
      accentColor: colors.secondary,
    },
    {
      id: 'comportamiento',
      icon: 'wind' as const,
      title: 'Comportamiento',
      content: bird.comportamientos,
      borderColor: colors.muted,
      accentColor: colors.muted,
    },
    {
      id: 'habitat',
      icon: 'map' as const,
      title: 'Hábitat',
      content: bird.habitat,
      borderColor: colors.muted,
      accentColor: colors.muted,
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Animated.View
        entering={FadeInUp.delay(0).springify()}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Feather name="chevron-left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Identificación
        </Text>
        <View style={styles.headerButton} />
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.revealContainer}>
          <LinearGradient
            colors={[
              `${riskColor}20`,
              `${riskColor}10`,
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bloomEffect}
          />

          <Animated.View
            entering={ZoomIn.delay(200).springify()}
            style={styles.revealCard}
          >
            <GlassCard
              intensity={60}
              borderRadius={24}
              gradientColors={
                isDark
                  ? ['rgba(45, 80, 22, 0.2)', 'rgba(46, 125, 154, 0.1)']
                  : ['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.1)']
              }
            >
              <View style={styles.revealContent}>
                <Animated.View style={[styles.imageWrapper, heroStyle]}>
                  {bird.imagen_url ? (
                    <Image
                      source={{ uri: bird.imagen_url }}
                      style={styles.birdImage}
                    />
                  ) : (
                    <View
                      style={[
                        styles.birdImagePlaceholder,
                        { backgroundColor: 'rgba(139, 195, 74, 0.1)' },
                      ]}
                    >
                      <Feather name="feather" size={64} color={colors.primaryLight} />
                    </View>
                  )}
                </Animated.View>

                <Animated.View
                  entering={FadeInUp.delay(400).springify()}
                  style={styles.namesSection}
                >
                  <Text style={[styles.spanishName, { color: colors.foreground }]}>
                    {bird.nombre_espanol || bird.nombre_cientifico}
                  </Text>

                  <Text style={[styles.scientificName, { color: colors.muted }]}>
                    {bird.nombre_cientifico}
                  </Text>

                  {bird.nombre_nativo && (
                    <View style={styles.nativeNameRow}>
                      <Text style={[styles.nativeName, { color: colors.accent }]}>
                        {bird.nombre_nativo}
                      </Text>
                      {bird.lengua && (
                        <Text style={[styles.lenguaText, { color: colors.muted }]}>
                          · {bird.lengua}
                        </Text>
                      )}
                    </View>
                  )}
                </Animated.View>

                <Animated.View
                  entering={FadeInUp.delay(500).springify()}
                  style={styles.confidenceContainer}
                >
                  <Text style={[styles.confidenceLabel, { color: colors.muted }]}>
                    CONFIANZA DE IDENTIFICACIÓN
                  </Text>

                  <View style={styles.confidenceBarContainer}>
                    <View
                      style={[
                        styles.confidenceBarBg,
                        { backgroundColor: `${colors.border}` },
                      ]}
                    />
                    <Animated.View
                      entering={FadeInUp.delay(600).springify()}
                    >
                      <LinearGradient
                        colors={[riskColor, '#D4A017', riskColor]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[
                          styles.confidenceBar,
                          { width: `${confidence}%` },
                        ]}
                      />
                    </Animated.View>
                  </View>

                  <Text style={[styles.confidenceValue, { color: riskColor }]}>
                    {confidence}%
                  </Text>
                </Animated.View>

                <Animated.View
                  entering={FadeInUp.delay(700).springify()}
                  style={styles.riskBadgeContainer}
                >
                  <LinearGradient
                    colors={[`${riskColor}20`, `${riskColor}10`]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.riskBadge, { borderColor: `${riskColor}40` }]}
                  >
                    <Feather name="shield" size={16} color={riskColor} />
                    <Text style={[styles.riskText, { color: riskColor }]}>
                      Riesgo ecológico: {bird.ecosistema_riesgo?.toUpperCase()}
                    </Text>
                    {bird.es_migratoria && (
                      <Text style={[styles.migrationFlag, { color: colors.muted }]}>
                        Migratoria
                      </Text>
                    )}
                  </LinearGradient>
                </Animated.View>
              </View>
            </GlassCard>
          </Animated.View>
        </View>

        <View style={styles.sectionsContainer}>
          {sections.map((section, index) => {
            if (!section.content) return null;
            return (
              <Animated.View
                key={section.id}
                entering={FadeInUp.delay(700 + index * 80).springify()}
              >
                <ExpandableSection
                  icon={section.icon}
                  title={section.title}
                  content={section.content}
                  sectionId={section.id}
                  expanded={expanded}
                  onToggle={toggleSection}
                  colors={colors}
                  accentColor={section.accentColor}
                  borderColor={section.borderColor}
                />
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      <View
        style={[
          styles.actionBar,
          {
            paddingBottom: insets.bottom + 12,
            backgroundColor: colors.background,
          },
        ]}
      >
        <GradientButton
          title={saving ? 'Guardando...' : 'Guardar Avistamiento'}
          icon={saving ? undefined : 'check-circle'}
          loading={saving}
          disabled={saving}
          onPress={handleSaveSighting}
          fullWidth
          borderRadius={16}
        />
        <GradientButton
          title="Compartir"
          icon="share-2"
          onPress={() => {}}
          fullWidth
          colors={['transparent', 'transparent']}
          borderRadius={16}
        />
      </View>
    </SafeAreaView>
  );
};

interface ExpandableSectionProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  content: string;
  sectionId: string;
  expanded: string | null;
  onToggle: (id: string) => void;
  colors: any;
  accentColor: string;
  borderColor?: string;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  icon,
  title,
  content,
  sectionId,
  expanded,
  onToggle,
  colors,
  accentColor,
  borderColor,
}) => {
  const isExpanded = expanded === sectionId;

  return (
    <AnimatedTouchable
      onPress={() => onToggle(sectionId)}
      activeOpacity={0.7}
      layout={Layout.springify()}
    >
      <GlassCard
        intensity={50}
        style={StyleSheet.flatten([
          styles.sectionCard,
          borderColor ? { borderLeftWidth: 3, borderLeftColor: borderColor } : {},
        ])}
        gradientColors={[`${accentColor}15`, `${accentColor}08`]}
      >
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <View
              style={[
                styles.sectionIconContainer,
                { backgroundColor: `${accentColor}20` },
              ]}
            >
              <Feather name={icon} size={18} color={accentColor} />
            </View>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              {title}
            </Text>
          </View>
          <Animated.View
            style={{
              transform: [{ rotate: isExpanded ? '180deg' : '0deg' }],
            }}
          >
            <Feather name="chevron-down" size={20} color={accentColor} />
          </Animated.View>
        </View>

        {isExpanded && (
          <Animated.View
            entering={FadeInUp.springify()}
            exiting={FadeOut.duration(200)}
            style={styles.sectionContentContainer}
          >
            <Text style={[styles.sectionContent, { color: colors.muted }]}>
              {content}
            </Text>
          </Animated.View>
        )}
      </GlassCard>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  revealContainer: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  bloomEffect: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -50,
    zIndex: 0,
  },
  revealCard: {
    width: '100%',
    zIndex: 1,
  },
  revealContent: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  imageWrapper: {
    marginBottom: 20,
  },
  birdImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  birdImagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  namesSection: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  spanishName: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  scientificName: {
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  nativeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nativeName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Lora_400Regular',
  },
  lenguaText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  confidenceContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
  },
  confidenceLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    marginBottom: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  confidenceBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  confidenceBarBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  confidenceBar: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceValue: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  riskBadgeContainer: {
    width: '100%',
    marginTop: 16,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  riskText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  migrationFlag: {
    fontSize: 11,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  sectionsContainer: {
    gap: 12,
  },
  sectionCard: {
    marginBottom: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  sectionContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
  },
  actionBar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
