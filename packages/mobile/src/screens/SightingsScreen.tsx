import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useAuth, useSightings } from '@sisio/shared';
import { GlassCard } from '../components';
import { useThemeColor } from '../hooks';
import { palette } from '../theme';

const filters = ['Todos', 'Foto', 'Audio'];

const riskColorMap: Record<string, string> = {
  bajo: palette.riesgoBajo,
  medio: palette.riesgoMedio,
  alto: palette.riesgoAlto,
};

export const SightingsScreen = ({ navigation }: any) => {
  const { colors } = useThemeColor();
  const { user } = useAuth();
  const { sightings, loading, getSightings } = useSightings();
  const [groupedSightings, setGroupedSightings] = useState<Record<string, any[]>>({});
  const [activeFilter, setActiveFilter] = useState('Todos');

  useEffect(() => {
    if (user?.id) getSightings(user.id);
  }, [user?.id]);

  useEffect(() => {
    const grouped: Record<string, any[]> = {};
    sightings
      .filter((sighting: any) => {
        if (activeFilter === 'Todos') return true;
        const source = sighting.audio_url || sighting.audio ? 'Audio' : 'Foto';
        return source === activeFilter;
      })
      .forEach((sighting: any) => {
        const date = new Date(sighting.created_at).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(sighting);
      });
    setGroupedSightings(grouped);
  }, [sightings, activeFilter]);

  const renderSightingCard = (sighting: any, index: number) => {
    const confidence = Math.round((sighting.confidence || 0) * 100);
    const source = sighting.audio_url || sighting.audio ? 'Audio' : 'Foto';
    const risk = sighting.ecosistema_riesgo || 'bajo';
    const riskColor = riskColorMap[risk] || palette.riesgoBajo;

    return (
      <Animated.View key={sighting.id} entering={FadeInUp.delay(index * 50).springify()}>
        <TouchableOpacity
          onPress={() => navigation.navigate('BirdDetail', { sightingId: sighting.id })}
          activeOpacity={0.86}
          style={styles.cardTouch}
        >
          <GlassCard borderRadius={16} intensity={55}>
            <View style={styles.sightingCard}>
              <View style={[styles.cardIcon, { backgroundColor: `${colors.accent}18` }]}>
                <Feather
                  name={source === 'Audio' ? 'volume-2' : 'camera'}
                  size={20}
                  color={colors.accent}
                />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.birdName, { color: colors.foreground }]} numberOfLines={1}>
                  {sighting.bird_name || 'Ave desconocida'}
                </Text>
                <View style={styles.metaRow}>
                  <Text style={[styles.timestamp, { color: colors.muted }]}>
                    {new Date(sighting.created_at).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                  <View style={[styles.sourceBadge, { borderColor: colors.border }]}>
                    <Text style={[styles.sourceText, { color: colors.muted }]}>{source}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.chipsColumn}>
                <View style={[styles.confidenceBadge, { backgroundColor: `${colors.primaryLight}18` }]}>
                  <Text style={[styles.confidenceText, { color: colors.primaryLight }]}>
                    {confidence}%
                  </Text>
                </View>
                <View style={[styles.riskBadge, { backgroundColor: `${riskColor}20` }]}>
                  <View style={[styles.riskDot, { backgroundColor: riskColor }]} />
                  <Text style={[styles.riskText, { color: riskColor }]}>
                    {risk.charAt(0).toUpperCase() + risk.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          </GlassCard>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: palette.negroSelva }]}>
        <LinearGradient
          colors={[`${palette.azulCielo}14`, `${palette.verdeHoja}08`, 'transparent']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={palette.oroIndigena} />
          <Text style={styles.loadingText}>Cargando avistamientos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (sightings.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: palette.negroSelva }]}>
        <LinearGradient
          colors={[`${palette.azulCielo}14`, `${palette.verdeHoja}08`, 'transparent']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mis Avistamientos</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Animated.View entering={ZoomIn.delay(80).springify()}>
            <Text style={styles.emptyEmoji}>🦜</Text>
          </Animated.View>
          <Animated.Text
            entering={FadeInDown.delay(160).springify()}
            style={styles.emptyTitle}
          >
            Sin avistamientos aún
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(220).springify()}
            style={styles.emptyText}
          >
            Captura fotos o audios de aves para crear tu primer registro.
          </Animated.Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
      <SafeAreaView style={[styles.container, { backgroundColor: palette.negroSelva }]}>
        <LinearGradient
          colors={[`${palette.azulCielo}12`, `${palette.verdeHoja}08`, 'transparent']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mis Avistamientos</Text>
          <View style={[styles.countBadge, { backgroundColor: palette.oroIndigena }]}>
          <Text style={styles.countText}>{sightings.length}</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {filters.map((filter) => {
          const selected = activeFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterChip,
                {
                  borderColor: selected ? palette.oroIndigena : 'rgba(255,255,255,0.1)',
                  backgroundColor: selected ? `${palette.oroIndigena}20` : 'rgba(255,255,255,0.05)',
                },
              ]}
            >
              <Text                 style={[styles.filterText, { color: selected ? palette.oroIndigena : '#8B9D8B' }]}>
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={Object.entries(groupedSightings).sort((a: any, b: any) => {
          return new Date(b[0]).getTime() - new Date(a[0]).getTime();
        })}
        keyExtractor={([date]: any) => date}
        renderItem={({ item: [date, dateSightings] }: any) => (
          <View style={styles.dateGroup}>
            <Text style={styles.dateHeader}>{date}</Text>
            {dateSightings.map((sighting: any, index: number) => renderSightingCard(sighting, index))}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontWeight: '900',
    color: '#F0F7EE',
  },
  countBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  countText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0D1B0F',
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    gap: 8,
  },
  filterChip: {
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
  },
  dateGroup: {
    marginBottom: 22,
  },
  dateHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8B9D8B',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  cardTouch: {
    marginBottom: 10,
  },
  sightingCard: {
    minHeight: 74,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    minWidth: 0,
  },
  birdName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F0F7EE',
    marginBottom: 7,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '600',
  },
  sourceBadge: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  sourceText: {
    fontSize: 10,
    fontWeight: '800',
  },
  chipsColumn: {
    alignItems: 'flex-end',
    gap: 6,
  },
  confidenceBadge: {
    minWidth: 52,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '900',
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  riskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  riskText: {
    fontSize: 10,
    fontWeight: '700',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F0F7EE',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#8B9D8B',
    textAlign: 'center',
  },
});
