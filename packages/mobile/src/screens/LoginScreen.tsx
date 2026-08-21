import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useAuth } from '@sisio/shared';
import { GlassCard, GradientButton } from '../components';
import { useThemeColor } from '../hooks';
import { palette } from '../theme';

const forestGradient: [string, string, string, ...string[]] = [
  palette.verdeSelva,
  palette.azulNoche,
  palette.negroSelva,
];

export const LoginScreen = ({ navigation }: any) => {
  const { colors } = useThemeColor();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <LinearGradient colors={forestGradient} style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <Animated.View entering={ZoomIn.delay(100).springify()} style={styles.logoSection}>
              <Text style={styles.logoEmoji}>🦜</Text>
              <Text style={styles.logoText}>Sisio</Text>
            </Animated.View>

            <Animated.Text
              entering={FadeInDown.delay(200).springify()}
              style={styles.title}
            >
              Iniciar Sesión
            </Animated.Text>
            <Animated.Text
              entering={FadeInDown.delay(280).springify()}
              style={styles.subtitle}
            >
              Vuelve a tu cuaderno de avistamientos
            </Animated.Text>

            <Animated.View entering={FadeInUp.delay(360).springify()}>
              <GlassCard
                intensity={65}
                borderRadius={20}
                gradientColors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
              >
                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <View style={[styles.inputShell, { borderColor: colors.border, backgroundColor: colors.card }]}>
                      <Feather name="mail" size={18} color={colors.muted} />
                      <TextInput
                        style={[styles.input, { color: colors.foreground }]}
                        placeholder="tu@email.com"
                        placeholderTextColor={colors.muted}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Contraseña</Text>
                    <View style={[styles.inputShell, { borderColor: colors.border, backgroundColor: colors.card }]}>
                      <Feather name="lock" size={18} color={colors.muted} />
                      <TextInput
                        style={[styles.input, { color: colors.foreground }]}
                        placeholder="Tu contraseña"
                        placeholderTextColor={colors.muted}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        editable={!loading}
                      />
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Feather
                          name={showPassword ? 'eye-off' : 'eye'}
                          size={18}
                          color={colors.muted}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

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

                  <GradientButton
                    title={loading ? 'Entrando...' : 'Iniciar Sesión'}
                    onPress={handleLogin}
                    variant="gold"
                    size="lg"
                    fullWidth
                    loading={loading}
                    disabled={loading}
                  />
                </View>
              </GlassCard>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(460).springify()} style={styles.footer}>
              <Text style={styles.footerText}>¿No tienes cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.footerLink}>Crear una</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(540).springify()} style={styles.guestSection}>
              <GradientButton
                title="Entrar como Invitado"
                onPress={() => navigation.replace('Main')}
                variant="outline"
                size="md"
                fullWidth
                icon={<Feather name="user" size={16} color={colors.foreground} />}
              />
            </Animated.View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logoEmoji: {
    fontSize: 52,
    marginBottom: 4,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#F0F7EE',
    letterSpacing: -1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay_700Bold',
    textAlign: 'center',
    color: '#F0F7EE',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#8B9D8B',
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
    marginTop: 22,
  },
  footerText: {
    fontSize: 14,
    color: '#8B9D8B',
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '800',
    color: palette.oroIndigena,
  },
  guestSection: {
    marginTop: 16,
  },
});
