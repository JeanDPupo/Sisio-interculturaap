import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColor } from '../../hooks/useThemeColor';

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
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frame: ReturnType<typeof setTimeout>;
    const steps = 24;
    let currentStep = 0;

    const tick = () => {
      currentStep += 1;
      setDisplayValue(Math.round((value * currentStep) / steps));
      if (currentStep < steps) {
        frame = setTimeout(tick, 40);
      }
    };

    tick();
    return () => clearTimeout(frame);
  }, [value]);

  return (
    <Animated.View entering={FadeInUp.springify()} style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        style={[
          styles.value,
          {
            color: color || colors.primaryLight,
          },
        ]}
      >
        {displayValue}{unit}
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
