import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Share } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring, withDelay, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeColor } from '@/hooks/useThemeColor';
import { RiskColors } from '@/constants';
import { Button } from '@/components/ui';
import type { IdentificationResult, Bird } from '@/types';

const { width } = Dimensions.get('window');

// Map bird names to local images
const birdImages: Record<string, any> = {
  'aguila': require('@/assets/images/birds/aguila-real.jpg'),
  'loro': require('@/assets/images/birds/loro-verde.jpg'),
  'flamenco': require('@/assets/images/birds/flamenco-andino.jpg'),
  'colibri': require('@/assets/images/birds/colibri-garganta-roja.jpg'),
  'tucan': require('@/assets/images/birds/tucan-toco.jpg'),
};

export default function ResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColor();
  const params = useLocalSearchParams();
  
  const result: IdentificationResult = params.result ? JSON.parse(params.result as string) : {};
  const bird: Bird | undefined = result.ficha_ancestral;
  
  const bloomScale = useSharedValue(0);
  const confidenceWidth = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    bloomScale.value = withSpring(1, { damping: 10 });
    confidenceWidth.value = withDelay(500, withTiming(result.confidence * 100, { duration: 1000 }));
  }, []);

  const bloomStyle = useAnimatedStyle(() => ({ transform: [{ scale: bloomScale.value }], opacity: bloomScale.value }));
  const confidenceStyle = useAnimatedStyle(() => ({ width: `${confidenceWidth.value}%` }));

  const getBirdImage = () => {
    const name = (result.bird_name || '').toLowerCase();
    const key = Object.keys(birdImages).find((k) => name.includes(k));
    return key ? birdImages[key] : birdImages['aguila'];
  };

  const riskColor = RiskColors[(bird?.ecosistema_riesgo as keyof typeof RiskColors) || 'bajo'];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `He identificado un ${result.bird_name} (${result.nombre_cientifico}) con Sisio Interculturaap! ${bird?.conocimiento_ancestral || ''}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveSighting = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Save sighting to API
    router.push('/(tabs)/map');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 100 }} showsVerticalScrollIndicator={false}>
        {/* Hero Image with Bloom Effect */}
        <Animated.View style={[styles.heroContainer, bloomStyle]}>
          <Image source={getBirdImage()} style={styles.heroImage} />
          <LinearGradient colors={['transparent', 'rgba(13,27,15,0.8)', colors.background]} style={styles.heroGradient} />
          <TouchableOpacity onPress={() => router.back()} style={[styles.closeButton, { top: insets.top + 8 }]}>
            <BlurView intensity={40} tint="dark" style={styles.closeButtonBlur}>
              <Feather name="x" size={20} color="#fff" />
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        {/* Bird Info */}
        <View style={styles.content}>
          <Animated.View entering={FadeInUp.delay(300).springify()}>
            <Text style={[styles.birdName, { color: colors.foreground }]}>{result.bird_name || 'Ave Identificada'}</Text>
            <Text style={[styles.scientificName, { color: colors.muted }]}>{result.nombre_cientifico}</Text>
            {bird?.nombre_nativo && (
              <View style={styles.nativeNameContainer}>
                <Text style={[styles.nativeName, { color: colors.accent }]}>{bird.nombre_nativo}</Text>
                {bird.pronunciacion_nativo && <Text style={[styles.pronunciation, { color: colors.muted }]}>/{bird.pronunciacion_nativo}/</Text>}
              </View>
            )}
          </Animated.View>

          {/* Confidence Bar */}
          <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.confidenceSection}>
            <View style={styles.confidenceHeader}>
              <Text style={[styles.sectionLabel, { color: colors.muted }]}>Confianza de identificacion</Text>
              <Text style={[styles.confidencePercent, { color: colors.primaryLight }]}>{Math.round(result.confidence * 100)}%</Text>
            </View>
            <View style={[styles.confidenceBar, { backgroundColor: colors.card }]}>
              <Animated.View style={[styles.confidenceFill, { backgroundColor: colors.primaryLight }, confidenceStyle]} />
            </View>
          </Animated.View>

          {/* Risk Badge */}
          <Animated.View entering={FadeInDown.delay(500).springify()} style={[styles.riskBadge, { backgroundColor: `${riskColor}20`, borderColor: riskColor }]}>
            <View style={[styles.riskDot, { backgroundColor: riskColor }]} />
            <Text style={[styles.riskText, { color: riskColor }]}>Riesgo ecosistemico: {bird?.ecosistema_riesgo || 'bajo'}</Text>
          </Animated.View>

          {/* Ancestral Knowledge Card */}
          {bird?.conocimiento_ancestral && (
            <Animated.View entering={FadeInDown.delay(600).springify()}>
              <LinearGradient colors={['rgba(212,160,23,0.15)', 'rgba(212,160,23,0.05)']} style={styles.ancestralCard}>
                <View style={styles.ancestralHeader}>
                  <Feather name="feather" size={20} color={colors.accent} />
                  <Text style={[styles.ancestralTitle, { color: colors.foreground }]}>Significado Ancestral</Text>
                </View>
                <Text style={[styles.ancestralText, { color: colors.muted }]}>{bird.conocimiento_ancestral}</Text>
              </LinearGradient>
            </Animated.View>
          )}

          {/* Cosmovision Card */}
          {bird?.rol_cosmovision && (
            <Animated.View entering={FadeInDown.delay(700).springify()}>
              <LinearGradient colors={['rgba(46,125,154,0.15)', 'rgba(46,125,154,0.05)']} style={styles.ancestralCard}>
                <View style={styles.ancestralHeader}>
                  <Feather name="sun" size={20} color={colors.secondaryLight} />
                  <Text style={[styles.ancestralTitle, { color: colors.foreground }]}>Rol en la Cosmovision</Text>
                </View>
                <Text style={[styles.ancestralText, { color: colors.muted }]}>{bird.rol_cosmovision}</Text>
              </LinearGradient>
            </Animated.View>
          )}

          {/* Habitat Info */}
          {bird?.habitat && (
            <Animated.View entering={FadeInDown.delay(800).springify()} style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <View style={styles.infoRow}>
                <Feather name="map-pin" size={18} color={colors.primaryLight} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.muted }]}>Habitat</Text>
                  <Text style={[styles.infoValue, { color: colors.foreground }]}>{bird.habitat}</Text>
                </View>
              </View>
              {bird.zona_geografica && (
                <View style={styles.infoRow}>
                  <Feather name="globe" size={18} color={colors.primaryLight} />
                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, { color: colors.muted }]}>Zona geografica</Text>
                    <Text style={[styles.infoValue, { color: colors.foreground }]}>{bird.zona_geografica}</Text>
                  </View>
                </View>
              )}
              {bird.es_migratoria && (
                <View style={styles.infoRow}>
                  <Feather name="navigation" size={18} color={colors.accent} />
                  <Text style={[styles.migratoryBadge, { color: colors.accent }]}>Especie migratoria</Text>
                </View>
              )}
            </Animated.View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <LinearGradient colors={['transparent', colors.background]} style={[styles.bottomActions, { paddingBottom: insets.bottom + 16 }]}>
        <Button title="Guardar avistamiento" onPress={handleSaveSighting} variant="primary" fullWidth icon={<Feather name="map-pin" size={18} color="#F0F7EE" />} />
        <Button title="Compartir" onPress={handleShare} variant="outline" fullWidth icon={<Feather name="share-2" size={18} color={colors.primary} />} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroContainer: { height: width * 0.9, overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroGradient: { ...StyleSheet.absoluteFillObject },
  closeButton: { position: 'absolute', left: 16, zIndex: 10 },
  closeButtonBlur: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  content: { paddingHorizontal: 20, marginTop: -40 },
  birdName: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  scientificName: { fontSize: 16, fontStyle: 'italic', marginTop: 4 },
  nativeNameContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  nativeName: { fontSize: 20, fontWeight: '600' },
  pronunciation: { fontSize: 14 },
  confidenceSection: { marginTop: 24 },
  confidenceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionLabel: { fontSize: 14 },
  confidencePercent: { fontSize: 16, fontWeight: '700' },
  confidenceBar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  confidenceFill: { height: '100%', borderRadius: 4 },
  riskBadge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, marginTop: 16, gap: 8 },
  riskDot: { width: 8, height: 8, borderRadius: 4 },
  riskText: { fontSize: 14, fontWeight: '600', textTransform: 'capitalize' },
  ancestralCard: { marginTop: 20, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  ancestralHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  ancestralTitle: { fontSize: 16, fontWeight: '700' },
  ancestralText: { fontSize: 15, lineHeight: 24 },
  infoCard: { marginTop: 20, padding: 16, borderRadius: 16, borderWidth: 1, gap: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: '500' },
  migratoryBadge: { fontSize: 14, fontWeight: '600' },
  bottomActions: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 24, gap: 12 },
});
