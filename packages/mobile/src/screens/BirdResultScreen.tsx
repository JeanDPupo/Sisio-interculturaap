import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useBirdStore, useAuth, useSightings } from '@sisio/shared';

export const BirdResultScreen = ({ navigation }: any) => {
  const { identificationResult } = useBirdStore();
  const { user } = useAuth();
  const { createSighting } = useSightings();
  const [saving, setSaving] = useState(false);

  if (!identificationResult?.bird) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No hay resultado de identificación</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const bird = identificationResult.bird;
  const confidence = identificationResult.confidence || 0;

  const handleSaveSighting = async () => {
    setSaving(true);
    try {
      await createSighting({
        bird_id: bird.id,
        user_id: user?.id,
        confidence: confidence,
        ecosystem_risk: bird.ecosistema_riesgo,
      });
      alert('Avistamiento guardado');
      navigation.replace('Main');
    } catch (error) {
      alert('Error al guardar avistamiento');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Resultado</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.birdCard}>
          <Text style={styles.icon}>🦅</Text>
          <Text style={styles.birdName}>{bird.nombre_espanol || bird.nombre_cientifico}</Text>
          <Text style={styles.scientificName}>{bird.nombre_cientifico}</Text>

          {bird.nombre_nativo && (
            <Text style={styles.nativeName}>
              Nombre nativo: {bird.nombre_nativo} ({bird.lengua})
            </Text>
          )}

          <View style={styles.confidenceContainer}>
            <Text style={styles.label}>Confianza</Text>
            <View style={styles.confidenceBar}>
              <View
                style={[
                  styles.confidenceProgress,
                  { width: `${confidence * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.confidenceText}>{Math.round(confidence * 100)}%</Text>
          </View>

          {bird.significado_ancestral && (
            <View style={styles.ancestralBox}>
              <Text style={styles.sectionTitle}>📖 Significado Ancestral</Text>
              <Text style={styles.ancestralText}>{bird.significado_ancestral}</Text>
            </View>
          )}

          {bird.rol_cosmovision && (
            <View style={styles.ancestralBox}>
              <Text style={styles.sectionTitle}>🌍 Rol en la Cosmovision</Text>
              <Text style={styles.ancestralText}>{bird.rol_cosmovision}</Text>
            </View>
          )}

          {bird.historias_ancestrales?.length > 0 && (
            <View style={styles.ancestralBox}>
              <Text style={styles.sectionTitle}>📚 Historias</Text>
              {bird.historias_ancestrales.map((historia, idx) => (
                <Text key={idx} style={styles.ancestralText}>
                  • {historia}
                </Text>
              ))}
            </View>
          )}

          {bird.comportamientos && (
            <View style={styles.infoBox}>
              <Text style={styles.label}>Comportamiento</Text>
              <Text style={styles.infoText}>{bird.comportamientos}</Text>
            </View>
          )}

          {bird.habitat && (
            <View style={styles.infoBox}>
              <Text style={styles.label}>Hábitat</Text>
              <Text style={styles.infoText}>{bird.habitat}</Text>
            </View>
          )}

          <View style={styles.riskBadge} style={[
            styles.riskBadge,
            bird.ecosistema_riesgo === 'alto' && styles.riskHigh,
            bird.ecosistema_riesgo === 'medio' && styles.riskMedium,
            bird.ecosistema_riesgo === 'bajo' && styles.riskLow,
          ]}>
            <Text style={styles.riskText}>
              Riesgo ecosistema: {bird.ecosistema_riesgo.toUpperCase()}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>Descartar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton, saving && styles.buttonDisabled]}
          onPress={handleSaveSighting}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.primaryButtonText}>Guardar Avistamiento</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '500',
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  birdCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  icon: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 16,
  },
  birdName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  scientificName: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  nativeName: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  confidenceContainer: {
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  confidenceProgress: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  ancestralBox: {
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  ancestralText: {
    fontSize: 14,
    color: '#e65100',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e65100',
    marginBottom: 8,
  },
  infoBox: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  riskBadge: {
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  riskLow: {
    backgroundColor: '#c8e6c9',
  },
  riskMedium: {
    backgroundColor: '#ffe0b2',
  },
  riskHigh: {
    backgroundColor: '#ffcdd2',
  },
  riskText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2196F3',
    flex: 1,
    marginLeft: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#2196F3',
    flex: 1,
  },
  secondaryButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 8,
  },
});
