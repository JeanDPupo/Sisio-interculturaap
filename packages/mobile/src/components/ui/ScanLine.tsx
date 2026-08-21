import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface ScanLineProps {
  width?: number;
  height?: number;
  color?: string;
  style?: ViewStyle;
  duration?: number;
}

export const ScanLine: React.FC<ScanLineProps> = ({
  width = 280,
  height = 220,
  color = '#8BC34A',
  style,
  duration = 2000,
}) => {
  const translateY = useSharedValue(-height / 2);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(height / 2, {
        duration,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [translateY, height, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { width, height },
        style,
        animatedStyle,
      ]}
      pointerEvents="none"
    >
      <LinearGradient
        colors={[`${color}00`, `${color}88`, `${color}CC`, `${color}88`, `${color}00`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      />
      <LinearGradient
        colors={[`${color}00`, `${color}44`, `${color}66`, `${color}44`, `${color}00`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.glow}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  gradient: {
    width: '100%',
    height: 3,
    borderRadius: 1.5,
  },
  glow: {
    width: '100%',
    height: 24,
    position: 'absolute',
    borderRadius: 12,
  },
});
