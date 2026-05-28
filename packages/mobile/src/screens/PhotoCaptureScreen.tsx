import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useBirdStore, useOfflineStore, apiService } from '@sisio/shared';
import { theme } from '../theme';

export const PhotoCaptureScreen = ({ navigation }: any) => {
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Fotografía</Text>
        <View style={styles.backBtn} />
      </View>
      {photo ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <View style={styles.locationBadge}>
            <Text style={styles.locationText}>
              📍 {location ? 'Ubicación capturada' : 'Sin ubicación'}
            </Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setPhoto(null)}>
              <Text style={styles.secondaryButtonText}>Cambiar Foto</Text>
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
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.viewfinder}>
            <Text style={styles.viewfinderIcon}>📸</Text>
          </View>
          <Text style={styles.emptyText}>
            Captura o selecciona una foto del ave para identificarla
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.largeButton} onPress={handleTakePhoto}>
              <Text style={styles.largeButtonIcon}>📷</Text>
              <Text style={styles.largeButtonText}>Tomar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.largeButton, styles.galleryButton]}
              onPress={handleSelectFromGallery}
            >
              <Text style={styles.largeButtonIcon}>🖼️</Text>
              <Text style={styles.largeButtonText}>Galería</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    textAlign: 'center',
  },
  previewContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  preview: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: 12,
  },
  locationBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  locationText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  actions: {
    gap: 10,
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
  secondaryButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: { opacity: 0.5 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  viewfinder: {
    width: 160,
    height: 160,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    opacity: 0.6,
  },
  viewfinderIcon: { fontSize: 48 },
  emptyText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  largeButton: {
    backgroundColor: 'rgba(45, 80, 22, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  galleryButton: {
    backgroundColor: 'rgba(212, 160, 23, 0.1)',
    borderColor: 'rgba(212, 160, 23, 0.3)',
  },
  largeButtonIcon: { fontSize: 22 },
  largeButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
