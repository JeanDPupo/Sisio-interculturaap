import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';
import { useBirdStore, useOfflineStore, apiService } from '@sisio/shared';
import { theme } from '../theme';

export const AudioCaptureScreen = ({ navigation }: any) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const durationInterval = useRef<any>(null);
  const { setIdentificationResult, setLoading: setBirdLoading } = useBirdStore();
  const { isOnline } = useOfflineStore();
  const { addToQueue } = useOfflineStore();

  const requestAudioPermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch { return false; }
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
        return loc;
      }
    } catch { return null; }
    return null;
  };

  const startRecording = async () => {
    const hasPermission = await requestAudioPermission();
    if (!hasPermission) {
      alert('Se necesita permiso de micrófono');
      return;
    }
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      setRecording(rec);
      setIsRecording(true);
      setDuration(0);
      await getLocation();
      durationInterval.current = setInterval(() => {
        setDuration((prev) => prev + 100);
      }, 100);
    } catch { alert('Error al iniciar grabación'); }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      clearInterval(durationInterval.current);
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      setRecording(recording);
    } catch { alert('Error al detener grabación'); }
  };

  const handleIdentify = async () => {
    if (!recording) return;
    setLoading(true);
    setBirdLoading(true);
    try {
      const uri = recording.getURI();
      if (!uri) return;
      const file = {
        uri,
        type: 'audio/wav',
        name: `audio_${Date.now()}.wav`,
      } as any;
      if (isOnline && location) {
        const response = await apiService.identifyBirdFromAudio(
          file,
          location.coords.latitude,
          location.coords.longitude
        );
        setIdentificationResult(response.data);
        navigation.navigate('BirdResult');
      } else if (!isOnline) {
        addToQueue({
          id: `audio_${Date.now()}`,
          action: 'identify_audio',
          data: {
            audio: uri,
            latitude: location?.coords.latitude,
            longitude: location?.coords.longitude,
          },
          timestamp: new Date().toISOString(),
          retries: 0,
        });
        alert('Audio guardado en cola.');
        setRecording(null);
        setDuration(0);
        navigation.goBack();
      }
    } catch { alert('Error al identificar.'); }
    finally {
      setLoading(false);
      setBirdLoading(false);
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Sonido del Ave</Text>
        <View style={styles.backBtn} />
      </View>
      <View style={styles.content}>
        <View style={styles.recordingBox}>
          <Text style={styles.recordingIcon}>
            {isRecording ? '🎙️' : recording ? '✅' : '🎵'}
          </Text>
          {isRecording ? (
            <>
              <View style={styles.waveformContainer}>
                {[...Array(5)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.waveformBar,
                      { height: 20 + Math.random() * 40 },
                    ]}
                  />
                ))}
              </View>
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>Grabando</Text>
              </View>
              <Text style={styles.duration}>{formatDuration(duration)}</Text>
            </>
          ) : recording ? (
            <>
              <Text style={styles.recordedLabel}>Audio grabado</Text>
              <Text style={styles.duration}>{formatDuration(duration)}</Text>
            </>
          ) : (
            <Text style={styles.noAudioText}>
              Presiona para grabar el canto del ave
            </Text>
          )}
        </View>
        <View style={styles.locationBadge}>
          <Text style={styles.locationText}>
            📍 {location ? 'Ubicación capturada' : 'Sin ubicación'}
          </Text>
        </View>
        <View style={styles.actions}>
          {!isRecording ? (
            <>
              <TouchableOpacity
                style={[styles.recordButton, recording && styles.recordButtonDone]}
                onPress={startRecording}
                disabled={recording !== null}
              >
                <Text style={styles.recordIcon}>
                  {recording ? '✅' : '🎙️'}
                </Text>
                <Text style={styles.recordButtonText}>
                  {recording ? 'Audio Listo' : 'Iniciar Grabación'}
                </Text>
              </TouchableOpacity>
              {recording && (
                <>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => { setRecording(null); setDuration(0); }}
                  >
                    <Text style={styles.secondaryButtonText}>Descartar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.primaryButton, loading && styles.buttonDisabled]}
                    onPress={handleIdentify}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color={theme.colors.background} />
                    ) : (
                      <Text style={styles.primaryButtonText}>Identificar Ave</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
              <Text style={styles.stopIcon}>⏹</Text>
              <Text style={styles.stopButtonText}>Detener</Text>
            </TouchableOpacity>
          )}
        </View>
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
  backArrow: {
    fontSize: 32,
    color: theme.colors.text,
    fontWeight: '300',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  recordingBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  recordingIcon: { fontSize: 56, marginBottom: 16 },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
    height: 60,
  },
  waveformBar: {
    width: 4,
    backgroundColor: theme.colors.secondary,
    borderRadius: 2,
    opacity: 0.8,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.error,
  },
  recordingText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.error,
  },
  recordedLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  duration: {
    fontSize: 36,
    fontWeight: '700',
    color: theme.colors.secondary,
    fontFamily: theme.fonts.mono,
  },
  noAudioText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 8,
    textAlign: 'center',
  },
  locationBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  locationText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  actions: { gap: 12 },
  recordButton: {
    backgroundColor: 'rgba(45, 80, 22, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  recordButtonDone: {
    borderColor: theme.colors.primary,
    opacity: 0.7,
  },
  recordIcon: { fontSize: 24 },
  recordButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
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
  },
  secondaryButtonText: { color: theme.colors.text, fontSize: 16, fontWeight: '600' },
  buttonDisabled: { opacity: 0.5 },
  stopButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 20,
    borderRadius: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  stopIcon: { fontSize: 22, color: '#fff' },
  stopButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
