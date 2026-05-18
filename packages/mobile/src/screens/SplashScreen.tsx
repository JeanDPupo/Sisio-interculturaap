import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@sisio/shared';

export const SplashScreen = ({ navigation }: any) => {
  React.useEffect(() => {
    const initializeApp = async () => {
      // Simular carga de app
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
      <Text style={styles.logo}>🦅 SISIO</Text>
      <Text style={styles.subtitle}>Conocimiento Ancestral</Text>
      <ActivityIndicator size="large" color="#2196F3" style={styles.spinner} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  spinner: {
    marginTop: 20,
  },
});
