import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { palette } from '../theme';

interface ScanLineProps {
  active: boolean;
  color?: string;
  style?: ViewStyle;
}

export const ScanLine: React.FC<ScanLineProps> = ({
  active,
  color = palette.verdeHoja,
  style,
}) => {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (active) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withRepeat(
        withTiming(100, {
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        false
      );
    } else {
      cancelAnimation(translateY);
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(-100, { duration: 200 });
    }
  }, [active, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <Animated.View
        style={[
          styles.line,
          { backgroundColor: color },
          animatedStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    shadowColor: palette.verdeHoja,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
});
