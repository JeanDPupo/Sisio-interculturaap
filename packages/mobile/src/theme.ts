import { colors as sharedColors } from '@sisio/shared';

const lightTheme = {
  colors: {
    foreground: sharedColors.negroSelva,
    text: sharedColors.negroSelva,
    background: sharedColors.blancoNiebla,
    surface: 'rgba(255, 255, 255, 0.72)',
    muted: '#7A8C7A',
    textSecondary: '#7A8C7A',
    card: 'rgba(45, 80, 22, 0.05)',
    cardBorder: 'rgba(45, 80, 22, 0.1)',
    border: 'rgba(45, 80, 22, 0.15)',

    // Primary (Verde Selva)
    primary: sharedColors.verdeSelva,
    primaryLight: sharedColors.verdeHoja,
    primaryDark: '#1a3a0f',

    // Secondary (Azul)
    secondary: sharedColors.azulCielo,
    secondaryLight: sharedColors.azulClaro,
    secondaryDark: sharedColors.azulNoche,

    // Accent (Oro)
    accent: sharedColors.oroIndigena,
    accentLight: sharedColors.ambarSolar,
    accentDark: '#B8860B',

    // Risk colors
    success: sharedColors.riesgoBajo,
    warning: sharedColors.riesgoMedio,
    danger: sharedColors.riesgoAlto,
    error: sharedColors.riesgoAlto,
    blancoNiebla: sharedColors.blancoNiebla,

    // Backdrop
    backdrop: 'rgba(13, 27, 15, 0.4)',
  },
};

const darkTheme = {
  colors: {
    foreground: sharedColors.blancoNiebla,
    text: sharedColors.blancoNiebla,
    background: sharedColors.negroSelva,
    surface: 'rgba(255, 255, 255, 0.06)',
    muted: '#8B9D8B',
    textSecondary: '#8B9D8B',
    card: 'rgba(255, 255, 255, 0.05)',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.1)',

    // Primary (Verde Selva)
    primary: sharedColors.verdeSelva,
    primaryLight: sharedColors.verdeHoja,
    primaryDark: '#1a3a0f',

    // Secondary (Azul)
    secondary: sharedColors.azulCielo,
    secondaryLight: '#64B5F6',
    secondaryDark: sharedColors.azulNoche,

    // Accent (Oro)
    accent: sharedColors.oroIndigena,
    accentLight: sharedColors.ambarSolar,
    accentDark: '#B8860B',

    // Risk colors
    success: sharedColors.riesgoBajo,
    warning: sharedColors.riesgoMedio,
    danger: sharedColors.riesgoAlto,
    error: sharedColors.riesgoAlto,
    blancoNiebla: sharedColors.blancoNiebla,

    // Backdrop
    backdrop: 'rgba(255, 255, 255, 0.1)',
  },
};

export { lightTheme, darkTheme };

export const theme = {
  dark: true,
  colors: darkTheme.colors,
  fonts: {
    display: 'PlayfairDisplay_700Bold',
    native: 'Lora_400Regular',
    body: 'Inter_400Regular',
    bodySemiBold: 'Inter_600SemiBold',
    bodyBold: 'Inter_700Bold',
    mono: 'JetBrainsMono_400Regular',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
};

export const tabBarStyle = {
  backgroundColor: theme.colors.card,
  borderTopColor: theme.colors.border,
  borderTopWidth: 1,
  height: 60,
  paddingBottom: 8,
  paddingTop: 4,
};
