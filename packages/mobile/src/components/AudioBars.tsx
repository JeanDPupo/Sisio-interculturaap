import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  interpolate,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { palette } from '../theme';

interface AudioBarsProps {
  isRecording: boolean;
  barCount?: number;
  style?: ViewStyle;
}

const BAR_WIDTH = 3;
const BAR_GAP = 2;
const MAX_HEIGHT = 40;

const Bar: React.FC<{
  index: number;
  total: number;
  isRecording: boolean;
}> = ({ index, total, isRecording }) => {
  const height = useSharedValue(4);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    if (isRecording) {
      const delay = index * 40;
      const duration = 300 + Math.random() * 400;

      height.value = withDelay(
        delay,
        withRepeat(
          withTiming(MAX_HEIGHT * (0.3 + Math.random() * 0.7), {
            duration,
            easing: Easing.inOut(Easing.sin),
          }),
          -1,
          true
        )
      );
      opacity.value = withDelay(
        delay,
        withRepeat(
          withTiming(0.6 + Math.random() * 0.4, {
            duration: duration * 1.2,
            easing: Easing.inOut(Easing.sin),
          }),
          -1,
          true
        )
      );
    } else {
      cancelAnimation(height);
      cancelAnimation(opacity);
      height.value = withTiming(4, { duration: 300 });
      opacity.value = withTiming(0.3, { duration: 300 });
    }
  }, [isRecording, index, height, opacity]);

  const t = index / (total - 1 || 1);
  const r = Math.round(interpolate(t, [0, 1], [139, 212]));
  const g = Math.round(interpolate(t, [0, 1], [195, 160]));
  const b = Math.round(interpolate(t, [0, 1], [74, 23]));

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: opacity.value,
    backgroundColor: `rgb(${r}, ${g}, ${b})`,
  }));

  return <Animated.View style={[styles.bar, animatedStyle]} />;
};

export const AudioBars: React.FC<AudioBarsProps> = ({
  isRecording,
  barCount = 20,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: barCount }).map((_, i) => (
        <Bar key={i} index={i} total={barCount} isRecording={isRecording} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: BAR_GAP,
    height: MAX_HEIGHT + 8,
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: BAR_WIDTH / 2,
    minHeight: 4,
  },
});
