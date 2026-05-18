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

interface SightingItem {
  id: string;
  bird_id: string;
  bird_name: string;
  created_at: string;
  confidence: number;
  location?: string;
}

export const SightingsScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { sightings, loading, getSightings } = useSightings();
  const [groupedSightings, setGroupedSightings] = useState<any>({});

  useEffect(() => {
    if (user?.id) {
      getSightings(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    // Group sightings by date
    const grouped: any = {};
    sightings.forEach((sighting: any) => {
      const date = new Date(sighting.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(sighting);
    });

    setGroupedSightings(grouped);
  }, [sightings]);

  const renderSightingCard = (sighting: any) => (
    <TouchableOpacity
      key={sighting.id}
      style={styles.sightingCard}
      onPress={() => navigation.navigate('BirdDetail', { sightingId: sighting.id })}
    >
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.birdName}>{sighting.bird_name || 'Ave desconocida'}</Text>
          <Text style={styles.timestamp}>
            {new Date(sighting.created_at).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
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
          <ActivityIndicator size="large" color="#2196F3" />
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
            Vuelve a la pantalla de inicio y captura fotos o audios de aves para crear tu primer
            avistamiento
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.buttonText}>Empezar Ahora</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Avistamientos</Text>
        <Text style={styles.count}>{sightings.length}</Text>
      </View>

      <FlatList
        data={Object.entries(groupedSightings).sort((a, b) => {
          const dateA = new Date(a[0]);
          const dateB = new Date(b[0]);
          return dateB.getTime() - dateA.getTime();
        })}
        keyExtractor={([date]) => date}
        renderItem={({ item: [date, dateSightings] }) => (
          <View style={styles.dateGroup}>
            <Text style={styles.dateHeader}>{date}</Text>
            {dateSightings.map((sighting: any) => renderSightingCard(sighting))}
          </View>
        )}
        contentContainerStyle={styles.listContent}
        scrollEnabled
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  count: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sightingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  birdName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  confidenceBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2e7d32',
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
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
