import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ViewStyle } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from './GlassCard';
import { palette, glassmorphism } from '../theme';
import type { Bird } from '@sisio/shared';

interface BirdCardProps {
  bird: Bird;
  onPress: () => void;
  style?: ViewStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const riskColorMap: Record<string, string> = {
  bajo: palette.riesgoBajo,
  medio: palette.riesgoMedio,
  alto: palette.riesgoAlto,
};

const BIRD_EMOJI = '\uD83E\uDD86';

export const BirdCard: React.FC<BirdCardProps> = ({ bird, onPress, style }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const riskColor = riskColorMap[bird.ecosistema_riesgo || 'bajo'];
  const riskLabel = bird.ecosistema_riesgo?.toUpperCase() || 'BAJO';

  return (
    <Animated.View entering={FadeInDown.duration(400).springify()} style={animatedStyle}>
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={style}
      >
        <LinearGradient
          colors={[glassmorphism.dark.background, 'rgba(255,255,255,0.02)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >
          {bird.imagen_url ? (
            <Image source={{ uri: bird.imagen_url }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.emojiFallback]}>
              <Text style={styles.emoji}>{BIRD_EMOJI}</Text>
            </View>
          )}

          <View style={styles.content}>
            <Text style={styles.name} numberOfLines={1}>
              {bird.nombre_espanol || 'Desconocido'}
            </Text>
            <Text style={styles.scientific} numberOfLines={1}>
              {bird.nombre_cientifico}
            </Text>
            {bird.nombre_nativo ? (
              <Text style={styles.nativeName} numberOfLines={1}>
                {bird.nombre_nativo}
              </Text>
            ) : null}

            <View style={styles.footer}>
              <View style={[styles.riskBadge, { backgroundColor: riskColor }]}>
                <Text style={styles.riskText}>{riskLabel}</Text>
              </View>
              {bird.es_migratoria && (
                <View style={styles.migratoryBadge}>
                  <Text style={styles.migratoryText}>Migratoria</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.borderOverlay} />
        </LinearGradient>
      </AnimatedTouchable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: glassmorphism.dark.border,
    overflow: 'hidden',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 0,
  },
  emojiFallback: {
    backgroundColor: 'rgba(139, 195, 74, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 40,
  },
  content: {
    flex: 1,
    padding: 12,
    gap: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.blancoNiebla,
    letterSpacing: 0.2,
  },
  scientific: {
    fontSize: 12,
    fontStyle: 'italic',
    color: palette.verdeHoja,
    letterSpacing: 0.1,
  },
  nativeName: {
    fontSize: 13,
    fontFamily: 'Lora_400Regular',
    color: palette.ambarSolar,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  riskText: {
    fontSize: 10,
    fontWeight: '700',
    color: palette.blancoNiebla,
    letterSpacing: 0.8,
  },
  migratoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(212, 160, 23, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(212, 160, 23, 0.4)',
  },
  migratoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: palette.oroIndigena,
  },
  borderOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    pointerEvents: 'none',
  },
});
