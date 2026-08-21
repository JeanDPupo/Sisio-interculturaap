import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, ZoomIn, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { useAuth, useSightings } from '@sisio/shared';
import { GlassCard, GradientButton } from '../components';
import { useThemeColor } from '../hooks';
import { palette } from '../theme';

const badges = [
  { id: 'novato', icon: 'feather', label: 'Novato', requiredSightings: 0 },
  { id: 'observador', icon: 'eye', label: 'Observador', requiredSightings: 10 },
  { id: 'sabio', icon: 'book-open', label: 'Sabio', requiredSightings: 50 },
  { id: 'guardian', icon: 'shield', label: 'Guardián', requiredSightings: 100 },
];

export const ProfileScreen = ({ navigation }: any) => {
  const { colors } = useThemeColor();
  const { user, updateProfile, loading, logout } = useAuth();
  const { sightings, getSightings } = useSightings();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');

  const ringRotation = useSharedValue(0);

  useEffect(() => {
    ringRotation.value = withRepeat(
      withTiming(360, { duration: 8000 }),
      -1,
      false,
    );
  }, []);

  useEffect(() => {
    if (user?.id) getSightings(user.id);
  }, [user?.id]);

  const animatedRingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringRotation.value}deg` }],
  }));

  const totalSightings = sightings.length;
  const avgConfidence = sightings.length > 0
    ? Math.round(
        sightings.reduce((sum: number, s: any) => sum + (s.confidence || 0), 0) / sightings.length * 100
      )
    : 0;
  const criticalBirds = sightings.filter(
    (s: any) => s.ecosistema_riesgo === 'alto',
  ).length;

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
      })
    : 'N/A';

  const unlockedBadges = badges.filter((b) => totalSightings >= b.requiredSightings);

  const getInitial = (n: string) => n?.charAt(0).toUpperCase() || '?';

  const handleSave = async () => {
    try {
      await updateProfile({ name, bio });
      setIsEditing(false);
    } catch {
      alert('Error al actualizar perfil');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[palette.verdeSelva, palette.azulNoche, palette.negroSelva]}
        style={styles.heroGradient}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentBody}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={ZoomIn.delay(80).springify()} style={styles.avatarSection}>
          <Animated.View style={[styles.avatarRingOuter, animatedRingStyle]}>
            <LinearGradient
              colors={[palette.oroIndigena, palette.verdeHoja, palette.azulCielo, palette.oroIndigena]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarRing}
            >
              <View style={styles.avatarInner}>
                <Text style={styles.avatarText}>
                  {getInitial(user?.name || '')}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
          <Text style={styles.userName}>{user?.name || 'Explorador'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'Sin email'}</Text>
          <Text style={styles.levelText}>
            {unlockedBadges[unlockedBadges.length - 1]?.label || 'Novato'}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(160).springify()}>
          <GlassCard borderRadius={20} intensity={65}>
            {isEditing ? (
              <View style={styles.cardBody}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nombre</Text>
                  <View style={[styles.inputShell, { borderColor: colors.border, backgroundColor: colors.card }]}>
                    <Feather name="user" size={18} color={colors.muted} />
                    <TextInput
                      style={[styles.input, { color: colors.foreground }]}
                      placeholderTextColor={colors.muted}
                      value={name}
                      onChangeText={setName}
                      placeholder="Tu nombre"
                    />
                  </View>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <View style={[styles.inputShell, { borderColor: colors.border, backgroundColor: colors.card }]}>
                    <Feather name="mail" size={18} color={colors.muted} />
                    <TextInput
                      style={[styles.input, { color: colors.foreground }]}
                      placeholderTextColor={colors.muted}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="tu@email.com"
                      keyboardType="email-address"
                    />
                  </View>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Biografía</Text>
                  <View style={[styles.inputShell, styles.textAreaShell, { borderColor: colors.border, backgroundColor: colors.card }]}>
                    <Feather name="align-left" size={18} color={colors.muted} />
                    <TextInput
                      style={[styles.input, styles.textArea, { color: colors.foreground }]}
                      placeholderTextColor={colors.muted}
                      value={bio}
                      onChangeText={setBio}
                      placeholder="Cuéntanos sobre ti"
                      multiline
                      numberOfLines={4}
                    />
                  </View>
                </View>
                <View style={styles.buttonGroup}>
                  <GradientButton
                    title="Cancelar"
                    variant="outline"
                    onPress={() => setIsEditing(false)}
                    fullWidth
                    size="md"
                  />
                  <GradientButton
                    title={loading ? 'Guardando...' : 'Guardar'}
                    variant="gold"
                    onPress={handleSave}
                    fullWidth
                    size="md"
                    loading={loading}
                    disabled={loading}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.cardBody}>
                <InfoItem label="Nombre" value={user?.name || 'Explorador invitado'} />
                <InfoItem label="Email" value={user?.email || 'No completado'} />
                {user?.bio && <InfoItem label="Biografía" value={user.bio} />}
                <InfoItem
                  label="Idioma"
                  value={user?.language === 'es' ? 'Español' : 'English'}
                  last
                />
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={styles.editButton}
                >
                  <Feather name="edit-2" size={14} color={palette.oroIndigena} />
                  <Text style={styles.editButtonText}>Editar Perfil</Text>
                </TouchableOpacity>
              </View>
            )}
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220).springify()} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <Text style={styles.sectionHint}>Progreso de campo</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(280).springify()}>
          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <View style={styles.statHalf}>
                <GlassCard borderRadius={14} intensity={55}>
                  <View style={styles.statCard}>
                    <Feather name="map-pin" size={18} color={palette.oroIndigena} />
                    <Text style={styles.statValue}>{totalSightings}</Text>
                    <Text style={styles.statLabel}>Total Avistamientos</Text>
                  </View>
                </GlassCard>
              </View>
              <View style={styles.statHalf}>
                <GlassCard borderRadius={14} intensity={55}>
                  <View style={styles.statCard}>
                    <Feather name="target" size={18} color={palette.verdeHoja} />
                    <Text style={styles.statValue}>{avgConfidence}%</Text>
                    <Text style={styles.statLabel}>Confianza Promedio</Text>
                  </View>
                </GlassCard>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statHalf}>
                <GlassCard borderRadius={14} intensity={55}>
                  <View style={styles.statCard}>
                    <Feather name="alert-triangle" size={18} color={palette.riesgoAlto} />
                    <Text style={styles.statValue}>{criticalBirds}</Text>
                    <Text style={styles.statLabel}>Aves Críticas</Text>
                  </View>
                </GlassCard>
              </View>
              <View style={styles.statHalf}>
                <GlassCard borderRadius={14} intensity={55}>
                  <View style={styles.statCard}>
                    <Feather name="calendar" size={18} color={palette.azulCielo} />
                    <Text style={styles.statValueSmall}>{memberSince}</Text>
                    <Text style={styles.statLabel}>Miembro Desde</Text>
                  </View>
                </GlassCard>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(340).springify()} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Insignias</Text>
          <Text style={styles.sectionHint}>Tu progreso como observador</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).springify()}>
          <View style={styles.badgesGrid}>
            {badges.map((badge) => {
              const isUnlocked = totalSightings >= badge.requiredSightings;
              return (
                <View key={badge.id} style={styles.badgeHalf}>
                  <GlassCard borderRadius={14} intensity={55}>
                    <View
                      style={[
                        styles.badgeCard,
                        !isUnlocked && styles.badgeCardLocked,
                      ]}
                    >
                      <View
                        style={[
                          styles.badgeIcon,
                          {
                            backgroundColor: isUnlocked
                              ? `${palette.oroIndigena}20`
                              : 'rgba(255,255,255,0.05)',
                          },
                        ]}
                      >
                        <Feather
                          name={badge.icon as any}
                          size={22}
                          color={
                            isUnlocked ? palette.oroIndigena : '#4A5A4A'
                          }
                        />
                      </View>
                      <Text
                        style={[
                          styles.badgeLabel,
                          { color: isUnlocked ? '#F0F7EE' : '#4A5A4A' },
                        ]}
                      >
                        {badge.label}
                      </Text>
                      {!isUnlocked && (
                        <Text style={styles.badgeRequirement}>
                          {badge.requiredSightings} avistamientos
                        </Text>
                      )}
                      {isUnlocked && (
                        <Feather
                          name="check-circle"
                          size={14}
                          color={palette.riesgoBajo}
                          style={styles.badgeCheck}
                        />
                      )}
                    </View>
                  </GlassCard>
                </View>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(480).springify()} style={styles.settingsButtonSection}>
          <GradientButton
            title="Configuración"
            variant="outline"
            onPress={() => navigation.navigate('Settings')}
            fullWidth
            size="md"
            icon={<Feather name="settings" size={16} color={colors.foreground} />}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoItem = ({ label, value, last }: { label: string; value: string; last?: boolean }) => {
  const { colors } = useThemeColor();
  return (
    <View style={[styles.infoItem, !last && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
      <Text style={[styles.infoLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.negroSelva,
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
  },
  content: {
    flex: 1,
  },
  contentBody: {
    padding: 16,
    paddingBottom: 36,
    paddingTop: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 22,
  },
  avatarRingOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarRing: {
    width: 106,
    height: 106,
    borderRadius: 53,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: palette.negroSelva,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#F0F7EE',
  },
  userName: {
    fontSize: 22,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontWeight: '900',
    color: '#F0F7EE',
  },
  userEmail: {
    fontSize: 13,
    color: '#8B9D8B',
    marginTop: 4,
  },
  levelText: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.oroIndigena,
    marginTop: 4,
  },
  cardBody: {
    padding: 18,
  },
  inputGroup: {
    gap: 8,
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F0F7EE',
  },
  inputShell: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textAreaShell: {
    minHeight: 104,
    alignItems: 'flex-start',
    paddingTop: 14,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 78,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.oroIndigena,
  },
  infoItem: {
    paddingBottom: 14,
    marginBottom: 14,
  },
  infoLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    fontWeight: '800',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    lineHeight: 22,
    color: '#F0F7EE',
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontWeight: '800',
    color: '#F0F7EE',
  },
  sectionHint: {
    fontSize: 12,
    marginTop: 2,
    color: '#8B9D8B',
  },
  statsGrid: {
    gap: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statHalf: {
    flex: 1,
  },
  statCard: {
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#F0F7EE',
  },
  statValueSmall: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F0F7EE',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8B9D8B',
    textAlign: 'center',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeHalf: {
    width: '48%',
  },
  badgeCard: {
    padding: 14,
    alignItems: 'center',
    gap: 8,
  },
  badgeCardLocked: {
    opacity: 0.5,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  badgeRequirement: {
    fontSize: 10,
    color: '#4A5A4A',
  },
  badgeCheck: {
    marginTop: -2,
  },
  settingsButtonSection: {
    marginTop: 28,
  },
});
