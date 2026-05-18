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

export const PhotoCaptureScreen = ({ navigation }: any) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const { setLastIdentificationResult, setLoading: setBirdLoading } = useBirdStore();
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
    if (!photo) {
      alert('Por favor captura o selecciona una foto');
      return;
    }

    setLoading(true);
    setBirdLoading(true);

    try {
      // Convert URI to File object
      const uriParts = photo.split('.');
      const fileType = uriParts[uriParts.length - 1];
      const fileName = `photo_${Date.now()}.${fileType}`;

      const file = {
        uri: photo,
        type: `image/${fileType}`,
        name: fileName,
      } as any;

      if (isOnline && location) {
        // Send to backend
        const response = await apiService.identifyBirdFromPhoto(
          file,
          location.coords.latitude,
          location.coords.longitude
        );

        setLastIdentificationResult(response.data);
        navigation.navigate('BirdResult');
      } else if (!isOnline) {
        // Add to offline queue
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
      console.log('Error:', error);
      alert('Error al identificar. Intenta de nuevo.');
    } finally {
      setLoading(false);
      setBirdLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Fotografía de Ave</Text>
      </View>

      {photo ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              📍 Ubicación: {location ? 'Capturada' : 'No disponible'}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setPhoto(null)}
            >
              <Text style={styles.secondaryButtonText}>Cambiar Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleIdentify}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.primaryButtonText}>Identificar Ave 🦅</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.icon}>📸</Text>
          <Text style={styles.emptyText}>Captura o selecciona una foto del ave</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.largeButton} onPress={handleTakePhoto}>
              <Text style={styles.largeButtonText}>Tomar Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.largeButton} onPress={handleSelectFromGallery}>
              <Text style={styles.largeButtonText}>Seleccionar de Galería</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>💡 Consejo</Text>
            <Text style={styles.tipText}>
              - Busca buena iluminación{'\n'}- Captura la cara del ave{'\n'}- Evita sombras
            </Text>
          </View>
        </View>
      )}
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
  previewContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  preview: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#1565c0',
  },
  actions: {
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  largeButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  largeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  tipBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginTop: 32,
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
