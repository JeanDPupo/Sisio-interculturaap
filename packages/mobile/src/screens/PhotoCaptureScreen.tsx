import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import Animated, {
  FadeInUp,
  FadeInDown,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useBirdStore, useOfflineStore, apiService } from '@sisio/shared';
import { Button, GlassCard, Header } from '../components';
import { useThemeColor } from '../hooks';

export const PhotoCaptureScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColor();
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const { setIdentificationResult, setLoading: setBirdLoading } = useBirdStore();
  const { isOnline } = useOfflineStore();
  const { addToQueue } = useOfflineStore();

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

  const handleTakePhoto = async () => {
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
  };

  const handleSelectFromGallery = async () => {
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
  };

  const handleIdentify = async () => {
    if (!photo) return;
    setLoading(true);
    setBirdLoading(true);
    try {
      const uriParts = photo.split('.');
      const fileType = uriParts[uriParts.length - 1];
      const file = {
        uri: photo,
        type: `image/${fileType}`,
        name: `photo_${Date.now()}.${fileType}`,
      } as any;
      if (isOnline && location) {
        const response = await apiService.identifyBirdFromPhoto(
          file,
          location.coords.latitude,
          location.coords.longitude
        );
        setIdentificationResult(response.data);
        navigation.navigate('BirdResult');
      } else if (!isOnline) {
        addToQueue({
          id: `photo_${Date.now()}`,
          action: 'identify_photo',
          data: {
            photo,
            latitude: location?.coords.latitude,
            longitude: location?.coords.longitude,
          },
          timestamp: new Date().toISOString(),
          retries: 0,
        });
        alert('Foto guardada en cola. Se identificará cuando haya conexión.');
        setPhoto(null);
        navigation.goBack();
      }
    } catch (error) {
      alert('Error al identificar. Intenta de nuevo.');
    } finally {
      setLoading(false);
      setBirdLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <Header
        title="Capturar Foto"
        leftIcon={<Feather name="chevron-left" size={24} color={colors.foreground} />}
        onLeftPress={() => navigation.goBack()}
      />

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
  return (
    <Animated.View
      entering={FadeInUp.delay(100).springify()}
      style={styles.previewContainer}
    >
      {/* Image Preview */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: photo }} style={styles.preview} />

        {loading && (
          <BlurView intensity={80} style={styles.loadingOverlay}>
            <View style={styles.loadingContent}>
              <View style={styles.spinner}>
                <Feather name="loader" size={32} color={colors.accent} />
              </View>
              <Text style={[styles.loadingText, { color: colors.foreground }]}>
                Analizando foto...
              </Text>
              <Text style={[styles.loadingSubtext, { color: colors.muted }]}>
                Identificando ave
              </Text>
            </View>
          </BlurView>
        )}
      </View>

      {/* Location Badge */}
      <Animated.View entering={FadeInUp.delay(200).springify()}>
        <GlassCard
          intensity={50}
          borderRadius={12}
          gradientColors={[
            `${colors.secondary}10`,
            `${colors.secondary}05`,
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 }}>
            <Feather name="map-pin" size={16} color={colors.secondary} />
            <Text style={{ color: colors.muted, fontSize: 13 }}>
              {location ? 'Ubicación capturada' : 'Sin ubicación'}
            </Text>
          </View>
        </GlassCard>
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View
        entering={FadeInUp.delay(300).springify()}
        style={styles.actionButtons}
      >
        <Button
          title="Cambiar Foto"
          variant="outline"
          onPress={onChangePhoto}
          disabled={loading}
          fullWidth
        />
        <Button
          title={loading ? 'Analizando...' : 'Identificar Ave'}
          loading={loading}
          onPress={onIdentify}
          disabled={loading}
          fullWidth
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
  return (
    <Animated.View
      entering={FadeInUp.delay(100).springify()}
      style={[styles.captureContainer, { justifyContent: 'center' }]}
    >
      {/* Animated Viewfinder */}
      <ViewfinderAnimated colors={colors} />

      {/* Description */}
      <Animated.View entering={FadeInUp.delay(300).springify()}>
        <Text
          style={[
            styles.emptyText,
            { color: colors.muted },
          ]}
        >
          Captura o selecciona una foto{'\n'}del ave para identificarla
        </Text>
      </Animated.View>

      {/* CTA Buttons */}
      <Animated.View
        entering={FadeInUp.delay(400).springify()}
        style={styles.buttonContainer}
      >
        <TouchableOpacity
          onPress={onTakePhoto}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[
              'rgba(45, 80, 22, 0.4)',
              'rgba(74, 124, 47, 0.2)',
            ]}
            style={styles.ctaButton}
          >
            <View
              style={{
                alignItems: 'center',
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: 'rgba(139, 195, 74, 0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Feather name="camera" size={28} color={colors.primaryLight} />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: colors.foreground,
                }}
              >
                Tomar Foto
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.muted,
                  textAlign: 'center',
                }}
              >
                Usa tu cámara
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSelectFromGallery}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[
              'rgba(212, 160, 23, 0.4)',
              'rgba(245, 200, 66, 0.2)',
            ]}
            style={styles.ctaButton}
          >
            <View
              style={{
                alignItems: 'center',
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: 'rgba(245, 200, 66, 0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Feather name="image" size={28} color={colors.accent} />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: colors.foreground,
                }}
              >
                Galería
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.muted,
                  textAlign: 'center',
                }}
              >
                Selecciona una foto
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

// Viewfinder with animation
const ViewfinderAnimated: React.FC<{ colors: any }> = ({ colors }) => {
  const pulse = useSharedValue(1);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.1, { duration: 1500 }),
      -1,
      true
    );
    opacity.value = withRepeat(
      withTiming(0.8, { duration: 1500 }),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View entering={ZoomIn.delay(150).springify()} style={styles.viewfinderWrapper}>
      <Animated.View style={[styles.viewfinderPulse, pulseStyle]}>
        <View style={[styles.viewfinder, { borderColor: colors.primaryLight }]}>
          {/* Corner indicators */}
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.corner,
                { borderColor: colors.primaryLight },
                i === 0 && styles.cornerTopLeft,
                i === 1 && styles.cornerTopRight,
                i === 2 && styles.cornerBottomLeft,
                i === 3 && styles.cornerBottomRight,
              ]}
            />
          ))}
        </View>
      </Animated.View>
      <Feather name="camera" size={48} color={colors.primaryLight} style={{ marginTop: 16 }} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  captureContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  previewContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  imageWrapper: {
    flex: 1,
    position: 'relative',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    gap: 12,
  },
  spinner: {
    opacity: 0.8,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingSubtext: {
    fontSize: 12,
  },
  actionButtons: {
    width: '100%',
    gap: 12,
    marginBottom: 16,
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
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderWidth: 2,
  },
  cornerTopLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
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
});
