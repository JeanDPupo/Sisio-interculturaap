import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBirdStore, useOfflineStore, apiService } from '@sisio/shared';
import { Button, GlassCard, Header } from '../components';
import { useThemeColor } from '../hooks';

const WAVE_BARS = 28;

export const AudioCaptureScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColor();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [waveData, setWaveData] = useState<number[]>(
    Array.from({ length: WAVE_BARS }, (_, i) => 0.18 + (i % 5) * 0.08)
  );
  const durationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const waveInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const { setIdentificationResult, setLoading: setBirdLoading } = useBirdStore();
  const { isOnline, addToQueue } = useOfflineStore();

  const pulse = useSharedValue(1);
  const ring = useSharedValue(0);

  useEffect(() => {
    if (isRecording) {
      pulse.value = withRepeat(withTiming(1.08, { duration: 620 }), -1, true);
      ring.value = withRepeat(withTiming(1, { duration: 1400 }), -1, false);
      waveInterval.current = setInterval(() => {
        setWaveData((bars) =>
          bars.map((_, i) => {
            const seed = (Date.now() / 220 + i * 1.7) % Math.PI;
            return 0.2 + Math.abs(Math.sin(seed)) * 0.78;
          })
        );
      }, 180);
    } else {
      pulse.value = withTiming(1, { duration: 200 });
      ring.value = withTiming(0, { duration: 200 });
      if (waveInterval.current) clearInterval(waveInterval.current);
      setWaveData(Array.from({ length: WAVE_BARS }, (_, i) => 0.16 + (i % 4) * 0.07));
    }

    return () => {
      if (waveInterval.current) clearInterval(waveInterval.current);
    };
  }, [isRecording, pulse, ring]);

  useEffect(() => {
    return () => {
      if (durationInterval.current) clearInterval(durationInterval.current);
      if (waveInterval.current) clearInterval(waveInterval.current);
    };
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: isRecording ? 1 - ring.value : 0,
    transform: [{ scale: 1 + ring.value * 0.9 }],
  }));

  const requestAudioPermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch {
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
    } catch {
      return null;
    }
    return null;
  };

  const startRecording = async () => {
    const hasPermission = await requestAudioPermission();
    if (!hasPermission) {
      alert('Se necesita permiso de microfono');
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
    } catch {
      alert('Error al iniciar grabacion');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      if (durationInterval.current) clearInterval(durationInterval.current);
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      setRecording(recording);
    } catch {
      alert('Error al detener grabacion');
    }
  };

  const resetRecording = () => {
    setRecording(null);
    setDuration(0);
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
        alert('Audio guardado en cola. Se identificara cuando haya conexion.');
        resetRecording();
        navigation.goBack();
      }
    } catch {
      alert('Error al identificar.');
    } finally {
      setLoading(false);
      setBirdLoading(false);
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const statusLabel = isRecording
    ? 'Escuchando la Sierra'
    : recording
      ? 'Audio listo'
      : 'Listo para grabar';

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <LinearGradient
        colors={[`${colors.secondary}14`, `${colors.primaryLight}08`, 'transparent']}
        style={StyleSheet.absoluteFill}
      />

      <Header
        title="Sonido del Ave"
        subtitle={statusLabel}
        leftIcon={<Feather name="chevron-left" size={24} color={colors.foreground} />}
        onLeftPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <GlassCard
            intensity={70}
            borderRadius={20}
            gradientColors={[`${colors.secondary}12`, `${colors.primaryLight}08`]}
          >
            <View style={styles.waveCard}>
              <Text style={[styles.kicker, { color: colors.accent }]}>
                IDENTIFICACION POR CANTO
              </Text>
              <Text style={[styles.instructions, { color: colors.muted }]}>
                Graba entre 5 y 20 segundos del canto, evitando viento o voces cercanas.
              </Text>

              <View style={styles.waveform}>
                {waveData.map((value, index) => (
                  <LinearGradient
                    key={index}
                    colors={[colors.primaryLight, colors.accent]}
                    style={[
                      styles.waveBar,
                      {
                        height: 18 + value * 92,
                        opacity: isRecording ? 0.95 : 0.35,
                      },
                    ]}
                  />
                ))}
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Feather name="clock" size={15} color={colors.secondary} />
                  <Text style={[styles.metaText, { color: colors.foreground }]}>
                    {formatDuration(duration)}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Feather name="map-pin" size={15} color={colors.secondary} />
                  <Text style={[styles.metaText, { color: colors.foreground }]}>
                    {location ? 'Ubicacion capturada' : 'Sin ubicacion'}
                  </Text>
                </View>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={ZoomIn.delay(240).springify()} style={styles.recArea}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.ring,
              { borderColor: colors.danger },
              ringStyle,
            ]}
          />
          <Animated.View style={pulseStyle}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={isRecording ? stopRecording : recording ? undefined : startRecording}
              disabled={loading || (!!recording && !isRecording)}
              style={[
                styles.recordButton,
                {
                  backgroundColor: isRecording
                    ? colors.danger
                    : recording
                      ? colors.success
                      : colors.primaryLight,
                },
              ]}
            >
              <Feather
                name={isRecording ? 'square' : recording ? 'check' : 'mic'}
                size={34}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </Animated.View>

          <Text style={[styles.recordTitle, { color: colors.foreground }]}>
            {isRecording ? 'Grabando canto' : recording ? 'Grabacion completa' : 'Toca para grabar'}
          </Text>
          <Text style={[styles.recordHint, { color: colors.muted }]}>
            {isRecording
              ? 'Toca el boton para detener'
              : recording
                ? 'Puedes identificar o descartar este audio'
                : 'Mantente cerca del ave y conserva silencio'}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(360).springify()} style={styles.actions}>
          {recording && !isRecording ? (
            <>
              <Button
                title="Descartar"
                variant="outline"
                onPress={resetRecording}
                disabled={loading}
                fullWidth
              />
              <Button
                title={loading ? 'Analizando...' : 'Identificar Ave'}
                loading={loading}
                onPress={handleIdentify}
                disabled={loading}
                fullWidth
              />
            </>
          ) : (
            <GlassCard intensity={45} borderRadius={14}>
              <View style={styles.tipBox}>
                <Feather name="volume-2" size={18} color={colors.accent} />
                <Text style={[styles.tipText, { color: colors.muted }]}>
                  El visualizador reacciona mientras escuchamos el ambiente.
                </Text>
              </View>
            </GlassCard>
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  waveCard: {
    padding: 18,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  instructions: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 22,
  },
  waveform: {
    height: 136,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 20,
  },
  waveBar: {
    width: 7,
    borderRadius: 5,
  },
  metaRow: {
    gap: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '600',
  },
  recArea: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
  },
  ring: {
    position: 'absolute',
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 2,
  },
  recordButton: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 8,
  },
  recordTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 22,
    textAlign: 'center',
  },
  recordHint: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 18,
  },
  actions: {
    gap: 12,
    paddingBottom: 8,
  },
  tipBox: {
    minHeight: 58,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
});
