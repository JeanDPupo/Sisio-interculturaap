import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useAuth, useSightings } from '@sisio/shared';
import { theme } from '../theme';

export const MapScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { getSightingsForMap } = useSightings();
  const [sightings, setSightings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialRegion] = useState({
    latitude: 10.5,
    longitude: -73.5,
    latitudeDelta: 2.5,
    longitudeDelta: 2.5,
  });

  useEffect(() => {
    loadSightings();
  }, [user?.id]);

  const loadSightings = async () => {
    setLoading(true);
    try {
      const data = await getSightingsForMap();
      setSightings(data || []);
    } catch { setSightings([]); }
    finally { setLoading(false); }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.secondary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        customMapStyle={darkMapStyle}
      >
        {sightings.map((sighting) => (
          <Marker
            key={sighting.id}
            coordinate={{
              latitude: sighting.latitude || initialRegion.latitude,
              longitude: sighting.longitude || initialRegion.longitude,
            }}
            title={sighting.bird_name || 'Ave'}
            description={`${Math.round((sighting.confidence || 0) * 100)}% confianza`}
            pinColor={theme.colors.secondary}
            onPress={() => navigation.navigate('BirdDetail', { sightingId: sighting.id })}
          />
        ))}
      </MapView>
      <View style={styles.fab}>
        <TouchableOpacity style={styles.fabButton} onPress={loadSightings}>
          <Text style={styles.fabIcon}>🔄</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.infoText}>
          {sightings.length} avistamiento{sightings.length !== 1 ? 's' : ''}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0D1B0F' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#b0c4a0' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0D1B0F' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#1A3A4A' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a2e1e' }] },
  { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 16,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fabIcon: { fontSize: 24 },
  info: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  infoText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
  },
});
