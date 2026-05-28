import { useCallback, useState } from 'react';
import { apiService } from '../services/apiService';
export const useAdmin = () => {
    const [stats, setStats] = useState(null);
    const [moderation, setModeration] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const getStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getAdminStats();
            setStats(response.data);
            return response.data;
        }
        catch (err) {
            const message = err.response?.data?.detail || 'Error obteniendo estadísticas';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, []);
    const getModerationQueue = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getFlaggedContent();
            setModeration(response.data);
            return response.data;
        }
        catch (err) {
            const message = err.response?.data?.detail || 'Error obteniendo cola de moderación';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, []);
    const moderateSighting = useCallback(async (sightingId, action) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.moderateSighting(sightingId, action);
            return response.data;
        }
        catch (err) {
            const message = err.response?.data?.detail || 'Error moderando sighting';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, []);
    return {
        stats,
        moderation,
        loading,
        error,
        getStats,
        getModerationQueue,
        moderateSighting,
    };
};
//# sourceMappingURL=useAdmin.js.map