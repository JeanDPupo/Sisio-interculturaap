import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { colors as themeColors } from '@sisio/shared';

interface AudioBarsProps {
  barCount?: number;
  isActive?: boolean;
  style?: ViewStyle;
  barColor?: string;
  secondaryColor?: string;
}

const BarComponent: React.FC<{
  index: number;
  total: number;
  isActive: boolean;
  barColor: string;
  secondaryColor: string;
}> = ({ index, total, isActive, barColor, secondaryColor }) => {
  const height = useSharedValue(0.15);

  useEffect(() => {
    if (isActive) {
      const delay = index * 60;
      height.value = withRepeat(
        withTiming(1, {
          duration: 300 + Math.random() * 200,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    } else {
      const baseHeight = 0.15 + (index % 3) * 0.05;
      height.value = withTiming(baseHeight, { duration: 300 });
    }
  }, [isActive, index, height]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: interpolate(height.value, [0, 1], [4, 52]),
    opacity: isActive ? interpolate(height.value, [0, 1], [0.6, 1]) : 0.35,
  }));

  const isFirst = index % 3 === 0;
  const colors = isFirst
    ? [barColor, secondaryColor]
    : [secondaryColor, barColor];

  return (
    <Animated.View style={[styles.bar, animatedStyle]}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.barGradient}
      />
    </Animated.View>
  );
};

export const AudioBars: React.FC<AudioBarsProps> = ({
  barCount = 20,
  isActive = false,
  style,
  barColor = themeColors.verdeHoja,
  secondaryColor = themeColors.azulCielo,
}) => {
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: barCount }).map((_, i) => (
        <BarComponent
          key={i}
          index={i}
          total={barCount}
          isActive={isActive}
          barColor={barColor}
          secondaryColor={secondaryColor}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 4,
  },
  bar: {
    width: 4,
    borderRadius: 2,
    minHeight: 4,
    overflow: 'hidden',
  },
  barGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
});
