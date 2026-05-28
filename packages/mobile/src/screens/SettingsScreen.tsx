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
import { useAuth } from '@sisio/shared';
import { theme } from '../theme';

export const SettingsScreen = ({ navigation }: any) => {
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
      items: [
        { label: 'Tema Oscuro', type: 'switch', value: themeEnabled, onChange: handleThemeChange },
      ],
    },
    {
      section: 'Idioma',
      items: [
        { label: 'Español', type: 'select', selected: language === 0, onPress: () => handleLanguageChange('es') },
        { label: 'English', type: 'select', selected: language === 1, onPress: () => handleLanguageChange('en') },
      ],
    },
    {
      section: 'Datos',
      items: [
        { label: 'Exportar Avistamientos', type: 'arrow' },
        { label: 'Eliminar Datos Locales', type: 'arrow' },
      ],
    },
    {
      section: 'Información',
      items: [
        { label: 'Versión', type: 'info', value: '0.2.0' },
        { label: 'Acerca de Sisio', type: 'arrow' },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Configuración</Text>
        <View style={styles.backBtn} />
      </View>
      <ScrollView style={styles.content}>
        {settingItems.map((section) => (
          <View key={section.section} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            <View style={styles.sectionBody}>
              {section.items.map((item: any, idx: number) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.settingItem, item.selected && styles.settingItemSelected]}
                  onPress={item.onPress}
                  disabled={item.type === 'info' || item.type === 'switch'}
                >
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  {item.type === 'switch' && (
                    <Switch
                      value={item.value}
                      onValueChange={item.onChange}
                      trackColor={{ false: 'rgba(255,255,255,0.1)', true: theme.colors.secondary + '60' }}
                      thumbColor={item.value ? theme.colors.secondary : '#666'}
                    />
                  )}
                  {item.type === 'select' && item.selected && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                  {item.type === 'info' && (
                    <Text style={styles.infoValue}>{item.value}</Text>
                  )}
                  {item.type === 'arrow' && (
                    <Text style={styles.arrow}>›</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {isGuest ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.primaryButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
    paddingVertical: 12,
  },
  backBtn: { width: 40 },
  backArrow: { fontSize: 32, color: theme.colors.text, fontWeight: '300' },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 8,
    paddingHorizontal: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionBody: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingItemSelected: {
    backgroundColor: 'rgba(212, 160, 23, 0.08)',
  },
  settingLabel: {
    fontSize: 15,
    color: theme.colors.text,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 22,
    color: theme.colors.textSecondary,
  },
  checkmark: {
    fontSize: 18,
    color: theme.colors.secondary,
    fontWeight: '700',
  },
  infoValue: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  primaryButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  primaryButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
