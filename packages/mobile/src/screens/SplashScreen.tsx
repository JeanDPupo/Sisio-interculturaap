import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@sisio/shared';
import { theme } from '../theme';

export const SplashScreen = ({ navigation }: any) => {
  React.useEffect(() => {
    const initializeApp = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const { isGuest, isAuthenticated } = useAuthStore.getState();
      if (isGuest || isAuthenticated) {
        navigation.replace('Main');
      } else {
        navigation.replace('Onboarding');
      }
    };
    initializeApp();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>SISIO</Text>
        <Text style={styles.subtitle}>Conocimiento Ancestral</Text>
        <View style={styles.divider} />
        <Text style={styles.tagline}>
          Preservando la sabiduría de la Sierra Nevada
        </Text>
      </View>
      <ActivityIndicator size="large" color={theme.colors.secondary} style={styles.spinner} />
      <Text style={styles.footer}>Sierra Nevada de Santa Marta</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    color: theme.colors.secondary,
    letterSpacing: 8,
    fontFamily: theme.fonts.display,
    textShadowColor: 'rgba(212, 160, 23, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.text,
    marginTop: 12,
    fontFamily: theme.fonts.body,
    letterSpacing: 2,
    fontWeight: '300',
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: theme.colors.secondary,
    marginVertical: 20,
    opacity: 0.5,
  },
  tagline: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: theme.fonts.native,
    fontStyle: 'italic',
  },
  spinner: {
    marginTop: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    fontSize: 11,
    color: theme.colors.textSecondary,
    opacity: 0.5,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
