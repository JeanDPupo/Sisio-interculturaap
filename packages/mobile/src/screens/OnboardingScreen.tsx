import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { useAuthStore } from '@sisio/shared';
import { apiService } from '@sisio/shared';

export const OnboardingScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { guestLogin } = useAuthStore();

  const handleContinueAsGuest = async () => {
    if (!name.trim()) {
      alert('Por favor ingresa tu nombre');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.createGuestUser(name.trim());
      const data = response.data;

      guestLogin({
        name: name.trim(),
        guest_id: data.guest_id,
      });

      navigation.replace('Main');
    } catch (error) {
      alert('Error al crear usuario. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.content}>
        <Text style={styles.logo}>🦅</Text>
        <Text style={styles.title}>Bienvenido a Sisio</Text>
        <Text style={styles.subtitle}>
          Descubre el conocimiento ancestral sobre las aves de tu territorio
        </Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>¿Cómo te podemos llamar?</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            value={name}
            onChangeText={setName}
            editable={!loading}
            placeholderTextColor="#999"
          />

          <TouchableOpacity
            style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleContinueAsGuest}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Cargando...' : 'Continuar como Invitado'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.divider}>O</Text>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonTextSecondary}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.note}>
          Puedes completar tu perfil más tarde desde la configuración
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  formContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: '#2196F3',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  divider: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 12,
    fontWeight: '500',
  },
  note: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
