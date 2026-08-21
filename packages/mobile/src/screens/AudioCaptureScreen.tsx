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
  withDelay,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBird, useOffline } from '@sisio/shared';
import { GlassCard, GradientButton, AudioBars } from '../components';
import { useThemeColor } from '../hooks';

export const AudioCaptureScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColor();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const durationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const { identifyFromAudio } = useBird();
  const { addAudioToQueue } = useOffline();
  const { isOnline } = useOffline();

  const ring1 = useSharedValue(0);
  const ring2 = useSharedValue(0);
  const ring3 = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (isRecording) {
      pulse.value = withRepeat(withTiming(1.08, { duration: 620 }), -1, true);

      ring1.value = withRepeat(
        withTiming(1, { duration: 1800 }),
        -1,
        false
      );
      ring2.value = withRepeat(
        withDelay(600, withTiming(1, { duration: 1800 })),
        -1,
        false
      );
      ring3.value = withRepeat(
        withDelay(1200, withTiming(1, { duration: 1800 })),
        -1,
        false
      );
    } else {
      pulse.value = withTiming(1, { duration: 200 });
      ring1.value = withTiming(0, { duration: 200 });
      ring2.value = withTiming(0, { duration: 200 });
      ring3.value = withTiming(0, { duration: 200 });
    }
  }, [isRecording, pulse, ring1, ring2, ring3]);

  useEffect(() => {
    return () => {
      if (durationInterval.current) clearInterval(durationInterval.current);
    };
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const ring1Style = useAnimatedStyle(() => ({
    opacity: isRecording ? 0.8 - ring1.value * 0.8 : 0,
    transform: [{ scale: 1 + ring1.value * 2 }],
  }));

  const ring2Style = useAnimatedStyle(() => ({
    opacity: isRecording ? 0.6 - ring2.value * 0.6 : 0,
    transform: [{ scale: 1 + ring2.value * 2 }],
  }));

  const ring3Style = useAnimatedStyle(() => ({
    opacity: isRecording ? 0.4 - ring3.value * 0.4 : 0,
    transform: [{ scale: 1 + ring3.value * 2 }],
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
    } catch {
      alert('Error al iniciar grabación');
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
      alert('Error al detener grabación');
    }
  };

  const resetRecording = () => {
    setRecording(null);
    setDuration(0);
    setIsRecording(false);
  };

  const handleIdentify = async () => {
    if (!recording) return;
    setLoading(true);
    try {
      const uri = recording.getURI();
      if (!uri) return;
      const file = {
        uri,
        type: 'audio/wav',
        name: `audio_${Date.now()}.wav`,
      } as any;

      if (isOnline) {
        const result = await identifyFromAudio(
          file,
          location?.coords.latitude,
          location?.coords.longitude
        );
        if (result?.bird) {
          navigation.navigate('BirdResult');
        }
      } else {
        addAudioToQueue(
          uri,
          location?.coords.latitude,
          location?.coords.longitude
        );
        alert('Audio guardado en cola. Se identificará cuando haya conexión.');
        resetRecording();
        navigation.goBack();
      }
    } catch {
      alert('Error al identificar.');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const statusLabel = isRecording
    ? 'Grabando...'
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
        colors={[`${colors.secondaryDark}14`, `${colors.primaryLight}08`, 'transparent']}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        entering={FadeInDown.delay(0).springify()}
        style={styles.header}
      >
        <Feather
          name="chevron-left"
          size={24}
          color={colors.foreground}
          onPress={() => navigation.goBack()}
        />
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Sonido del Ave
        </Text>
        <View style={{ width: 24 }} />
      </Animated.View>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Text style={[styles.kicker, { color: colors.accent }]}>
            IDENTIFICACIÓN POR CANTO
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).springify()}>
          <AudioBars
            isRecording={isRecording}
            barCount={20}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(250).springify()}>
          <Text style={[styles.timerText, { color: colors.foreground }]}>
            {formatDuration(duration)}
          </Text>
        </Animated.View>

        <Animated.View
          entering={ZoomIn.delay(300).springify()}
          style={styles.recArea}
        >
          <Animated.View
            pointerEvents="none"
            style={[styles.ring, { borderColor: colors.danger }, ring1Style]}
          />
          <Animated.View
            pointerEvents="none"
            style={[styles.ring, { borderColor: colors.danger }, ring2Style]}
          />
          <Animated.View
            pointerEvents="none"
            style={[styles.ring, { borderColor: colors.danger }, ring3Style]}
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
                      : colors.accent,
                },
              ]}
            >
              <LinearGradient
                colors={
                  isRecording
                    ? ['#F44336', '#D32F2F']
                    : recording
                      ? ['#4CAF50', '#388E3C']
                      : ['#D4A017', '#F5C842']
                }
                style={styles.recordButtonGradient}
              >
                <Feather
                  name={isRecording ? 'square' : recording ? 'check' : 'mic'}
                  size={34}
                  color="#FFFFFF"
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Text style={[styles.recordTitle, { color: colors.foreground }]}>
            {isRecording ? 'Grabando canto' : recording ? 'Grabación completa' : 'Toca para grabar'}
          </Text>
          <Text style={[styles.recordHint, { color: colors.muted }]}>
            {isRecording
              ? 'Toca el botón para detener'
              : recording
                ? 'Puedes identificar o descartar este audio'
                : 'Mantente cerca del ave y conserva silencio'}
          </Text>
        </Animated.View>

        {recording && !isRecording && (
          <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.actions}>
            <GradientButton
              title="Descartar"
              icon="trash-2"
              onPress={resetRecording}
              disabled={loading}
              fullWidth
              colors={['rgba(244, 67, 54, 0.6)', 'rgba(244, 67, 54, 0.4)']}
              borderRadius={16}
            />
            <GradientButton
              title={loading ? 'Analizando...' : 'Identificar'}
              icon={loading ? undefined : 'search'}
              loading={loading}
              disabled={loading}
              onPress={handleIdentify}
              fullWidth
              borderRadius={16}
            />
          </Animated.View>
        )}

        {!recording && !isRecording && (
          <Animated.View entering={FadeInUp.delay(500).springify()}>
            <GlassCard intensity={45} borderRadius={14}>
              <View style={styles.tipBox}>
                <Feather name="volume-2" size={18} color={colors.accent} />
                <Text style={[styles.tipText, { color: colors.muted }]}>
                  El visualizador reacciona mientras escuchamos el ambiente.
                </Text>
              </View>
            </GlassCard>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  kicker: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 42,
    fontWeight: '200',
    fontFamily: 'JetBrainsMono_400Regular',
    textAlign: 'center',
    marginVertical: 12,
    letterSpacing: 4,
  },
  recArea: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  recordButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
});
