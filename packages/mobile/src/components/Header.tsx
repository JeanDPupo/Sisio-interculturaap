import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColor } from '../hooks/useThemeColor';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  style,
}) => {
  const { colors } = useThemeColor();

  return (
    <Animated.View
      entering={FadeInDown.delay(100).springify()}
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {leftIcon ? (
          <TouchableOpacity
            onPress={onLeftPress}
            style={styles.iconButton}
          >
            {leftIcon}
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}

        {(title || subtitle) && (
          <View style={styles.titleContainer}>
            {title && (
              <Text
                style={[
                  styles.title,
                  { color: colors.foreground },
                ]}
              >
                {title}
              </Text>
            )}
            {subtitle && (
              <Text
                style={[
                  styles.subtitle,
                  { color: colors.muted },
                ]}
              >
                {subtitle}
              </Text>
            )}
          </View>
        )}

        {rightIcon ? (
          <TouchableOpacity
            onPress={onRightPress}
            style={styles.iconButton}
          >
            {rightIcon}
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    padding: 8,
    marginHorizontal: -8,
  },
  spacer: {
    width: 44,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});
