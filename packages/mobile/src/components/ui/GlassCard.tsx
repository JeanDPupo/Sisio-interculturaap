import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from '../hooks/useThemeColor';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  gradientColors?: string[];
  borderRadius?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 80,
  gradientColors,
  borderRadius = 20,
}) => {
  const { colors, isDark } = useThemeColor();

  const defaultGradient = isDark
    ? ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
    : ['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.3)'];

  return (
    <View
      style={[
        styles.container,
        { borderRadius },
        style,
      ]}
    >
      <BlurView intensity={intensity} style={[styles.blur, { borderRadius }]}>
        <LinearGradient
          colors={gradientColors || defaultGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderRadius }]}
        >
          {children}
        </LinearGradient>
      </BlurView>
      <View
        style={[
          styles.border,
          {
            borderColor: colors.cardBorder,
            borderRadius,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  blur: {
    overflow: 'hidden',
  },
  gradient: {
    overflow: 'hidden',
  },
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    pointerEvents: 'none',
  },
});
