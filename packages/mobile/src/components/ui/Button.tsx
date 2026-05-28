import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { useThemeColor } from '../hooks/useThemeColor';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const sizeStyles: Record<ButtonSize, { padding: number; fontSize: number }> = {
  sm: { padding: 8, fontSize: 12 },
  md: { padding: 12, fontSize: 14 },
  lg: { padding: 16, fontSize: 16 },
};

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  icon,
  fullWidth = false,
}) => {
  const { colors, isDark } = useThemeColor();
  const [isPressed, setIsPressed] = useState(false);

  const sizeConfig = sizeStyles[size];

  let gradientColors: string[] = [];
  let textColor = colors.foreground;

  switch (variant) {
    case 'primary':
      gradientColors = isDark
        ? ['rgba(45, 80, 22, 0.6)', 'rgba(74, 124, 47, 0.4)']
        : ['rgba(45, 80, 22, 0.8)', 'rgba(74, 124, 47, 0.6)'];
      textColor = colors.blancoNiebla || '#F0F7EE';
      break;
    case 'secondary':
      gradientColors = isDark
        ? ['rgba(46, 125, 154, 0.4)', 'rgba(30, 80, 100, 0.2)']
        : ['rgba(46, 125, 154, 0.6)', 'rgba(30, 80, 100, 0.4)'];
      textColor = colors.blancoNiebla || '#F0F7EE';
      break;
    case 'danger':
      gradientColors = ['rgba(244, 67, 54, 0.8)', 'rgba(229, 57, 53, 0.6)'];
      textColor = colors.blancoNiebla || '#F0F7EE';
      break;
    case 'outline':
      gradientColors = ['transparent', 'transparent'];
      textColor = colors.foreground;
      break;
  }

  const containerStyle: ViewStyle = {
    borderRadius: 12,
    overflow: 'hidden',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
  };

  const contentStyle: ViewStyle = {
    paddingVertical: sizeConfig.padding,
    paddingHorizontal: sizeConfig.padding * 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  };

  const textStyle: TextStyle = {
    fontSize: sizeConfig.fontSize,
    fontWeight: '600',
    color: textColor,
  };

  const innerContent = (
    <>
      {icon}
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </>
  );

  return (
    <Animated.View
      entering={ZoomIn.springify()}
      style={[containerStyle, style]}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
      >
        {variant === 'outline' ? (
          <Animated.View
            style={[
              contentStyle,
              {
                borderWidth: 1.5,
                borderColor: colors.border,
                borderRadius: 12,
              },
            ]}
          >
            {innerContent}
          </Animated.View>
        ) : (
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={contentStyle}
          >
            {innerContent}
          </LinearGradient>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({});
