import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useBirdStore, useAuth, useSightings } from '@sisio/shared';
import { theme } from '../theme';

export const BirdResultScreen = ({ navigation }: any) => {
  const { identificationResult } = useBirdStore();
  const { user } = useAuth();
  const { createSighting } = useSightings();
  const [saving, setSaving] = useState(false);

  if (!identificationResult?.bird) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>🦅</Text>
          <Text style={styles.errorText}>No hay resultado de identificación</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.primaryButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const bird = identificationResult.bird;
  const confidence = identificationResult.confidence || 0;
  const riskColor =
    bird.ecosistema_riesgo === 'alto'
      ? theme.colors.error
      : bird.ecosistema_riesgo === 'medio'
        ? theme.colors.warning
        : theme.colors.success;

  const handleSaveSighting = async () => {
    setSaving(true);
    try {
      await createSighting({
        bird_id: bird.id,
        user_id: user?.id,
        confidence: confidence,
        ecosystem_risk: bird.ecosistema_riesgo,
      } as any);
      alert('Avistamiento guardado');
      navigation.replace('Main');
    } catch { alert('Error al guardar avistamiento'); }
    finally { setSaving(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Resultado</Text>
        <View style={styles.backBtn} />
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.revealCard}>
          {bird.imagen_url ? (
            <Image source={{ uri: bird.imagen_url }} style={styles.birdImage} />
          ) : (
            <Text style={styles.birdEmoji}>🦅</Text>
          )}
          <Text style={styles.birdName}>{bird.nombre_espanol || bird.nombre_cientifico}</Text>
          <Text style={styles.scientificName}>{bird.nombre_cientifico}</Text>
          {bird.nombre_nativo && (
            <Text style={styles.nativeName}>
              {bird.nombre_nativo} ({bird.lengua})
            </Text>
          )}
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Confianza de identificación</Text>
            <View style={styles.confidenceBarBg}>
              <View
                style={[
                  styles.confidenceProgress,
                  { width: `${confidence * 100}%`, backgroundColor: theme.colors.secondary },
                ]}
              />
            </View>
            <Text style={styles.confidenceValue}>
              {Math.round(confidence * 100)}%
            </Text>
          </View>
        </View>

        {bird.significado_ancestral && (
          <View style={[styles.sectionCard, styles.sectionSignificado]}>
            <Text style={styles.sectionIcon}>🪶</Text>
            <Text style={styles.sectionTitle}>Significado Ancestral</Text>
            <Text style={styles.sectionText}>{bird.significado_ancestral}</Text>
          </View>
        )}

        {bird.rol_cosmovision && (
          <View style={[styles.sectionCard, styles.sectionCosmovision]}>
            <Text style={styles.sectionIcon}>🌞</Text>
            <Text style={styles.sectionTitle}>Rol en la Cosmovisión</Text>
            <Text style={styles.sectionText}>{bird.rol_cosmovision}</Text>
          </View>
        )}

        {bird.historias_ancestrales?.length > 0 && (
          <View style={[styles.sectionCard, styles.sectionHistorias]}>
            <Text style={styles.sectionIcon}>📚</Text>
            <Text style={styles.sectionTitle}>Historias Ancestrales</Text>
            {bird.historias_ancestrales.map((historia, idx) => (
              <Text key={idx} style={styles.historiaItem}>
                • {historia}
              </Text>
            ))}
          </View>
        )}

        {bird.habitat && (
          <View style={[styles.sectionCard, styles.sectionHabitat]}>
            <Text style={styles.sectionIcon}>🌿</Text>
            <Text style={styles.sectionTitle}>Hábitat</Text>
            <Text style={styles.sectionText}>{bird.habitat}</Text>
          </View>
        )}

        {bird.comportamientos && (
          <View style={[styles.sectionCard, styles.sectionComportamiento]}>
            <Text style={styles.sectionIcon}>🦜</Text>
            <Text style={styles.sectionTitle}>Comportamiento</Text>
            <Text style={styles.sectionText}>{bird.comportamientos}</Text>
          </View>
        )}

        <View style={[styles.riskBadge, { backgroundColor: riskColor + '20', borderColor: riskColor }]}>
          <Text style={[styles.riskText, { color: riskColor }]}>
            Riesgo ecológico: {bird.ecosistema_riesgo.toUpperCase()}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>Descartar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, saving && styles.buttonDisabled]}
          onPress={handleSaveSighting}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={theme.colors.background} />
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
    textAlign: 'center',
  },
  content: { flex: 1, padding: 16 },
  revealCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  birdImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 16,
  },
  birdEmoji: { fontSize: 80, marginBottom: 16 },
  birdName: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    fontFamily: theme.fonts.display,
    marginBottom: 4,
  },
  scientificName: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
  },
  nativeName: {
    fontSize: 16,
    color: theme.colors.secondary,
    textAlign: 'center',
    fontFamily: theme.fonts.native,
    fontWeight: '600',
    marginBottom: 20,
  },
  confidenceContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 16,
  },
  confidenceLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  confidenceBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  confidenceProgress: { height: '100%', borderRadius: 3 },
  confidenceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  sectionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  sectionSignificado: {
    backgroundColor: 'rgba(255, 152, 0, 0.08)',
    borderColor: 'rgba(255, 152, 0, 0.3)',
  },
  sectionCosmovision: {
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  sectionHistorias: {
    backgroundColor: 'rgba(33, 150, 243, 0.08)',
    borderColor: 'rgba(33, 150, 243, 0.3)',
  },
  sectionHabitat: {
    backgroundColor: 'rgba(139, 195, 74, 0.08)',
    borderColor: 'rgba(139, 195, 74, 0.3)',
  },
  sectionComportamiento: {
    backgroundColor: 'rgba(156, 39, 176, 0.08)',
    borderColor: 'rgba(156, 39, 176, 0.3)',
  },
  sectionIcon: { fontSize: 24, marginBottom: 8 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  historiaItem: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: 4,
  },
  riskBadge: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  riskText: {
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorIcon: { fontSize: 64, marginBottom: 16 },
  errorText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.background,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
  },
  secondaryButtonText: { color: theme.colors.text, fontSize: 16, fontWeight: '600' },
  buttonDisabled: { opacity: 0.5 },
});
