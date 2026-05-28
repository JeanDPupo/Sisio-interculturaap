import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ViewStyle,
} from 'react-native';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useThemeColor } from '../../hooks/useThemeColor';
import { GlassCard } from './GlassCard';
import type { Bird } from '@sisio/shared';

interface BirdCardProps {
  bird: Bird;
  onPress: () => void;
  index?: number;
  variant?: 'vertical' | 'horizontal';
  style?: ViewStyle;
}

export const BirdCard: React.FC<BirdCardProps> = ({
  bird,
  onPress,
  index = 0,
  variant = 'vertical',
  style,
}) => {
  const { colors } = useThemeColor();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.8);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    opacity.value = withSpring(1);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withSpring(0.8);
  };

  const riskColor = {
    bajo: colors.success,
    medio: colors.warning,
    alto: colors.danger,
  }[bird.ecosistema_riesgo || 'bajo'];

  if (variant === 'horizontal') {
    return (
      <Animated.View
        entering={FadeInUp.delay(index * 100).springify()}
        style={[animatedStyle, { marginRight: 12 }, style]}
      >
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
        >
          <GlassCard borderRadius={16} intensity={70}>
            <View style={[styles.horizontalContainer]}>
              {bird.imagen_url && (
                <Image
                  source={{ uri: bird.imagen_url }}
                  style={styles.horizontalImage}
                />
              )}
              <View style={styles.horizontalContent}>
                <Text
                  style={[
                    styles.birdName,
                    { color: colors.foreground },
                  ]}
                  numberOfLines={1}
                >
                  {bird.nombre_espanol}
                </Text>
                <Text
                  style={[
                    styles.birdNative,
                    { color: colors.muted },
                  ]}
                  numberOfLines={1}
                >
                  {bird.nombre_nativo}
                </Text>
                <View style={styles.riskBadge}>
                  <View
                    style={[
                      styles.riskDot,
                      { backgroundColor: riskColor },
                    ]}
                  />
                  <Text style={[styles.riskText, { color: colors.muted }]}>
                    {bird.es_migratoria ? 'Migratoria' : 'Residente'}
                  </Text>
                </View>
              </View>
            </View>
          </GlassCard>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100).springify()}
      style={[animatedStyle, style]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <GlassCard borderRadius={16} intensity={70}>
          <View style={styles.verticalContainer}>
            {bird.imagen_url && (
              <Image
                source={{ uri: bird.imagen_url }}
                style={styles.verticalImage}
              />
            )}
            <View
              style={[
                styles.overlay,
                {
                  backgroundColor: colors.backdrop,
                },
              ]}
            />
            <View style={styles.verticalContent}>
              <Text
                style={[
                  styles.birdName,
                  { color: colors.blancoNiebla || '#F0F7EE' },
                ]}
                numberOfLines={2}
              >
                {bird.nombre_espanol}
              </Text>
              <Text
                style={[
                  styles.birdNative,
                  {
                    color: colors.accentLight || '#F5C842',
                  },
                ]}
                numberOfLines={1}
              >
                {bird.nombre_nativo}
              </Text>
            </View>
            <View
              style={[
                styles.riskBadge,
                {
                  backgroundColor: riskColor,
                },
              ]}
            >
              <Text style={styles.riskBadgeText}>
                {bird.ecosistema_riesgo?.toUpperCase()}
              </Text>
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    gap: 12,
  },
  horizontalImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  horizontalContent: {
    flex: 1,
  },
  verticalContainer: {
    width: 140,
    height: 160,
    position: 'relative',
  },
  verticalImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  verticalContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  birdName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  birdNative: {
    fontSize: 11,
    fontWeight: '500',
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignSelf: 'flex-start',
  },
  riskBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  riskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  riskText: {
    fontSize: 10,
    fontWeight: '500',
  },
});
