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

export const AudioCaptureScreen = ({ navigation }: any) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const durationInterval = useRef<any>(null);
  const { setLastIdentificationResult, setLoading: setBirdLoading } = useBirdStore();
  const { isOnline } = useOfflineStore();
  const { addToQueue } = useOfflineStore();

  const requestAudioPermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      return false;
    }
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
        return loc;
      }
    } catch (error) {
      console.log('Error getting location:', error);
    }
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
      await rec.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await rec.startAsync();

      setRecording(rec);
      setIsRecording(true);
      setDuration(0);
      await getLocation();

      durationInterval.current = setInterval(() => {
        setDuration((prev) => prev + 100);
      }, 100);
    } catch (error) {
      alert('Error al iniciar grabación');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      clearInterval(durationInterval.current);
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      setRecording(recording);
    } catch (error) {
      alert('Error al detener grabación');
    }
  };

  const handleIdentify = async () => {
    if (!recording) {
      alert('Por favor graba un audio primero');
      return;
    }

    setLoading(true);
    setBirdLoading(true);

    try {
      const uri = recording.getURI();
      if (!uri) {
        alert('Error al procesar audio');
        return;
      }

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

        setLastIdentificationResult(response.data);
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

        alert('Audio guardado en cola. Se identificará cuando haya conexión.');
        setRecording(null);
        setDuration(0);
        navigation.goBack();
      }
    } catch (error) {
      console.log('Error:', error);
      alert('Error al identificar. Intenta de nuevo.');
    } finally {
      setLoading(false);
      setBirdLoading(false);
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;
    return `${minutes}:${displaySeconds.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Sonido del Ave</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.recordingBox}>
          <Text style={styles.recordingIcon}>🎵</Text>

          {isRecording ? (
            <>
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>Grabando...</Text>
              </View>
              <Text style={styles.duration}>{formatDuration(duration)}</Text>
            </>
          ) : recording ? (
            <>
              <Text style={styles.recordedLabel}>Audio Grabado</Text>
              <Text style={styles.duration}>{formatDuration(duration)}</Text>
            </>
          ) : (
            <Text style={styles.noAudioText}>Presiona para grabar el canto</Text>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            📍 Ubicación: {location ? 'Capturada' : 'No disponible'}
          </Text>
        </View>

        <View style={styles.actions}>
          {!isRecording ? (
            <>
              <TouchableOpacity
                style={[styles.largeButton, styles.recordButton]}
                onPress={startRecording}
                disabled={recording !== null}
              >
                <Text style={styles.buttonIcon}>🎙️</Text>
                <Text style={styles.buttonText}>
                  {recording ? 'Audio Listo' : 'Iniciar Grabación'}
                </Text>
              </TouchableOpacity>

              {recording && (
                <>
                  <TouchableOpacity
                    style={[styles.largeButton, styles.secondaryButton]}
                    onPress={() => {
                      setRecording(null);
                      setDuration(0);
                    }}
                  >
                    <Text style={styles.secondaryButtonText}>Descartar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.largeButton,
                      styles.primaryButton,
                      loading && styles.buttonDisabled,
                    ]}
                    onPress={handleIdentify}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <>
                        <Text style={styles.buttonIcon}>🦅</Text>
                        <Text style={styles.buttonText}>Identificar Ave</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <TouchableOpacity
              style={[styles.largeButton, styles.stopButton]}
              onPress={stopRecording}
            >
              <Text style={styles.buttonIcon}>⏹️</Text>
              <Text style={styles.buttonText}>Detener Grabación</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>💡 Consejos</Text>
          <Text style={styles.tipText}>
            - Graba mínimo 5-10 segundos{'\n'}- Evita ruido de fondo{'\n'}- Acércate al ave
            si es posible
          </Text>
        </View>
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
    justifyContent: 'space-between',
  },
  recordingBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    elevation: 2,
  },
  recordingIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#f44336',
    marginRight: 8,
    animation: 'pulse',
  },
  recordingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f44336',
  },
  recordedLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  duration: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2196F3',
  },
  noAudioText: {
    fontSize: 14,
    color: '#999',
    marginTop: 16,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#1565c0',
  },
  actions: {
    gap: 12,
  },
  largeButton: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  recordButton: {
    backgroundColor: '#2196F3',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#999',
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  tipBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
});
