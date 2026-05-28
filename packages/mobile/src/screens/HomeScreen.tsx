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
import { theme } from '../theme';

export const HomeScreen = ({ navigation }: any) => {
  const { user, isGuest } = useAuthStore();
  const { isOnline, queue } = useOfflineStore();
  const queueStats = useOfflineStore((state) => state.getQueueStats());

  return (
    <SafeAreaView style={styles.container}>
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>
            Sin conexión ({queueStats.total} elementos en cola)
          </Text>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <Text style={styles.greeting}>
            Hola{'\n'}
            <Text style={styles.greetingName}>{user?.name || 'Visitante'}</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            {isGuest
              ? 'Explora el conocimiento ancestral de la Sierra Nevada'
              : 'Bienvenido a la memoria viva de las aves'}
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionCard, styles.actionPhoto]}
            onPress={() => navigation.navigate('PhotoCapture')}
            activeOpacity={0.8}
          >
            <View style={styles.actionGradient}>
              <Text style={styles.actionIcon}>📷</Text>
              <Text style={styles.actionTitle}>Identificar por Foto</Text>
              <Text style={styles.actionDesc}>
                Captura una foto del ave y descubre su identidad
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, styles.actionAudio]}
            onPress={() => navigation.navigate('AudioCapture')}
            activeOpacity={0.8}
          >
            <View style={styles.actionGradient}>
              <Text style={styles.actionIcon}>🎤</Text>
              <Text style={styles.actionTitle}>Identificar por Sonido</Text>
              <Text style={styles.actionDesc}>
                Graba el canto del ave para reconocerla
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Acceso Rápido</Text>
        <View style={styles.quickLinks}>
          <TouchableOpacity
            style={styles.linkCard}
            onPress={() => navigation.navigate('Sightings')}
            activeOpacity={0.7}
          >
            <Text style={styles.linkIcon}>📝</Text>
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Avistamientos</Text>
              <Text style={styles.linkDesc}>Tus observaciones guardadas</Text>
            </View>
            <Text style={styles.linkArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkCard}
            onPress={() => navigation.navigate('Map')}
            activeOpacity={0.7}
          >
            <Text style={styles.linkIcon}>🗺️</Text>
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Mapa</Text>
              <Text style={styles.linkDesc}>Avistamientos cercanos</Text>
            </View>
            <Text style={styles.linkArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Conocimiento Ancestral</Text>
        <View style={styles.ancestralCard}>
          <Text style={styles.ancestralTitle}>📖 Sabiduría Arhuaco</Text>
          <Text style={styles.ancestralText}>
            Cada ave en la Sierra Nevada tiene un propósito en el tejido de la
            vida. Las comunidades indígenas han preservado este conocimiento por
            generaciones.
          </Text>
          <View style={styles.communitiesRow}>
            {['Arhuaco', 'Kogui', 'Wiwa', 'Kankuamo'].map((com) => (
              <View key={com} style={styles.communityChip}>
                <Text style={styles.communityChipText}>{com}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  offlineBanner: {
    backgroundColor: theme.colors.error,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  offlineText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  heroSection: {
    marginBottom: 28,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '300',
    color: theme.colors.text,
    lineHeight: 38,
  },
  greetingName: {
    fontWeight: '700',
    color: theme.colors.secondary,
    fontFamily: theme.fonts.display,
    fontSize: 36,
  },
  heroSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 28,
  },
  actionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionPhoto: {
    backgroundColor: 'rgba(45, 80, 22, 0.3)',
  },
  actionAudio: {
    backgroundColor: 'rgba(212, 160, 23, 0.15)',
  },
  actionGradient: {
    padding: 20,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  quickLinks: {
    gap: 8,
    marginBottom: 28,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  linkIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  linkDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  linkArrow: {
    fontSize: 22,
    color: theme.colors.textSecondary,
  },
  ancestralCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 20,
  },
  ancestralTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginBottom: 8,
  },
  ancestralText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  communitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  communityChip: {
    backgroundColor: 'rgba(212, 160, 23, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 160, 23, 0.3)',
  },
  communityChipText: {
    fontSize: 12,
    color: theme.colors.secondary,
    fontWeight: '500',
  },
});
