import { useCallback, useEffect } from 'react';
import { useOfflineStore } from '../store/offlineStore';

export const useOffline = () => {
  const {
    isOnline,
    queuedRequests,
    lastSyncTime,
    setOnline,
    setOffline,
    queueRequest,
    clearQueue,
    setLastSyncTime,
    syncQueue,
  } = useOfflineStore();

  // Detect online/offline status
  useEffect(() => {
    const handleOnline = () => setOnline();
    const handleOffline = () => setOffline();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial state
    if (!navigator.onLine) {
      setOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline, setOffline]);

  const addQueuedRequest = useCallback(
    (request: {
      method: string;
      endpoint: string;
      data?: any;
      id?: string;
    }) => {
      queueRequest({
        ...request,
        id: request.id || crypto.randomUUID(),
        timestamp: Date.now(),
      });
    },
    [queueRequest]
  );

  const clearOfflineQueue = useCallback(() => {
    clearQueue();
  }, [clearQueue]);

  const sync = useCallback(async () => {
    if (!isOnline) return;

    try {
      await syncQueue();
      setLastSyncTime(Date.now());
    } catch (error) {
      console.error('Error syncing queue:', error);
    }
  }, [isOnline, syncQueue, setLastSyncTime]);

  return {
    isOnline,
    queuedRequests,
    lastSyncTime,
    addQueuedRequest,
    clearOfflineQueue,
    sync,
  };
};
