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
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useAuth, useSightings } from '@sisio/shared';
import { GlassCard } from '../components';
import { useThemeColor } from '../hooks';

export const MapScreen = ({ navigation }: any) => {
  const { colors } = useThemeColor();
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
    } catch {
      setSightings([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={[`${colors.secondary}14`, `${colors.primaryLight}08`, 'transparent']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.muted }]}>Cargando mapa...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
            onPress={() => navigation.navigate('BirdDetail', { sightingId: sighting.id })}
          >
            <View style={[styles.markerOuter, { backgroundColor: `${colors.accent}30` }]}>
              <View style={[styles.markerInner, { backgroundColor: colors.accent }]}>
                <Feather name="feather" size={15} color="#FFFFFF" />
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      <Animated.View entering={FadeInDown.delay(120).springify()} style={styles.topPanel}>
        <GlassCard borderRadius={18} intensity={70}>
          <View style={styles.topPanelBody}>
            <View>
              <Text style={[styles.title, { color: colors.foreground }]}>Mapa Sierra</Text>
              <Text style={[styles.subtitle, { color: colors.muted }]}>
                Avistamientos georreferenciados
              </Text>
            </View>
            <TouchableOpacity
              onPress={loadSightings}
              style={[styles.iconButton, { backgroundColor: `${colors.accent}18` }]}
              activeOpacity={0.85}
            >
              <Feather name="refresh-cw" size={19} color={colors.accent} />
            </TouchableOpacity>
          </View>
        </GlassCard>
      </Animated.View>

      <Animated.View entering={ZoomIn.delay(220).springify()} style={styles.filterRail}>
        {['Hoy', 'Riesgo', 'Todos'].map((label, index) => (
          <TouchableOpacity
            key={label}
            style={[
              styles.filterPill,
              {
                backgroundColor: index === 2 ? `${colors.accent}20` : colors.card,
                borderColor: index === 2 ? colors.accent : colors.border,
              },
            ]}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, { color: index === 2 ? colors.accent : colors.muted }]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(280).springify()} style={styles.bottomPanel}>
        <GlassCard borderRadius={20} intensity={78}>
          <View style={styles.bottomPanelBody}>
            <View style={[styles.countCircle, { backgroundColor: `${colors.primaryLight}18` }]}>
              <Text style={[styles.countValue, { color: colors.primaryLight }]}>
                {sightings.length}
              </Text>
            </View>
            <View style={styles.bottomText}>
              <Text style={[styles.infoTitle, { color: colors.foreground }]}>
                Avistamientos registrados
              </Text>
              <Text style={[styles.infoText, { color: colors.muted }]}>
                Sierra Nevada de Santa Marta
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Sightings')}
              style={[styles.iconButton, { backgroundColor: `${colors.secondary}18` }]}
              activeOpacity={0.85}
            >
              <Feather name="list" size={19} color={colors.secondary} />
            </TouchableOpacity>
          </View>
        </GlassCard>
      </Animated.View>
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
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  topPanel: {
    position: 'absolute',
    top: 14,
    left: 16,
    right: 16,
  },
  topPanelBody: {
    minHeight: 72,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  title: {
    fontSize: 19,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: '600',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRail: {
    position: 'absolute',
    top: 100,
    left: 16,
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontSize: 11,
    fontWeight: '900',
  },
  bottomPanel: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
  },
  bottomPanelBody: {
    minHeight: 78,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  bottomText: {
    flex: 1,
    minWidth: 0,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  infoText: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: '600',
  },
  markerOuter: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
