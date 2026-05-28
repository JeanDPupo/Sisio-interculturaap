import { useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { theme, lightTheme, darkTheme } from '../theme';

export const useThemeColor = () => {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';

  const colors = isDark ? darkTheme.colors : lightTheme.colors;

  const getColor = useCallback(
    (colorKey: keyof typeof colors) => colors[colorKey],
    [isDark]
  );

  return {
    colors,
    isDark,
    getColor,
    theme,
  };
};

export type ThemeColors = typeof darkTheme.colors;
