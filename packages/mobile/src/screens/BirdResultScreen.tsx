import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import {
  useBirdStore,
  useAuthStore,
  useSightings,
} from '@sisio/shared';
import {
  GlassCard,
  Button,
} from '../components';
import { useThemeColor } from '../hooks';

const { width, height } = Dimensions.get('window');

export const BirdResultScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColor();
  const { identificationResult } = useBirdStore();
  const { user } = useAuthStore();
  const { createSighting } = useSightings();
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const scaleValue = useSharedValue(0.3);
  const opacityValue = useSharedValue(0);
  const imageBloomValue = useSharedValue(0);

  useEffect(() => {
    scaleValue.value = withSpring(1, { damping: 12 });
    opacityValue.value = withTiming(1, { duration: 600 });
    imageBloomValue.value = withTiming(1, { duration: 1000 });
  }, []);

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
    opacity: opacityValue.value,
  }));

  const bloomStyle = useAnimatedStyle(() => ({
    opacity: imageBloomValue.value,
  }));

  if (!identificationResult?.bird) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.errorContainer}>
          <Animated.View entering={FadeIn.springify()}>
            <Feather
              name="alert-circle"
              size={64}
              color={colors.danger}
            />
            <Text
              style={[
                styles.errorText,
                { color: colors.muted },
              ]}
            >
              No hay resultado de identificación
            </Text>
            <Button
              title="Volver"
              onPress={() => navigation.goBack()}
              style={{ marginTop: 24 }}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  const bird = identificationResult.bird;
  const confidence = (identificationResult.confidence || 0) * 100;
  const riskColor = {
    bajo: colors.success,
    medio: colors.warning,
    alto: colors.danger,
  }[bird.ecosistema_riesgo || 'bajo'];

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

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Header */}
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
          {
            paddingBottom: insets.bottom + 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Reveal Animation Container */}
        <View style={styles.revealContainer}>
          {/* Bloom Effect Background */}
          <Animated.View
            style={[
              styles.bloomEffect,
              { backgroundColor: `${riskColor}20` },
              bloomStyle,
            ]}
          />

          {/* Main Reveal Card */}
          <Animated.View
            entering={ZoomIn.delay(200).springify()}
            style={[styles.revealCard]}
          >
            <GlassCard
              intensity={60}
              borderRadius={24}
              gradientColors={isDark
                ? [
                  'rgba(45, 80, 22, 0.2)',
                  'rgba(46, 125, 154, 0.1)',
                ]
                : [
                  'rgba(255, 255, 255, 0.4)',
                  'rgba(255, 255, 255, 0.1)',
                ]}
            >
              <View style={styles.revealContent}>
                {/* Bird Image */}
                <Animated.View
                  style={[styles.imageWrapper, imageAnimatedStyle]}
                >
                  {bird.imagen_url ? (
                    <Image
                      source={{ uri: bird.imagen_url }}
                      style={styles.birdImage}
                    />
                  ) : (
                    <View
                      style={[
                        styles.birdImagePlaceholder,
                        {
                          backgroundColor: 'rgba(139, 195, 74, 0.1)',
                        },
                      ]}
                    >
                      <Feather
                        name="feather"
                        size={64}
                        color={colors.primaryLight}
                      />
                    </View>
                  )}
                </Animated.View>

                {/* Names Section */}
                <Animated.View
                  entering={FadeInUp.delay(400).springify()}
                  style={styles.namesSection}
                >
                  <Text
                    style={[
                      styles.spanishName,
                      { color: colors.foreground },
                    ]}
                  >
                    {bird.nombre_espanol || bird.nombre_cientifico}
                  </Text>

                  <Text
                    style={[
                      styles.scientificName,
                      { color: colors.muted },
                    ]}
                  >
                    <Text style={styles.scientificPrefix}>
                      {bird.nombre_cientifico}
                    </Text>
                  </Text>

                  {bird.nombre_nativo && (
                    <Text
                      style={[
                        styles.nativeName,
                        { color: colors.accent },
                      ]}
                    >
                      {bird.nombre_nativo}
                      {bird.lengua && ` · ${bird.lengua}`}
                    </Text>
                  )}
                </Animated.View>

                {/* Confidence Score (Organic Visual) */}
                <Animated.View
                  entering={FadeInUp.delay(500).springify()}
                  style={styles.confidenceContainer}
                >
                  <Text
                    style={[
                      styles.confidenceLabel,
                      { color: colors.muted },
                    ]}
                  >
                    CONFIANZA DE IDENTIFICACIÓN
                  </Text>

                  <View style={styles.confidenceBarContainer}>
                    <LinearGradient
                      colors={[riskColor, riskColor + 'CC']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[
                        styles.confidenceBar,
                        { width: `${confidence}%` },
                      ]}
                    />
                    <View
                      style={[
                        styles.confidenceBarBg,
                        { backgroundColor: colors.border },
                        StyleSheet.absoluteFillObject,
                      ]}
                    />
                  </View>

                  <Text
                    style={[
                      styles.confidenceValue,
                      { color: riskColor },
                    ]}
                  >
                    {Math.round(confidence)}%
                  </Text>
                </Animated.View>
              </View>
            </GlassCard>
          </Animated.View>
        </View>

        {/* Ancestral Knowledge Sections */}
        {bird.significado_ancestral && (
          <Animated.View entering={FadeInUp.delay(600).springify()}>
            <ExpandableSection
              icon="book"
              title="Significado Ancestral"
              content={bird.significado_ancestral}
              sectionId="significado"
              expanded={expanded}
              onToggle={toggleSection}
              colors={colors}
              accentColor={colors.accent}
            />
          </Animated.View>
        )}

        {bird.rol_cosmovision && (
          <Animated.View entering={FadeInUp.delay(650).springify()}>
            <ExpandableSection
              icon="sun"
              title="Rol en la Cosmovisión"
              content={bird.rol_cosmovision}
              sectionId="cosmovision"
              expanded={expanded}
              onToggle={toggleSection}
              colors={colors}
              accentColor={colors.secondaryLight}
            />
          </Animated.View>
        )}

        {bird.habitat && (
          <Animated.View entering={FadeInUp.delay(700).springify()}>
            <ExpandableSection
              icon="map-pin"
              title="Hábitat"
              content={bird.habitat}
              sectionId="habitat"
              expanded={expanded}
              onToggle={toggleSection}
              colors={colors}
              accentColor={colors.primaryLight}
            />
          </Animated.View>
        )}

        {bird.comportamientos && (
          <Animated.View entering={FadeInUp.delay(750).springify()}>
            <ExpandableSection
              icon="activity"
              title="Comportamiento"
              content={bird.comportamientos}
              sectionId="comportamiento"
              expanded={expanded}
              onToggle={toggleSection}
              colors={colors}
              accentColor={colors.primaryLight}
            />
          </Animated.View>
        )}

        {bird.historias_ancestrales && bird.historias_ancestrales.length > 0 && (
          <Animated.View entering={FadeInUp.delay(800).springify()}>
            <ExpandableSection
              icon="book-open"
              title="Historias"
              content={bird.historias_ancestrales.join('\n\n')}
              sectionId="historias"
              expanded={expanded}
              onToggle={toggleSection}
              colors={colors}
              accentColor={colors.accent}
            />
          </Animated.View>
        )}

        {/* Ecosystem Risk Badge */}
        <Animated.View
          entering={FadeInUp.delay(900).springify()}
          style={styles.riskBadgeContainer}
        >
          <LinearGradient
            colors={[`${riskColor}20`, `${riskColor}10`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.riskBadge,
              {
                borderColor: riskColor + '40',
              },
            ]}
          >
            <View
              style={[
                styles.riskDot,
                { backgroundColor: riskColor },
              ]}
            />
            <Text
              style={[
                styles.riskText,
                { color: riskColor },
              ]}
            >
              Riesgo ecológico: {bird.ecosistema_riesgo.toUpperCase()}
            </Text>
            {bird.es_migratoria && (
              <Text
                style={[
                  styles.migrationFlag,
                  { color: colors.muted },
                ]}
              >
                Migratoria
              </Text>
            )}
          </LinearGradient>
        </Animated.View>
      </ScrollView>

      {/* Action Buttons */}
      <View
        style={[
          styles.actionBar,
          {
            paddingBottom: insets.bottom + 8,
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        <Button
          title="Descartar"
          variant="outline"
          onPress={() => navigation.goBack()}
          fullWidth
        />
        <Button
          title={saving ? 'Guardando...' : 'Guardar Avistamiento'}
          loading={saving}
          onPress={handleSaveSighting}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

// Expandable Section Component
interface ExpandableSectionProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  content: string;
  sectionId: string;
  expanded: string | null;
  onToggle: (id: string) => void;
  colors: any;
  accentColor: string;
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
}) => {
  const isExpanded = expanded === sectionId;

  return (
    <TouchableOpacity
      onPress={() => onToggle(sectionId)}
      activeOpacity={0.7}
    >
      <GlassCard
        intensity={50}
        style={styles.sectionCard}
        gradientColors={[
          `${accentColor}15`,
          `${accentColor}08`,
        ]}
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
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.foreground },
              ]}
            >
              {title}
            </Text>
          </View>
          <Animated.View
            style={{
              transform: [
                { rotate: isExpanded ? '180deg' : '0deg' },
              ],
            }}
          >
            <Feather
              name="chevron-down"
              size={20}
              color={accentColor}
            />
          </Animated.View>
        </View>

        {isExpanded && (
          <Animated.View
            entering={FadeInUp.springify()}
            style={styles.sectionContentContainer}
          >
            <Text
              style={[
                styles.sectionContent,
                { color: colors.muted },
              ]}
            >
              {content}
            </Text>
          </Animated.View>
        )}
      </GlassCard>
    </TouchableOpacity>
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
  },
  scientificPrefix: {
    fontWeight: '500',
  },
  nativeName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
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
  sectionCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
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
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  sectionContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
  },
  riskBadgeContainer: {
    marginBottom: 24,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  riskDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
  actionBar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
});
