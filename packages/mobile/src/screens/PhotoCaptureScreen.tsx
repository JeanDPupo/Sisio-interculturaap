import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  FadeInUp,
  FadeInDown,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useBird, useOffline, useBirdStore } from '@sisio/shared';
import { GlassCard, GradientButton, ScanLine } from '../components';
import { useThemeColor } from '../hooks';

export const PhotoCaptureScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColor();
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const { identifyFromPhoto } = useBird();
  const { addPhotoToQueue } = useOffline();
  const { isOnline } = useOffline();

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
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

  const handleTakePhoto = useCallback(async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      alert('Se necesita permiso de cámara');
      return;
    }
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
        await getLocation();
      }
    } catch (error) {
      alert('Error al capturar foto');
    }
  }, []);

  const handleSelectFromGallery = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
        await getLocation();
      }
    } catch (error) {
      alert('Error al seleccionar foto');
    }
  }, []);

  const handleIdentify = useCallback(async () => {
    if (!photo) return;
    setLoading(true);
    try {
      const file = {
        uri: photo,
        type: 'image/jpeg',
        name: `photo_${Date.now()}.jpg`,
      } as any;

      if (isOnline) {
        const result = await identifyFromPhoto(
          file,
          location?.coords.latitude,
          location?.coords.longitude
        );
        if (result?.bird) {
          navigation.navigate('BirdResult');
        }
      } else {
        addPhotoToQueue(
          photo,
          location?.coords.latitude,
          location?.coords.longitude
        );
        alert('Foto guardada en cola. Se identificará cuando haya conexión.');
        setPhoto(null);
        navigation.goBack();
      }
    } catch (error) {
      alert('Error al identificar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [photo, isOnline, location, identifyFromPhoto, addPhotoToQueue, navigation]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <LinearGradient
        colors={[
          `${colors.secondaryDark}14`,
          `${colors.primaryLight}08`,
          'transparent',
        ]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        entering={FadeInDown.delay(0).springify()}
        style={styles.header}
      >
        <Animated.View
          entering={FadeInUp.delay(50).springify()}
        >
          <Feather
            name="chevron-left"
            size={24}
            color={colors.foreground}
            onPress={() => navigation.goBack()}
          />
        </Animated.View>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Capturar Foto
        </Text>
        <View style={{ width: 24 }} />
      </Animated.View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {photo ? (
          <PreviewSection
            photo={photo}
            location={location}
            loading={loading}
            colors={colors}
            isDark={isDark}
            onChangePhoto={() => setPhoto(null)}
            onIdentify={handleIdentify}
          />
        ) : (
          <CaptureSection
            colors={colors}
            isDark={isDark}
            onTakePhoto={handleTakePhoto}
            onSelectFromGallery={handleSelectFromGallery}
          />
        )}

        <Animated.View entering={FadeInUp.delay(500).springify()}>
          <GlassCard
            intensity={45}
            borderRadius={14}
            gradientColors={[`${colors.accent}10`, `${colors.accent}05`]}
          >
            <View style={styles.tipBox}>
              <Feather name="info" size={18} color={colors.accent} />
              <Text style={[styles.tipText, { color: colors.muted }]}>
                Captura el ave desde un ángulo frontal. Evita fondos oscuros
                o movimientos bruscos para mejores resultados.
              </Text>
            </View>
          </GlassCard>
        </Animated.View>
      </ScrollView>

      {photo && (
        <Animated.View
          entering={FadeInUp.delay(300).springify()}
          style={[styles.identifyBar, { paddingBottom: insets.bottom + 8 }]}
        >
          <GradientButton
            title={loading ? 'Identificando...' : 'Identificar'}
            icon={loading ? undefined : 'search'}
            loading={loading}
            disabled={!photo || loading}
            onPress={handleIdentify}
            borderRadius={16}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

interface PreviewSectionProps {
  photo: string;
  location: Location.LocationObject | null;
  loading: boolean;
  colors: any;
  isDark: boolean;
  onChangePhoto: () => void;
  onIdentify: () => void;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({
  photo,
  location,
  loading,
  colors,
  isDark,
  onChangePhoto,
  onIdentify,
}) => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.1, { duration: 1200 }),
      -1,
      true
    );
  }, [pulse]);

  const cornerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.delay(100).springify()}
      style={styles.previewContainer}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: photo }} style={styles.preview} />

        <View style={styles.scanArea}>
          <ScanLine
            active={true}
            color={colors.primaryLight}
            style={{ width: 260, height: 220 }}
          />

          <Animated.View style={[styles.cornerTL, cornerStyle]} />
          <Animated.View style={[styles.cornerTR, cornerStyle]} />
          <Animated.View style={[styles.cornerBL, cornerStyle]} />
          <Animated.View style={[styles.cornerBR, cornerStyle]} />
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContent}>
              <Animated.Text
                entering={ZoomIn.springify()}
                style={styles.spinBird}
              >
                🐦
              </Animated.Text>
              <Text style={[styles.loadingText, { color: colors.foreground }]}>
                Analizando foto...
              </Text>
              <Text style={[styles.loadingSubtext, { color: colors.muted }]}>
                Identificando ave
              </Text>
            </View>
          </View>
        )}
      </View>

      <Animated.View entering={FadeInUp.delay(200).springify()}>
        <GlassCard
          intensity={50}
          borderRadius={12}
          gradientColors={[`${colors.secondary}10`, `${colors.secondary}05`]}
        >
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={16} color={colors.secondary} />
            <Text style={{ color: colors.muted, fontSize: 13 }}>
              {location ? 'Ubicación capturada' : 'Sin ubicación'}
            </Text>
          </View>
        </GlassCard>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(300).springify()}
        style={styles.actionButtons}
      >
        <GradientButton
          title="Cambiar Foto"
          icon="refresh-cw"
          onPress={onChangePhoto}
          disabled={loading}
          fullWidth
          colors={['transparent', 'transparent']}
          borderRadius={12}
        />
      </Animated.View>
    </Animated.View>
  );
};

