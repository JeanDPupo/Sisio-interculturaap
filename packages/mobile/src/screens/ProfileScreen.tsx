import React, { useState } from 'react';
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
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useAuth } from '@sisio/shared';
import { Button, GlassCard, Header, StatItem } from '../components';
import { useThemeColor } from '../hooks';

export const ProfileScreen = ({ navigation }: any) => {
  const { colors } = useThemeColor();
  const { user, updateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');

  const handleSave = async () => {
    try {
      await updateProfile({ name, bio });
      setIsEditing(false);
    } catch {
      alert('Error al actualizar perfil');
    }
  };

  const getInitial = (n: string) => n?.charAt(0).toUpperCase() || '?';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[`${colors.primaryLight}12`, `${colors.accent}08`, 'transparent']}
        style={StyleSheet.absoluteFill}
      />
      <Header
        title="Mi Perfil"
        subtitle={isEditing ? 'Editando memoria personal' : 'Cuaderno de explorador'}
        rightIcon={
          !isEditing ? <Feather name="edit-2" size={20} color={colors.accent} /> : undefined
        }
        onRightPress={() => setIsEditing(true)}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentBody}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={ZoomIn.delay(80).springify()} style={styles.avatarSection}>
          <LinearGradient
            colors={[colors.accent, colors.primaryLight, colors.secondary]}
            style={styles.avatarRing}
          >
            <View style={[styles.avatar, { backgroundColor: colors.background }]}>
              <Text style={[styles.avatarText, { color: colors.foreground }]}>
                {getInitial(user?.name || '')}
              </Text>
            </View>
          </LinearGradient>
          <Text style={[styles.levelText, { color: colors.accent }]}>
            Explorador principiante
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(160).springify()}>
          <GlassCard borderRadius={20} intensity={65}>
            {isEditing ? (
              <View style={styles.cardBody}>
                <ProfileField
                  label="Nombre"
                  icon="user"
                  value={name}
                  onChangeText={setName}
                  placeholder="Tu nombre"
                  colors={colors}
                />
                <ProfileField
                  label="Biografia"
                  icon="align-left"
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Cuentanos sobre ti"
                  multiline
                  numberOfLines={4}
                  textArea
                  colors={colors}
                />
                <View style={styles.buttonGroup}>
                  <Button
                    title="Cancelar"
                    variant="outline"
                    onPress={() => setIsEditing(false)}
                    fullWidth
                  />
                  <Button
                    title={loading ? 'Guardando...' : 'Guardar'}
                    onPress={handleSave}
                    loading={loading}
                    disabled={loading}
                    fullWidth
                  />
                </View>
              </View>
            ) : (
              <View style={styles.cardBody}>
                <InfoItem label="Nombre" value={user?.name || 'Explorador invitado'} colors={colors} />
                {user?.bio && <InfoItem label="Biografia" value={user.bio} colors={colors} />}
                <InfoItem label="Email" value={user?.email || 'No completado'} colors={colors} />
                <InfoItem
                  label="Idioma"
                  value={user?.language === 'es' ? 'Espanol' : 'English'}
                  colors={colors}
                  last
                />
              </View>
            )}
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240).springify()} style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Estadisticas</Text>
          <Text style={[styles.sectionHint, { color: colors.muted }]}>Progreso de campo</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).springify()}>
          <GlassCard borderRadius={18} intensity={55}>
            <View style={styles.statsRow}>
              <StatItem
                value={0}
                label="Avistamientos"
                color={colors.accent}
                icon={<Feather name="map-pin" size={19} color={colors.accent} />}
              />
              <StatItem
                value={0}
                label="Especies"
                color={colors.primaryLight}
                icon={<Feather name="feather" size={19} color={colors.primaryLight} />}
              />
              <StatItem
                value={0}
                label="Racha"
                color={colors.secondary}
                icon={<Feather name="zap" size={19} color={colors.secondary} />}
              />
            </View>
          </GlassCard>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoItem = ({ label, value, colors, last }: any) => (
  <View style={[styles.infoItem, !last && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
    <Text style={[styles.infoLabel, { color: colors.muted }]}>{label}</Text>
    <Text style={[styles.infoValue, { color: colors.foreground }]}>{value}</Text>
  </View>
);

const ProfileField = ({ label, icon, colors, textArea, ...props }: any) => (
  <View style={styles.inputGroup}>
    <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
    <View
      style={[
        styles.inputShell,
        textArea && styles.textAreaShell,
        { borderColor: colors.border, backgroundColor: colors.card },
      ]}
    >
      <Feather name={icon} size={18} color={colors.muted} />
      <TextInput
        style={[styles.input, textArea && styles.textArea, { color: colors.foreground }]}
        placeholderTextColor={colors.muted}
        {...props}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentBody: {
    padding: 16,
    paddingBottom: 28,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 22,
  },
  avatarRing: {
    width: 106,
    height: 106,
    borderRadius: 53,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 34,
    fontWeight: '900',
  },
  levelText: {
    fontSize: 13,
    fontWeight: '700',
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
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sectionHint: {
    fontSize: 12,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 8,
  },
});
