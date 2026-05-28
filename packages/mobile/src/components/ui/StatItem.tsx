import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useThemeColor } from '../hooks/useThemeColor';

interface StatItemProps {
  value: number;
  label: string;
  color?: string;
  unit?: string;
  icon?: React.ReactNode;
}

export const StatItem: React.FC<StatItemProps> = ({
  value,
  label,
  color,
  unit = '',
  icon,
}) => {
  const { colors } = useThemeColor();
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(value, { duration: 1200 });
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => {
    const displayValue = interpolate(
      animatedValue.value,
      [0, value],
      [0, value],
      Extrapolate.CLAMP
    );
    return {
      opacity: withTiming(1, { duration: 300 }),
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        style={[
          styles.value,
          {
            color: color || colors.primaryLight,
          },
        ]}
      >
        {Math.floor(animatedValue.value)}{unit}
      </Text>
      <Text
        style={[
          styles.label,
          {
            color: colors.muted,
          },
        ]}
      >
        {label}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});
