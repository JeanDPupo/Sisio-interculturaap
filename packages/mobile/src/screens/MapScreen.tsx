import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useAuth, useSightings } from '@sisio/shared';
import { GlassCard } from '../components';
import { palette } from '../theme';

const riskColorMap: Record<string, string> = {
  bajo: palette.riesgoBajo,
  medio: palette.riesgoMedio,
  alto: palette.riesgoAlto,
};

const filterOptions = ['Todos', 'Especie', 'Riesgo'];

export const MapScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { getSightingsForMap } = useSightings();
  const [sightings, setSightings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Todos');
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

  const getMarkerColor = (sighting: any) => {
    const risk = sighting.ecosistema_riesgo || 'bajo';
    return riskColorMap[risk] || palette.riesgoBajo;
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: palette.negroSelva }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={palette.oroIndigena} />
          <Text style={styles.loadingText}>Cargando mapa...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.negroSelva }]}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        customMapStyle={darkMapStyle}
      >
        {sightings.map((sighting) => {
          const color = getMarkerColor(sighting);
          return (
            <Marker
              key={sighting.id}
              coordinate={{
                latitude: sighting.latitude || initialRegion.latitude,
                longitude: sighting.longitude || initialRegion.longitude,
              }}
              onPress={() => navigation.navigate('BirdDetail', { sightingId: sighting.id })}
            >
              <View style={[styles.markerOuter, { backgroundColor: `${color}30` }]}>
                <View style={[styles.markerInner, { backgroundColor: color }]}>
                  <Feather name="feather" size={14} color="#FFFFFF" />
                </View>
              </View>
              <Callout tooltip>
                <View style={styles.calloutContainer}>
                  <View style={styles.calloutArrow} />
                  <Text style={styles.calloutTitle}>
                    {sighting.bird_name || 'Ave'}
                  </Text>
                  <Text style={styles.calloutSubtitle}>
                    {Math.round((sighting.confidence || 0) * 100)}% confianza
                  </Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.topPanel}>
        <GlassCard borderRadius={18} intensity={70}>
          <View style={styles.topPanelBody}>
            <View>
              <Text style={styles.title}>Mapa Sierra</Text>
              <Text style={styles.subtitle}>
                {sightings.length} avistamientos georreferenciados
              </Text>
            </View>
            <TouchableOpacity
              onPress={loadSightings}
              style={styles.iconButton}
              activeOpacity={0.85}
            >
              <Feather name="refresh-cw" size={19} color={palette.oroIndigena} />
            </TouchableOpacity>
          </View>
        </GlassCard>
      </Animated.View>

      <Animated.View entering={ZoomIn.delay(180).springify()} style={styles.filterRail}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterOptions.map((label) => {
            const selected = activeFilter === label;
            return (
              <TouchableOpacity
                key={label}
                onPress={() => setActiveFilter(label)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: selected ? `${palette.oroIndigena}20` : 'rgba(255,255,255,0.06)',
                    borderColor: selected ? palette.oroIndigena : 'rgba(255,255,255,0.1)',
                  },
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: selected ? palette.oroIndigena : '#8B9D8B' },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: palette.riesgoBajo }]} />
          <Text style={styles.legendText}>Bajo</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: palette.riesgoMedio }]} />
          <Text style={styles.legendText}>Medio</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: palette.riesgoAlto }]} />
          <Text style={styles.legendText}>Alto</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(250).springify()} style={styles.bottomPanel}>
        <GlassCard borderRadius={20} intensity={78}>
          <View style={styles.bottomPanelBody}>
            <View style={styles.countCircle}>
              <Text style={styles.countValue}>{sightings.length}</Text>
            </View>
            <View style={styles.bottomText}>
              <Text style={styles.infoTitle}>Avistamientos registrados</Text>
              <Text style={styles.infoText}>Sierra Nevada de Santa Marta</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Sightings')}
              style={styles.iconButton}
              activeOpacity={0.85}
            >
              <Feather name="list" size={19} color={palette.azulCielo} />
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
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#0f1f12' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#2D5016' }] },
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
    color: '#8B9D8B',
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
    fontFamily: 'PlayfairDisplay_700Bold',
    fontWeight: '900',
    color: '#F0F7EE',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: '600',
    color: '#8B9D8B',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  filterRail: {
    position: 'absolute',
    top: 100,
    left: 16,
    right: 16,
  },
  filterScroll: {
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
  legendRow: {
    position: 'absolute',
    top: 144,
    left: 16,
    flexDirection: 'row',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F0F7EE',
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
    backgroundColor: `${palette.verdeHoja}18`,
  },
  countValue: {
    fontSize: 20,
    fontWeight: '900',
    color: palette.verdeHoja,
  },
  bottomText: {
    flex: 1,
    minWidth: 0,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F0F7EE',
  },
  infoText: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: '600',
    color: '#8B9D8B',
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
  calloutContainer: {
    backgroundColor: '#1a2e1e',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  calloutArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1a2e1e',
    position: 'absolute',
    bottom: -8,
  },
  calloutTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F0F7EE',
    textAlign: 'center',
  },
  calloutSubtitle: {
    fontSize: 11,
    color: palette.oroIndigena,
    fontWeight: '600',
    marginTop: 2,
  },
});
