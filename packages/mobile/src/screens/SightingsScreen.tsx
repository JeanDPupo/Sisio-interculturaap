import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useAuth, useSightings } from '@sisio/shared';
import { theme } from '../theme';

export const SightingsScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { sightings, loading, getSightings } = useSightings();
  const [groupedSightings, setGroupedSightings] = useState<any>({});

  useEffect(() => {
    if (user?.id) getSightings(user.id);
  }, [user?.id]);

  useEffect(() => {
    const grouped: any = {};
    sightings.forEach((sighting: any) => {
      const date = new Date(sighting.created_at).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(sighting);
    });
    setGroupedSightings(grouped);
  }, [sightings]);

  const renderSightingCard = (sighting: any) => (
    <TouchableOpacity
      key={sighting.id}
      style={styles.sightingCard}
      onPress={() => navigation.navigate('BirdDetail', { sightingId: sighting.id })}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardLeft}>
          <View style={styles.cardIcon}>
            <Text style={{ fontSize: 18 }}>🦅</Text>
          </View>
          <View>
            <Text style={styles.birdName}>{sighting.bird_name || 'Ave desconocida'}</Text>
            <Text style={styles.timestamp}>
              {new Date(sighting.created_at).toLocaleTimeString('es-ES', {
                hour: '2-digit', minute: '2-digit',
              })}
            </Text>
          </View>
        </View>
        <View style={styles.confidenceBadge}>
          <Text style={styles.confidenceText}>
            {Math.round((sighting.confidence || 0) * 100)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.secondary} />
        </View>
      </SafeAreaView>
    );
  }

  if (sightings.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🦅</Text>
          <Text style={styles.emptyTitle}>Sin avistamientos aún</Text>
          <Text style={styles.emptyText}>
            Captura fotos o audios de aves para crear tu primer avistamiento
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.primaryButtonText}>Empezar Ahora</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Avistamientos</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{sightings.length}</Text>
        </View>
      </View>
      <FlatList
        data={Object.entries(groupedSightings).sort((a: any, b: any) => {
          return new Date(b[0]).getTime() - new Date(a[0]).getTime();
        })}
        keyExtractor={([date]: any) => date}
        renderItem={({ item: [date, dateSightings] }: any) => (
          <View style={styles.dateGroup}>
            <Text style={styles.dateHeader}>{date}</Text>
            {dateSightings.map((sighting: any) => renderSightingCard(sighting))}
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
    fontFamily: theme.fonts.display,
  },
  countBadge: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sightingCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 160, 23, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  birdName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  confidenceBadge: {
    backgroundColor: 'rgba(212, 160, 23, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
});
