import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Animated as RNAnimated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useAuth } from '@sisio/shared';
import { GlassCard } from '../components';
import { palette } from '../theme';

const languages = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'kog', label: 'Kogui' },
  { code: 'wiw', label: 'Wiwa' },
  { code: 'arh', label: 'Arhuaco' },
];

export const SettingsScreen = ({ navigation }: any) => {
  const { user, updateProfile, logout } = useAuth();
  const [themeDark, setThemeDark] = useState(user?.theme_preference === 'dark');
  const [selectedLanguage, setSelectedLanguage] = useState(user?.language || 'es');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigation.replace('Onboarding');
  };

  const handleThemeToggle = (value: boolean) => {
    setThemeDark(value);
    updateProfile({ theme_preference: value ? 'dark' : 'light' });
  };

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    updateProfile({ language: code });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[`${palette.azulCielo}12`, `${palette.oroIndigena}08`, 'transparent']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="chevron-left" size={24} color="#F0F7EE" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentBody}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.delay(80).springify()} style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Feather name="sun" size={15} color={palette.oroIndigena} />
            <Text style={styles.sectionTitle}>Apariencia</Text>
          </View>
          <GlassCard borderRadius={16} intensity={55}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => handleThemeToggle(!themeDark)}
              activeOpacity={0.8}
            >
              <View style={styles.themeToggleRow}>
                <View style={[styles.themeIconWrap, !themeDark && styles.themeIconActive]}>
                  <Feather name="sun" size={18} color={!themeDark ? palette.oroIndigena : '#4A5A4A'} />
                </View>
                <View style={[styles.themeTrack, themeDark && styles.themeTrackActive]}>
                  <Animated.View
                    style={[
                      styles.themeThumb,
                      themeDark ? styles.themeThumbRight : styles.themeThumbLeft,
                    ]}
                  />
                </View>
                <View style={[styles.themeIconWrap, themeDark && styles.themeIconActive]}>
                  <Feather name="moon" size={18} color={themeDark ? palette.azulCielo : '#4A5A4A'} />
                </View>
              </View>
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(140).springify()} style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Feather name="globe" size={15} color={palette.oroIndigena} />
            <Text style={styles.sectionTitle}>Idioma</Text>
          </View>
          <GlassCard borderRadius={16} intensity={55}>
            <View style={styles.languageGrid}>
              {languages.map((lang) => {
                const selected = selectedLanguage === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    onPress={() => handleLanguageChange(lang.code)}
                    style={[
                      styles.languageCard,
                      {
                        borderColor: selected ? palette.oroIndigena : 'rgba(255,255,255,0.08)',
                        backgroundColor: selected ? `${palette.oroIndigena}15` : 'rgba(255,255,255,0.03)',
                      },
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.languageText,
                        { color: selected ? palette.oroIndigena : '#8B9D8B' },
                      ]}
                    >
                      {lang.label}
                    </Text>
                    {selected && (
                      <Feather name="check" size={14} color={palette.oroIndigena} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Feather name="bell" size={15} color={palette.oroIndigena} />
            <Text style={styles.sectionTitle}>Notificaciones</Text>
          </View>
          <GlassCard borderRadius={16} intensity={55}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setPushEnabled(!pushEnabled)}
              activeOpacity={0.8}
            >
              <Text style={styles.settingLabel}>Notificaciones Push</Text>
              <View style={[styles.toggleTrack, pushEnabled && styles.toggleTrackActive]}>
                <View style={[styles.toggleThumb, pushEnabled && styles.toggleThumbActive]} />
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setOfflineMode(!offlineMode)}
              activeOpacity={0.8}
            >
              <Text style={styles.settingLabel}>Modo Offline</Text>
              <View style={[styles.toggleTrack, offlineMode && styles.toggleTrackActive]}>
                <View style={[styles.toggleThumb, offlineMode && styles.toggleThumbActive]} />
              </View>
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(260).springify()} style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Feather name="database" size={15} color={palette.oroIndigena} />
            <Text style={styles.sectionTitle}>Datos</Text>
          </View>
          <GlassCard borderRadius={16} intensity={55}>
            <TouchableOpacity style={styles.settingItem} activeOpacity={0.8}>
              <Text style={styles.settingLabel}>Descargar Mis Datos</Text>
              <Feather name="download" size={18} color="#8B9D8B" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingItem} activeOpacity={0.8}>
              <Text style={[styles.settingLabel, { color: palette.riesgoAlto }]}>
                Eliminar Datos Locales
              </Text>
              <Feather name="trash-2" size={18} color={palette.riesgoAlto} />
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(320).springify()} style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Feather name="user" size={15} color={palette.oroIndigena} />
            <Text style={styles.sectionTitle}>Cuenta</Text>
          </View>
          <GlassCard borderRadius={16} intensity={55}>
            <TouchableOpacity style={styles.settingItem} onPress={handleLogout} activeOpacity={0.8}>
              <Text style={[styles.settingLabel, { color: palette.riesgoAlto }]}>
                Cerrar Sesión
              </Text>
              <Feather name="log-out" size={18} color={palette.riesgoAlto} />
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(380).springify()} style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Feather name="info" size={15} color={palette.oroIndigena} />
            <Text style={styles.sectionTitle}>Acerca de</Text>
          </View>
          <GlassCard borderRadius={16} intensity={55}>
            <View style={styles.aboutSection}>
              <View style={styles.aboutLogoRow}>
                <Text style={styles.aboutLogoEmoji}>🦜</Text>
                <Text style={styles.aboutLogoText}>Sisio</Text>
              </View>
              <Text style={styles.aboutVersion}>Versión 1.0.0</Text>
              <Text style={styles.aboutDescription}>
                Sisio es una aplicación para el monitoreo participativo de aves en la Sierra Nevada de Santa Marta, conectando el conocimiento científico con las tradiciones ancestrales de los pueblos Arhuaco, Kogui y Wiwa.
              </Text>
            </View>
          </GlassCard>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.negroSelva,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    fontWeight: '800',
    color: '#F0F7EE',
  },
  content: {
    flex: 1,
  },
  contentBody: {
    padding: 16,
    paddingBottom: 36,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    color: '#8B9D8B',
  },
  settingItem: {
    minHeight: 58,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#F0F7EE',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: 16,
  },
  themeToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
    paddingHorizontal: 16,
    width: '100%',
  },
  themeIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  themeIconActive: {
    backgroundColor: 'rgba(212, 160, 23, 0.15)',
  },
  themeTrack: {
    flex: 1,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  themeTrackActive: {
    backgroundColor: `${palette.azulNoche}`,
  },
  themeThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: palette.oroIndigena,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  themeThumbLeft: {
    alignSelf: 'flex-start',
  },
  themeThumbRight: {
    alignSelf: 'flex-end',
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 8,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: '45%',
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleTrackActive: {
    backgroundColor: palette.verdeSelva,
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#8B9D8B',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
    backgroundColor: palette.verdeHoja,
  },
  aboutSection: {
    padding: 18,
    alignItems: 'center',
    gap: 8,
  },
  aboutLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  aboutLogoEmoji: {
    fontSize: 28,
  },
  aboutLogoText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F0F7EE',
  },
  aboutVersion: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B9D8B',
  },
  aboutDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: '#8B9D8B',
    textAlign: 'center',
    marginTop: 4,
  },
});
