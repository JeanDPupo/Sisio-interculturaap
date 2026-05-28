import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useAuth } from '@sisio/shared';
import { Button, GlassCard, Header } from '../components';
import { useThemeColor } from '../hooks';

export const SettingsScreen = ({ navigation }: any) => {
  const { colors } = useThemeColor();
  const { user, updateProfile, logout, isGuest } = useAuth();
  const [themeEnabled, setThemeEnabled] = useState(user?.theme_preference === 'dark');
  const [language, setLanguage] = useState(user?.language === 'es' ? 0 : 1);

  const handleLogout = async () => {
    await logout();
    navigation.replace('Onboarding');
  };

  const handleThemeChange = (value: boolean) => {
    setThemeEnabled(value);
    updateProfile({ theme_preference: value ? 'dark' : 'light' });
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang === 'es' ? 0 : 1);
    updateProfile({ language: lang });
  };

  const settingItems = [
    {
      section: 'Apariencia',
      icon: 'sun',
      items: [
        { label: 'Tema oscuro', type: 'switch', value: themeEnabled, onChange: handleThemeChange },
      ],
    },
    {
      section: 'Idioma',
      icon: 'globe',
      items: [
        { label: 'Espanol', type: 'select', selected: language === 0, onPress: () => handleLanguageChange('es') },
        { label: 'English', type: 'select', selected: language === 1, onPress: () => handleLanguageChange('en') },
      ],
    },
    {
      section: 'Datos',
      icon: 'database',
      items: [
        { label: 'Exportar avistamientos', type: 'arrow' },
        { label: 'Eliminar datos locales', type: 'arrow', danger: true },
      ],
    },
    {
      section: 'Informacion',
      icon: 'info',
      items: [
        { label: 'Version', type: 'info', value: '0.2.0' },
        { label: 'Acerca de Sisio', type: 'arrow' },
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[`${colors.secondary}12`, `${colors.accent}08`, 'transparent']}
        style={StyleSheet.absoluteFill}
      />
      <Header
        title="Configuracion"
        subtitle="Preferencias de exploracion"
        leftIcon={<Feather name="chevron-left" size={24} color={colors.foreground} />}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentBody}
        showsVerticalScrollIndicator={false}
      >
        {settingItems.map((section, sectionIndex) => (
          <Animated.View
            key={section.section}
            entering={FadeInUp.delay(sectionIndex * 80).springify()}
            style={styles.section}
          >
            <View style={styles.sectionTitleRow}>
              <Feather name={section.icon as any} size={15} color={colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.muted }]}>
                {section.section}
              </Text>
            </View>

            <GlassCard borderRadius={16} intensity={55}>
              <View>
                {section.items.map((item: any, idx: number) => (
                  <TouchableOpacity
                    key={item.label}
                    style={[
                      styles.settingItem,
                      idx < section.items.length - 1 && {
                        borderBottomColor: colors.border,
                        borderBottomWidth: 1,
                      },
                      item.selected && { backgroundColor: `${colors.accent}10` },
                    ]}
                    onPress={item.onPress}
                    disabled={item.type === 'info' || item.type === 'switch'}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.settingLabel,
                        { color: item.danger ? colors.danger : colors.foreground },
                      ]}
                    >
                      {item.label}
                    </Text>
                    {item.type === 'switch' && (
                      <Switch
                        value={item.value}
                        onValueChange={item.onChange}
                        trackColor={{
                          false: colors.border,
                          true: `${colors.primaryLight}80`,
                        }}
                        thumbColor={item.value ? colors.primaryLight : colors.muted}
                      />
                    )}
                    {item.type === 'select' && item.selected && (
                      <Feather name="check" size={19} color={colors.accent} />
                    )}
                    {item.type === 'info' && (
                      <Text style={[styles.infoValue, { color: colors.muted }]}>
                        {item.value}
                      </Text>
                    )}
                    {item.type === 'arrow' && (
                      <Feather name="chevron-right" size={20} color={colors.muted} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </GlassCard>
          </Animated.View>
        ))}

        <Animated.View entering={FadeInUp.delay(360).springify()} style={styles.footerAction}>
          {isGuest ? (
            <Button
              title="Iniciar Sesion"
              variant="secondary"
              onPress={() => navigation.navigate('Login')}
              fullWidth
            />
          ) : (
            <Button
              title="Cerrar Sesion"
              variant="danger"
              onPress={handleLogout}
              fullWidth
            />
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  settingItem: {
    minHeight: 58,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerAction: {
    marginTop: 8,
  },
});
