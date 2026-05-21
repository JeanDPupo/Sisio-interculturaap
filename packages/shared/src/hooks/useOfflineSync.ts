import { useEffect, useCallback } from 'react';
import { useOffline } from './useOffline';

interface QueuedRequest {
  id: string;
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  timestamp: number;
  retries: number;
}

const DB_NAME = 'sisio-offline';
const QUEUE_STORE = 'request-queue';

export const useOfflineSync = () => {
  const { isOnline } = useOffline();

  const initDB = useCallback(async (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(QUEUE_STORE)) {
          db.createObjectStore(QUEUE_STORE, { keyPath: 'id' });
        }
      };
    });
  }, []);

  const addToQueue = useCallback(
    async (method: string, url: string, data?: any): Promise<string> => {
      const db = await initDB();
      const id = `${Date.now()}-${Math.random()}`;
      const request: QueuedRequest = {
        id,
        method: method as any,
        url,
        data,
        timestamp: Date.now(),
        retries: 0,
      };

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([QUEUE_STORE], 'readwrite');
        const store = transaction.objectStore(QUEUE_STORE);
        const req = store.add(request);

        req.onsuccess = () => resolve(id);
        req.onerror = () => reject(req.error);
      });
    },
    [initDB]
  );

  const getQueuedRequests = useCallback(async (): Promise<QueuedRequest[]> => {
    try {
      const db = await initDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([QUEUE_STORE], 'readonly');
        const store = transaction.objectStore(QUEUE_STORE);
        const req = store.getAll();

        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch (error) {
      console.error('Error getting queued requests:', error);
      return [];
    }
  }, [initDB]);

  const removeFromQueue = useCallback(async (id: string): Promise<void> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([QUEUE_STORE], 'readwrite');
      const store = transaction.objectStore(QUEUE_STORE);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }, [initDB]);

  const processQueue = useCallback(async (apiService: any) => {
    if (!isOnline) return;

    const requests = await getQueuedRequests();
    let processed = 0;

    for (const request of requests) {
      try {
        const config: any = {};
        if (request.data) {
          config.data = request.data;
        }

        await apiService.instance({
          method: request.method.toLowerCase(),
          url: request.url,
          ...config,
        });

        await removeFromQueue(request.id);
        processed++;
      } catch (error) {
        console.error('Error processing queued request:', error);
        request.retries++;

        if (request.retries > 3) {
          await removeFromQueue(request.id);
        } else {
          const db = await initDB();
          const transaction = db.transaction([QUEUE_STORE], 'readwrite');
          const store = transaction.objectStore(QUEUE_STORE);
          store.put(request);
        }
      }
    }

    return processed;
  }, [isOnline, getQueuedRequests, removeFromQueue, initDB]);

  useEffect(() => {
    if (isOnline) {
      console.log('[Offline Sync] App is online, attempting to sync queued requests');
    }
  }, [isOnline]);

  return {
    addToQueue,
    getQueuedRequests,
    removeFromQueue,
    processQueue,
  };
};
