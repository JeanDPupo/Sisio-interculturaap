import { useCallback } from 'react';
import { useBirdStore } from '../store/birdStore';
import { useOfflineStore } from '../store/offlineStore';
import { apiService } from '../services/apiService';
import { getProviderManager } from '../services/identification/providerManager';
import type { Bird, BirdIdentificationResult } from '../types';

export const useBird = () => {
  const {
    birds,
    loading,
    error,
    currentBird,
    identificationResult,
    setBirds,
    setLoading,
    setError,
    setCurrentBird,
    setIdentificationResult,
    addBird,
  } = useBirdStore();

  const getBirds = useCallback(
    async (limit: number = 20, offset: number = 0) => {
      setLoading(true);
      try {
        const response = await apiService.getBirds(limit, offset);
        setBirds(response.data);
        return response.data;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Error obteniendo aves';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setBirds]
  );

  const getBirdById = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await apiService.getBirdById(id);
        setCurrentBird(response.data);
        return response.data;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Error obteniendo ave';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setCurrentBird]
  );

  const searchBirds = useCallback(
    async (query: string) => {
      setLoading(true);
      try {
        const response = await apiService.searchBirds(query);
        setBirds(response.data);
        return response.data;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Error buscando aves';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setBirds]
  );

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1] || '');
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const identifyFromPhoto = useCallback(
    async (file: File, latitude?: number, longitude?: number) => {
      setLoading(true);
      try {
        const base64 = await fileToBase64(file);
        const manager = getProviderManager();
        const { result, usedProvider } = await manager.identify({ imageBase64: base64 });

        if (result) {
          setIdentificationResult(result);
          if (result.bird) {
            addBird(result.bird);
          }
          return result;
        }

        const response = await apiService.identifyBirdFromPhoto(file, latitude, longitude);
        const backendResult: BirdIdentificationResult = response.data;
        setIdentificationResult(backendResult);
        if (backendResult.bird) {
          addBird(backendResult.bird);
        }
        return backendResult;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Error identificando ave de foto';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setIdentificationResult, addBird]
  );

  const identifyFromAudio = useCallback(
    async (file: File, latitude?: number, longitude?: number) => {
      setLoading(true);
      try {
        const response = await apiService.identifyBirdFromAudio(file, latitude, longitude);
        const result: BirdIdentificationResult = response.data;
        setIdentificationResult(result);
        if (result.bird) {
          addBird(result.bird);
        }
        return result;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Error identificando ave de audio';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setIdentificationResult, addBird]
  );

  return {
    birds,
    loading,
    error,
    currentBird,
    identificationResult,
    getBirds,
    getBirdById,
    searchBirds,
    identifyFromPhoto,
    identifyFromAudio,
  };
};
