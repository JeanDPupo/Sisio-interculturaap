import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useAuthStore, useOfflineStore } from '@sisio/shared';

export const HomeScreen = ({ navigation }: any) => {
  const { user, isGuest } = useAuthStore();
  const { isOnline, queue } = useOfflineStore();
  const queueStats = useOfflineStore((state) => state.getQueueStats());

  return (
    <SafeAreaView style={styles.container}>
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>
            📴 Sin conexión ({queueStats.total} elementos en cola)
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hola {user?.name || 'Visitante'}! 👋
          </Text>
          <Text style={styles.subtitle}>
            {isGuest
              ? 'Inicia sesión para guardar tus avistamientos'
              : 'Bienvenido de vuelta'}
          </Text>
        </View>

        <View style={styles.mainActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('PhotoCapture')}
          >
            <Text style={styles.actionIcon}>📸</Text>
            <Text style={styles.actionTitle}>Fotografía</Text>
            <Text style={styles.actionDesc}>Identifica un ave con una foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('AudioCapture')}
          >
            <Text style={styles.actionIcon}>🎵</Text>
            <Text style={styles.actionTitle}>Sonido</Text>
            <Text style={styles.actionDesc}>Identifica por el canto del ave</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickLinks}>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Sightings')}
          >
            <Text style={styles.linkIcon}>📝</Text>
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Mis Avistamientos</Text>
              <Text style={styles.linkDesc}>Ver tus observaciones</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Map')}
          >
            <Text style={styles.linkIcon}>🗺️</Text>
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Mapa</Text>
              <Text style={styles.linkDesc}>Ubicación de avistamientos</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Consejo</Text>
          <Text style={styles.infoText}>
            El conocimiento ancestral de las comunidades indígenas es prioritario. Aprende
            las historias y significados de cada ave en tu territorio.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  offlineBanner: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  offlineText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 28,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  mainActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  actionIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  quickLinks: {
    gap: 8,
    marginBottom: 24,
  },
  linkButton: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  linkIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  linkDesc: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#1565c0',
    lineHeight: 18,
  },
});