interface CaptureSectionProps {
  colors: any;
  isDark: boolean;
  onTakePhoto: () => void;
  onSelectFromGallery: () => void;
}

const CaptureSection: React.FC<CaptureSectionProps> = ({
  colors,
  isDark,
  onTakePhoto,
  onSelectFromGallery,
}) => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.08, { duration: 1500 }),
      -1,
      true
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.delay(100).springify()}
      style={styles.captureContainer}
    >
      <Animated.View
        entering={ZoomIn.delay(150).springify()}
        style={styles.viewfinderWrapper}
      >
        <Animated.View style={[styles.viewfinderPulse, pulseStyle]}>
          <View style={[styles.viewfinder, { borderColor: colors.primaryLight }]}>
            <View style={[styles.cornerInner, styles.cornerTopLeft, { backgroundColor: colors.primaryLight }]} />
            <View style={[styles.cornerInner, styles.cornerTopRight, { backgroundColor: colors.primaryLight }]} />
            <View style={[styles.cornerInner, styles.cornerBottomLeft, { backgroundColor: colors.primaryLight }]} />
            <View style={[styles.cornerInner, styles.cornerBottomRight, { backgroundColor: colors.primaryLight }]} />
          </View>
        </Animated.View>
        <Feather name="camera" size={48} color={colors.primaryLight} style={{ marginTop: 16 }} />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(300).springify()}>
        <Text style={[styles.emptyText, { color: colors.muted }]}>
          Captura o selecciona una foto{'\n'}del ave para identificarla
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(400).springify()}
        style={styles.buttonContainer}
      >
        <TouchableOpacity onPress={onTakePhoto} activeOpacity={0.9}>
          <LinearGradient
            colors={[
              'rgba(45, 80, 22, 0.4)',
              'rgba(74, 124, 47, 0.2)',
            ]}
            style={styles.ctaButton}
          >
            <View style={styles.ctaInner}>
              <View
                style={[
                  styles.ctaIconCircle,
                  { backgroundColor: 'rgba(139, 195, 74, 0.2)' },
                ]}
              >
                <Feather name="camera" size={28} color={colors.primaryLight} />
              </View>
              <Text style={[styles.ctaTitle, { color: colors.foreground }]}>
                Tomar Foto
              </Text>
              <Text style={[styles.ctaSubtitle, { color: colors.muted }]}>
                Usa tu cámara
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={onSelectFromGallery} activeOpacity={0.9}>
          <LinearGradient
            colors={[
              'rgba(212, 160, 23, 0.4)',
              'rgba(245, 200, 66, 0.2)',
            ]}
            style={styles.ctaButton}
          >
            <View style={styles.ctaInner}>
              <View
                style={[
                  styles.ctaIconCircle,
                  { backgroundColor: 'rgba(245, 200, 66, 0.2)' },
                ]}
              >
                <Feather name="image" size={28} color={colors.accent} />
              </View>
              <Text style={[styles.ctaTitle, { color: colors.foreground }]}>
                Galería
              </Text>
              <Text style={[styles.ctaSubtitle, { color: colors.muted }]}>
                Selecciona una foto
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
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
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  captureContainer: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 24,
  },
  viewfinderWrapper: {
    alignItems: 'center',
    marginBottom: 32,
  },
  viewfinderPulse: {
    marginBottom: 16,
  },
  viewfinder: {
    width: 180,
    height: 180,
    borderWidth: 2,
    borderRadius: 16,
    position: 'relative',
  },
  cornerInner: {
    position: 'absolute',
    width: 24,
    height: 4,
    borderRadius: 2,
  },
  cornerTopLeft: {
    top: -2,
    left: -2,
    transform: [{ rotate: '-45deg' }],
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    transform: [{ rotate: '45deg' }],
  },
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    transform: [{ rotate: '45deg' }],
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    transform: [{ rotate: '-45deg' }],
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  ctaButton: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  ctaInner: {
    alignItems: 'center',
    gap: 12,
  },
  ctaIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  ctaSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  previewContainer: {
    paddingHorizontal: 0,
    paddingVertical: 16,
    gap: 12,
  },
  imageWrapper: {
    width: '100%',
    height: 280,
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  scanArea: {
    position: 'absolute',
    top: 30,
    left: 30,
    right: 30,
    bottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 32,
    height: 4,
    backgroundColor: '#8BC34A',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    transform: [{ rotate: '-90deg' }],
    transformOrigin: 'top left',
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 32,
    height: 4,
    backgroundColor: '#8BC34A',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    transform: [{ rotate: '0deg' }],
    transformOrigin: 'top right',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 32,
    height: 4,
    backgroundColor: '#8BC34A',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    transform: [{ rotate: '180deg' }],
    transformOrigin: 'bottom left',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 4,
    backgroundColor: '#8BC34A',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    transform: [{ rotate: '90deg' }],
    transformOrigin: 'bottom right',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(13, 27, 15, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  loadingContent: {
    alignItems: 'center',
    gap: 12,
  },
  spinBird: {
    fontSize: 48,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingSubtext: {
    fontSize: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  actionButtons: {
    width: '100%',
  },
  identifyBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: 'transparent',
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
