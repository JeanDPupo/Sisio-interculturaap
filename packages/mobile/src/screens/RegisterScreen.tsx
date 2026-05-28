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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useAuth } from '@sisio/shared';
import { Button, GlassCard } from '../components';
import { useThemeColor } from '../hooks';

export const RegisterScreen = ({ navigation }: any) => {
  const { colors } = useThemeColor();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const { register, error, setError } = useAuth();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setLocalError('Por favor completa todos los campos');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Las contrasenas no coinciden');
      return;
    }
    if (password.length < 6) {
      setLocalError('La contrasena debe tener al menos 6 caracteres');
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
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior="padding"
    >
      <LinearGradient
        colors={[`${colors.accent}12`, `${colors.primaryLight}08`, 'transparent']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={26} color={colors.foreground} />
          </TouchableOpacity>

          <View style={styles.formContainer}>
            <Animated.View entering={ZoomIn.delay(80).springify()} style={styles.logoWrap}>
              <View style={[styles.logoCircle, { borderColor: colors.primaryLight }]}>
                <Feather name="users" size={40} color={colors.primaryLight} />
              </View>
            </Animated.View>

            <Animated.Text
              entering={FadeInDown.delay(120).springify()}
              style={[styles.title, { color: colors.foreground }]}
            >
              Crear Cuenta
            </Animated.Text>
            <Animated.Text
              entering={FadeInDown.delay(180).springify()}
              style={[styles.subtitle, { color: colors.muted }]}
            >
              Unete a la comunidad Sisio y guarda tus avistamientos
            </Animated.Text>

            <Animated.View entering={FadeInUp.delay(240).springify()}>
              <GlassCard
                intensity={65}
                borderRadius={20}
                gradientColors={[`${colors.accent}10`, `${colors.primaryLight}08`]}
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

                  <AuthField
                    label="Nombre"
                    icon="user"
                    value={name}
                    onChangeText={setName}
                    placeholder="Tu nombre"
                    autoCapitalize="words"
                    editable={!loading}
                    colors={colors}
                  />
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
                    placeholder="Minimo 6 caracteres"
                    secureTextEntry
                    editable={!loading}
                    colors={colors}
                  />
                  <AuthField
                    label="Confirmar contrasena"
                    icon="shield"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Repite la contrasena"
                    secureTextEntry
                    editable={!loading}
                    colors={colors}
                  />

                  <Button
                    title={loading ? 'Creando...' : 'Crear Cuenta'}
                    onPress={handleRegister}
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
                Ya tienes cuenta?
              </Text>
              <TouchableOpacity onPress={() => navigation.replace('Login')}>
                <Text style={[styles.footerLink, { color: colors.accent }]}>
                  Iniciar sesion
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
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
    paddingBottom: 28,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 195, 74, 0.08)',
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
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '800',
  },
});
