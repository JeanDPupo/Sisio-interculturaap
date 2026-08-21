import { useCallback } from 'react';
import { useBirdStore } from '../store/birdStore';
import { apiService } from '../services/apiService';
import { getProviderManager } from '../services/identification/providerManager';
export const useBird = () => {
    const { birds, loading, error, currentBird, identificationResult, setBirds, setLoading, setError, setCurrentBird, setIdentificationResult, addBird, } = useBirdStore();
    const getBirds = useCallback(async (limit = 20, offset = 0) => {
        setLoading(true);
        try {
            const response = await apiService.getBirds(limit, offset);
            setBirds(response.data);
            return response.data;
        }
        catch (err) {
            const message = err.response?.data?.detail || 'Error obteniendo aves';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setBirds]);
    const getBirdById = useCallback(async (id) => {
        setLoading(true);
        try {
            const response = await apiService.getBirdById(id);
            setCurrentBird(response.data);
            return response.data;
        }
        catch (err) {
            const message = err.response?.data?.detail || 'Error obteniendo ave';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setCurrentBird]);
    const searchBirds = useCallback(async (query) => {
        setLoading(true);
        try {
            const response = await apiService.searchBirds(query);
            setBirds(response.data);
            return response.data;
        }
        catch (err) {
            const message = err.response?.data?.detail || 'Error buscando aves';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setBirds]);
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result;
                resolve(result.split(',')[1] || '');
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    const identifyFromPhoto = useCallback(async (file, latitude, longitude) => {
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
            const backendResult = response.data;
            setIdentificationResult(backendResult);
            if (backendResult.bird) {
                addBird(backendResult.bird);
            }
            return backendResult;
        }
        catch (err) {
            const message = err.response?.data?.detail || 'Error identificando ave de foto';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setIdentificationResult, addBird]);
    const identifyFromAudio = useCallback(async (file, latitude, longitude) => {
        setLoading(true);
        try {
            const response = await apiService.identifyBirdFromAudio(file, latitude, longitude);
            const result = response.data;
            setIdentificationResult(result);
            if (result.bird) {
                addBird(result.bird);
            }
            return result;
        }
        catch (err) {
            const message = err.response?.data?.detail || 'Error identificando ave de audio';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setIdentificationResult, addBird]);
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
//# sourceMappingURL=useBird.js.map