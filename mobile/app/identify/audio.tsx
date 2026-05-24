import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useIdentification } from '@/hooks/useBirds';
import { Button, Ripple, AudioBars } from '@/components/ui';

const { width } = Dimensions.get('window');

export default function AudioIdentifyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColor();
  const { identifyByAudio, isIdentifying, error } = useIdentification();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recordingRef.current) recordingRef.current.stopAndUnloadAsync();
    };
  }, []);

  const startRecording = async () => {
    try {
      if (!permissionResponse?.granted) {
        await requestPermission();
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      recordingRef.current = recording;
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => setRecordingDuration((d) => d + 1), 1000);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    await recordingRef.current.stopAndUnloadAsync();
    const uri = recordingRef.current.getURI();
    setRecordingUri(uri);
    recordingRef.current = null;
  };

  const handleAnalyze = async () => {
    if (!recordingUri) return;
    const result = await identifyByAudio(recordingUri);
    if (result) {
      router.push({ pathname: '/identify/result', params: { result: JSON.stringify(result) } });
    }
  };

  const handleReset = () => {
    setRecordingUri(null);
    setRecordingDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!permissionResponse?.granted) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Feather name="mic-off" size={64} color={colors.muted} />
        <Text style={[styles.permissionText, { color: colors.foreground }]}>Necesitamos acceso al microfono</Text>
        <Text style={[styles.permissionSubtext, { color: colors.muted }]}>Para identificar aves por sonido, necesitamos acceso a tu microfono</Text>
        <Button title="Permitir acceso" onPress={requestPermission} variant="primary" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.card }]}>
          <Feather name="x" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Identificar por Sonido</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Visualizer */}
        <Animated.View entering={FadeIn} style={styles.visualizerContainer}>
          <View style={styles.visualizerCircle}>
            {isRecording && <Ripple isActive={isRecording} color={colors.accent} size={120} />}
            <LinearGradient
              colors={isRecording ? ['rgba(212,160,23,0.3)', 'rgba(245,200,66,0.1)'] : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
              style={styles.visualizerInner}
            >
              <AudioBars isActive={isRecording} barCount={7} color={colors.accent} />
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Timer */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.timerContainer}>
          <Text style={[styles.timer, { color: isRecording ? colors.accent : colors.muted }]}>{formatDuration(recordingDuration)}</Text>
          <Text style={[styles.timerLabel, { color: colors.muted }]}>
            {isRecording ? 'Grabando canto del ave...' : recordingUri ? 'Grabacion lista' : 'Presiona para grabar'}
          </Text>
        </Animated.View>

        {/* Instructions */}
        {!isRecording && !recordingUri && (
          <Animated.View entering={FadeInDown.delay(300)} style={styles.instructions}>
            <View style={styles.instructionItem}>
              <Feather name="volume-2" size={20} color={colors.primaryLight} />
              <Text style={[styles.instructionText, { color: colors.muted }]}>Acercate al ave sin asustarla</Text>
            </View>
            <View style={styles.instructionItem}>
              <Feather name="clock" size={20} color={colors.primaryLight} />
              <Text style={[styles.instructionText, { color: colors.muted }]}>Graba al menos 5 segundos</Text>
            </View>
            <View style={styles.instructionItem}>
              <Feather name="wind" size={20} color={colors.primaryLight} />
              <Text style={[styles.instructionText, { color: colors.muted }]}>Evita ruidos de fondo</Text>
            </View>
          </Animated.View>
        )}
      </View>

      {/* Controls */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + 24 }]}>
        {recordingUri && !isRecording ? (
          <Animated.View entering={FadeInDown} style={styles.recordingControls}>
            <Button title="Grabar de nuevo" onPress={handleReset} variant="outline" icon={<Feather name="refresh-cw" size={18} color={colors.primary} />} />
            <Button
              title={isIdentifying ? 'Analizando...' : 'Identificar'}
              onPress={handleAnalyze}
              variant="primary"
              loading={isIdentifying}
              icon={<Feather name="search" size={18} color="#F0F7EE" />}
            />
          </Animated.View>
        ) : (
          <TouchableOpacity
            onPress={isRecording ? stopRecording : startRecording}
            activeOpacity={0.9}
            style={[styles.recordButton, isRecording && styles.recordButtonActive]}
          >
            <LinearGradient
              colors={isRecording ? ['#EF6C00', '#D32F2F'] : ['#D4A017', '#F5C842']}
              style={styles.recordButtonGradient}
            >
              <Feather name={isRecording ? 'square' : 'mic'} size={32} color="#0D1B0F" />
            </LinearGradient>
          </TouchableOpacity>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { alignItems: 'center', justifyContent: 'center', padding: 32 },
  permissionText: { fontSize: 20, fontWeight: '700', marginTop: 16, textAlign: 'center' },
  permissionSubtext: { fontSize: 14, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12 },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '600' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  visualizerContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  visualizerCircle: { width: 200, height: 200, alignItems: 'center', justifyContent: 'center' },
  visualizerInner: { width: 160, height: 160, borderRadius: 80, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)' },
  timerContainer: { alignItems: 'center', marginBottom: 32 },
  timer: { fontSize: 48, fontWeight: '300', fontVariant: ['tabular-nums'] },
  timerLabel: { fontSize: 14, marginTop: 8 },
  instructions: { gap: 16 },
  instructionItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  instructionText: { fontSize: 14 },
  controls: { paddingHorizontal: 24, alignItems: 'center' },
  recordButton: { width: 80, height: 80, borderRadius: 40 },
  recordButtonActive: { transform: [{ scale: 1.1 }] },
  recordButtonGradient: { width: '100%', height: '100%', borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  recordingControls: { flexDirection: 'row', gap: 12, width: '100%' },
  errorText: { color: '#EF6C00', fontSize: 14, textAlign: 'center', marginTop: 12 },
});
