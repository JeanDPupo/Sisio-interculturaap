import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { palette, gradients } from '../../theme';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'gold';
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  borderRadius?: number;
  colors?: string[];
  gradientColors?: string[];
  textColor?: string;
  textStyle?: ViewStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  loading = false,
  style,
  fullWidth = false,
  size = 'lg',
  borderRadius = 12,
  colors: customColors,
  gradientColors,
  textColor: customTextColor,
  textStyle,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const getGradientColors = (): string[] => {
    if (gradientColors) return gradientColors;
    if (customColors) return customColors;
    switch (variant) {
      case 'primary':
        return [...gradients.forestGradient];
      case 'secondary':
        return [...gradients.oceanGradient];
      case 'danger':
        return [palette.riesgoAlto, palette.riesgoAlto];
      case 'gold':
        return [palette.oroIndigena, palette.ambarSolar, palette.oroIndigena];
      case 'outline':
        return ['transparent', 'transparent'];
      default:
        return [...gradients.forestGradient];
    }
  };

  const isOutline = variant === 'outline';
  const isGold = variant === 'gold';
  const resolvedColors = getGradientColors();

  const sizeConfig = {
    sm: { padding: 8, fontSize: 12 },
    md: { padding: 12, fontSize: 14 },
    lg: { padding: 16, fontSize: 16 },
  };

  const config = sizeConfig[size];

  const textColor = customTextColor
    ? customTextColor
    : isGold
    ? palette.negroSelva
    : isOutline
    ? palette.blancoNiebla
    : palette.blancoNiebla;

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        animatedStyle,
        { borderRadius, overflow: 'hidden', opacity: disabled ? 0.5 : 1 },
        fullWidth && { width: '100%' },
        style,
      ]}
    >
      <LinearGradient
        colors={resolvedColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.container,
          { paddingVertical: config.padding, borderRadius },
          isOutline && {
            borderWidth: 1.5,
            borderColor: palette.verdeSelva,
            backgroundColor: 'transparent',
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={textColor} size="small" />
        ) : (
          <>
            {icon}
            <Text
              style={[
                styles.text,
                { fontSize: config.fontSize, color: textColor },
                isOutline && { color: palette.blancoNiebla },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </LinearGradient>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    minHeight: 48,
    gap: 8,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
