import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useAuth } from '@sisio/shared';
import { Button, GlassCard } from '../components';
import { useThemeColor } from '../hooks';

export const LoginScreen = ({ navigation }: any) => {
  const { colors } = useThemeColor();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, error, setError } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login({ email: email.trim(), password });
      navigation.replace('Main');
    } catch {
      // useAuth stores the displayable error message.
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior="padding"
    >
      <LinearGradient
        colors={[`${colors.secondary}14`, `${colors.primaryLight}08`, 'transparent']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={26} color={colors.foreground} />
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <Animated.View entering={ZoomIn.delay(80).springify()} style={styles.logoWrap}>
            <View style={[styles.logoCircle, { borderColor: colors.accent }]}>
              <Feather name="feather" size={42} color={colors.accent} />
            </View>
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.delay(120).springify()}
            style={[styles.title, { color: colors.foreground }]}
          >
            Iniciar Sesion
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(180).springify()}
            style={[styles.subtitle, { color: colors.muted }]}
          >
            Vuelve a tu cuaderno de avistamientos
          </Animated.Text>

          <Animated.View entering={FadeInUp.delay(240).springify()}>
            <GlassCard
              intensity={65}
              borderRadius={20}
              gradientColors={[`${colors.primaryLight}10`, `${colors.secondary}08`]}
            >
              <View style={styles.form}>
                <AuthField
                  label="Email"
                  icon="mail"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="tu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                  colors={colors}
                />
                <AuthField
                  label="Contrasena"
                  icon="lock"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Tu contrasena"
                  secureTextEntry
                  editable={!loading}
                  colors={colors}
                />

                {error && (
                  <View
                    style={[
                      styles.errorBox,
                      {
                        borderColor: `${colors.danger}55`,
                        backgroundColor: `${colors.danger}12`,
                      },
                    ]}
                  >
                    <Feather name="alert-circle" size={16} color={colors.danger} />
                    <Text style={[styles.errorText, { color: colors.danger }]}>
                      {error}
                    </Text>
                  </View>
                )}

                <Button
                  title={loading ? 'Entrando...' : 'Entrar'}
                  onPress={handleLogin}
                  loading={loading}
                  disabled={loading}
                  fullWidth
                  size="lg"
                />
              </View>
            </GlassCard>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(340).springify()} style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.muted }]}>
              No tienes cuenta?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.footerLink, { color: colors.accent }]}>
                Crear cuenta
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const AuthField = ({
  label,
  icon,
  colors,
  ...props
}: any) => (
  <View style={styles.inputGroup}>
    <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
    <View
      style={[
        styles.inputShell,
        {
          borderColor: colors.border,
          backgroundColor: colors.card,
        },
      ]}
    >
      <Feather name={icon} size={18} color={colors.muted} />
      <TextInput
        style={[styles.input, { color: colors.foreground }]}
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
  backButton: {
    width: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginTop: 4,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 18,
  },
  logoCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 160, 23, 0.08)',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 28,
  },
  form: {
    padding: 18,
    gap: 14,
  },
  inputGroup: {
    gap: 8,
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
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
  },
  errorBox: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 22,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '800',
  },
});
