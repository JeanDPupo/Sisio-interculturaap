import { colors } from '@sisio/shared';

export const theme = {
  dark: true,
  colors: {
    primary: colors.verdeSelva,
    secondary: colors.oroIndigena,
    background: colors.negroSelva,
    surface: '#1a2e1e',
    surfaceLight: '#243a28',
    text: colors.blancoNiebla,
    textSecondary: '#b0c4a0',
    accent: colors.ambarSolar,
    error: colors.riesgoAlto,
    warning: colors.riesgoMedio,
    success: colors.riesgoBajo,
    border: 'rgba(255,255,255,0.1)',
    card: 'rgba(255,255,255,0.05)',
  },
  fonts: {
    display: 'PlayfairDisplay_700Bold',
    native: 'Lora_400Regular',
    body: 'Inter_400Regular',
    bodySemiBold: 'Inter_600SemiBold',
    mono: 'JetBrainsMono_400Regular',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 24,
  },
};

export const tabBarStyle = {
  backgroundColor: theme.colors.surface,
  borderTopColor: theme.colors.border,
  borderTopWidth: 1,
  height: 60,
  paddingBottom: 8,
  paddingTop: 4,
};

export const glassCard = {
  backgroundColor: theme.colors.card,
  backdropFilter: 'blur(20px)',
  borderWidth: 1,
  borderColor: theme.colors.border,
  borderRadius: theme.borderRadius.lg,
};
