import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useIdentification } from '@/hooks/useBirds';
import { Button, ScanLine } from '@/components/ui';

const { width, height } = Dimensions.get('window');

export default function PhotoIdentifyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColor();
  const { identifyByPhoto, isIdentifying, error } = useIdentification();
  
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo) {
        setCapturedImage(photo.uri);
      }
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    setIsAnalyzing(true);
    const result = await identifyByPhoto(capturedImage);
    setIsAnalyzing(false);
    if (result) {
      router.push({ pathname: '/identify/result', params: { result: JSON.stringify(result) } });
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  if (!permission) {
    return <View style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Feather name="camera-off" size={64} color={colors.muted} />
        <Text style={[styles.permissionText, { color: colors.foreground }]}>Necesitamos acceso a la camara</Text>
        <Text style={[styles.permissionSubtext, { color: colors.muted }]}>
          Para identificar aves por foto, necesitamos acceso a tu camara
        </Text>
        <Button title="Permitir acceso" onPress={requestPermission} variant="primary" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="x" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Identificar por Foto</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Camera or Preview */}
      <View style={styles.cameraContainer}>
        {capturedImage ? (
          <Animated.View entering={FadeIn} style={styles.previewContainer}>
            <Image source={{ uri: capturedImage }} style={styles.previewImage} />
            {isAnalyzing && (
              <>
                <View style={styles.scanOverlay} />
                <ScanLine isActive={isAnalyzing} height={height * 0.6} />
                <View style={styles.analyzingBadge}>
                  <Text style={styles.analyzingText}>Analizando imagen...</Text>
                </View>
              </>
            )}
          </Animated.View>
        ) : (
          <CameraView ref={cameraRef} style={styles.camera} facing="back">
            {/* Viewfinder corners */}
            <View style={styles.viewfinder}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <Text style={styles.viewfinderText}>Centra el ave en el marco</Text>
          </CameraView>
        )}
      </View>

      {/* Controls */}
      <LinearGradient colors={['transparent', 'rgba(13,27,15,0.95)']} style={[styles.controls, { paddingBottom: insets.bottom + 16 }]}>
        {capturedImage ? (
          <Animated.View entering={FadeInDown} style={styles.previewControls}>
            <Button title="Volver a tomar" onPress={handleRetake} variant="outline" icon={<Feather name="refresh-cw" size={18} color={colors.primary} />} />
            <Button
              title={isAnalyzing ? 'Analizando...' : 'Identificar'}
              onPress={handleAnalyze}
              variant="primary"
              loading={isAnalyzing}
              icon={<Feather name="search" size={18} color="#F0F7EE" />}
            />
          </Animated.View>
        ) : (
          <View style={styles.captureControls}>
            <TouchableOpacity onPress={handlePickImage} style={[styles.sideButton, { backgroundColor: colors.card }]}>
              <Feather name="image" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCapture} style={styles.captureButton}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            <View style={{ width: 56 }} />
          </View>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { alignItems: 'center', justifyContent: 'center', padding: 32 },
  permissionText: { fontSize: 20, fontWeight: '700', marginTop: 16, textAlign: 'center' },
  permissionSubtext: { fontSize: 14, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  cameraContainer: { flex: 1 },
  camera: { flex: 1 },
  previewContainer: { flex: 1 },
  previewImage: { flex: 1, resizeMode: 'cover' },
  scanOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(139,195,74,0.1)' },
  analyzingBadge: { position: 'absolute', top: '50%', left: 0, right: 0, alignItems: 'center' },
  analyzingText: { backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, color: '#8BC34A', fontWeight: '600' },
  viewfinder: { flex: 1, margin: 40, position: 'relative' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: '#8BC34A', borderWidth: 3 },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 8 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 8 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 8 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 8 },
  viewfinderText: { position: 'absolute', bottom: -30, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  controls: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingTop: 40 },
  captureControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sideButton: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  captureButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  captureButtonInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff' },
  previewControls: { flexDirection: 'row', gap: 12 },
  errorText: { color: '#EF6C00', fontSize: 14, textAlign: 'center', marginTop: 12 },
});
