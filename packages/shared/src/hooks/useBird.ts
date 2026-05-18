import { useCallback } from 'react';
import { useBirdStore } from '../store/birdStore';
import { apiService } from '../services/apiService';
import { Bird, BirdIdentificationResult } from '../types';

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

  const identifyFromPhoto = useCallback(
    async (file: File, latitude?: number, longitude?: number) => {
      setLoading(true);
      try {
        const response = await apiService.identifyBirdFromPhoto(file, latitude, longitude);
        const result: BirdIdentificationResult = response.data;
        setIdentificationResult(result);
        if (result.bird) {
          addBird(result.bird);
        }
        return result;
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
