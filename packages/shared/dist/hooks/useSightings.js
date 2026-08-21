import { useCallback } from 'react';
import { useSightingStore } from '../store/sightingStore';
import { apiService } from '../services/apiService';
export const useSightings = () => {
    const { sightings, loading, error, setSightings, setLoading, setError, addSighting, removeSighting, } = useSightingStore();
    const getSightings = useCallback(async (userId, limit = 50, offset = 0) => {
        setLoading(true);
        try {
            const response = await apiService.getSightings(userId, limit, offset);
            const data = Array.isArray(response.data) ? response.data : response.data.sightings || [];
            setSightings(data);
            return data;
        }
        catch (err) {
            const message = err.response?.data?.detail || 'Error obteniendo avistamientos';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setSightings]);
    const getSightingById = useCallback(async (id) => {
        setLoading(true);
        try {
            const response = await apiService.getSightingById(id);
            return response.data;
        }
        catch (err) {
            const message = err.response?.data?.detail || 'Error obteniendo avistamiento';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, setCurrentSighting]);
    const getSightingsForMap = useCallback(async (bounds) => {
        setLoading(true);
        try {
            const response = await apiService.getSightingsForMap(bounds);
            const data = Array.isArray(response.data) ? response.data : response.data.sightings || [];
            return data;
        }
        catch (err) {
            const message = err.response?.data?.detail || 'Error obteniendo avistamientos para mapa';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError]);
    const createSighting = useCallback(async (sightingData) => {
        setLoading(true);
        try {
            const response = await apiService.createSighting(sightingData);
            addSighting(response.data);
            return response.data;
        }
        catch (err) {
            const message = err.response?.data?.detail || 'Error creando avistamiento';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, addSighting]);
    const updateSighting = useCallback(async (id, updates) => {
        setLoading(true);
        try {
            const response = await apiService.updateSighting(id, updates);
            return response.data;
        }
        catch (err) {
            const message = err.response?.data?.detail || 'Error actualizando avistamiento';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, updateSightingInStore]);
    const deleteSighting = useCallback(async (id) => {
        setLoading(true);
        try {
            await apiService.deleteSighting(id);
            removeSighting(id);
        }
        catch (err) {
            const message = err.response?.data?.detail || 'Error eliminando avistamiento';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setError, removeSighting]);
    const getComments = useCallback(async (sightingId) => {
        try {
            const response = await apiService.getComments(sightingId);
            return Array.isArray(response.data) ? response.data : response.data.comments || [];
        }
        catch (err) {
            const message = err.response?.data?.detail || 'Error obteniendo comentarios';
            setError(message);
            throw err;
        }
    }, [setError]);
    const createComment = useCallback(async (sightingId, text) => {
        try {
            const response = await apiService.createComment(sightingId, text);
            return response.data;
        }
        catch (err) {
            const message = err.response?.data?.detail || 'Error creando comentario';
            setError(message);
            throw err;
        }
    }, [setError]);
    const deleteComment = useCallback(async (sightingId, commentId) => {
        try {
            await apiService.deleteComment(sightingId, commentId);
        }
        catch (err) {
            const message = err.response?.data?.detail || 'Error eliminando comentario';
            setError(message);
            throw err;
        }
    }, [setError]);
    return {
        sightings,
        loading,
        error,
        getSightings,
        getSightingById,
        getSightingsForMap,
        createSighting,
        updateSighting,
        deleteSighting,
        getComments,
        createComment,
        deleteComment,
    };
};
//# sourceMappingURL=useSightings.js.map