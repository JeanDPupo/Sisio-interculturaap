import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
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

export const RegisterScreen = ({ navigation }: any) => {
  const { colors } = useThemeColor();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const { register, error, setError } = useAuth();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setLocalError('Por favor completa todos los campos');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 8) {
      setLocalError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);
    setLocalError('');
    setError(null);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      navigation.replace('Main');
    } catch {
      setLocalError(error || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <LinearGradient colors={forestGradient} style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <Animated.View entering={ZoomIn.delay(100).springify()} style={styles.logoSection}>
                <Text style={styles.logoEmoji}>🦜</Text>
                <Text style={styles.logoText}>Sisio</Text>
              </Animated.View>

              <Animated.Text
                entering={FadeInDown.delay(200).springify()}
                style={styles.title}
              >
                Crear Cuenta
              </Animated.Text>
              <Animated.Text
                entering={FadeInDown.delay(280).springify()}
                style={styles.subtitle}
              >
                Únete a la comunidad Sisio y guarda tus avistamientos
              </Animated.Text>

              <Animated.View entering={FadeInUp.delay(360).springify()}>
                <GlassCard
                  intensity={65}
                  borderRadius={20}
                  gradientColors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
                >
                  <View style={styles.form}>
                    {displayError && (
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
                          {displayError}
                        </Text>
                      </View>
                    )}

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Nombre</Text>
                      <View style={[styles.inputShell, { borderColor: colors.border, backgroundColor: colors.card }]}>
                        <Feather name="user" size={18} color={colors.muted} />
                        <TextInput
                          style={[styles.input, { color: colors.foreground }]}
                          placeholder="Tu nombre"
                          placeholderTextColor={colors.muted}
                          value={name}
                          onChangeText={setName}
                          autoCapitalize="words"
                          editable={!loading}
                        />
                      </View>
                    </View>

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
                          placeholder="Mínimo 8 caracteres"
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

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Confirmar contraseña</Text>
                      <View style={[styles.inputShell, { borderColor: colors.border, backgroundColor: colors.card }]}>
                        <Feather name="shield" size={18} color={colors.muted} />
                        <TextInput
                          style={[styles.input, { color: colors.foreground }]}
                          placeholder="Repite la contraseña"
                          placeholderTextColor={colors.muted}
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                          secureTextEntry={!showConfirmPassword}
                          editable={!loading}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                          <Feather
                            name={showConfirmPassword ? 'eye-off' : 'eye'}
                            size={18}
                            color={colors.muted}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {password.length > 0 && (
                      <View style={styles.validationRow}>
                        <Feather
                          name={password.length >= 8 ? 'check-circle' : 'x-circle'}
                          size={14}
                          color={password.length >= 8 ? colors.success : colors.danger}
                        />
                        <Text
                          style={[
                            styles.validationText,
                            { color: password.length >= 8 ? colors.success : colors.danger },
                          ]}
                        >
                          Mínimo 8 caracteres
                        </Text>
                      </View>
                    )}

                    {confirmPassword.length > 0 && (
                      <View style={styles.validationRow}>
                        <Feather
                          name={password === confirmPassword ? 'check-circle' : 'x-circle'}
                          size={14}
                          color={password === confirmPassword ? colors.success : colors.danger}
                        />
                        <Text
                          style={[
                            styles.validationText,
                            { color: password === confirmPassword ? colors.success : colors.danger },
                          ]}
                        >
                          Las contraseñas coinciden
                        </Text>
                      </View>
                    )}

                    <GradientButton
                      title={loading ? 'Creando...' : 'Crear Cuenta'}
                      onPress={handleRegister}
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
                <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.replace('Login')}>
                  <Text style={styles.footerLink}>Iniciar Sesión</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 20,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logoEmoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  logoText: {
    fontSize: 34,
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
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  form: {
    padding: 18,
    gap: 13,
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
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -4,
  },
  validationText: {
    fontSize: 12,
    fontWeight: '600',
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
    marginTop: 20,
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
});
