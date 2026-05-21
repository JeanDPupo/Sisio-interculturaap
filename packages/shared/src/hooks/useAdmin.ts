import { useCallback, useState } from 'react';
import { apiService } from '../services/apiService';
import { AdminStats, ModerationQueue } from '../types';

export const useAdmin = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [moderation, setModeration] = useState<ModerationQueue | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getAdminStats();
      setStats(response.data as AdminStats);
      return response.data as AdminStats;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Error obteniendo estadísticas';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getModerationQueue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getFlaggedContent();
      setModeration(response.data as ModerationQueue);
      return response.data as ModerationQueue;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Error obteniendo cola de moderación';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const moderateSighting = useCallback(async (sightingId: string, action: 'approve' | 'reject') => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.moderateSighting(sightingId, action);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Error moderando sighting';
      setError(message);
      throw err;
    } finally {
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
