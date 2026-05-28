import { useCallback, useEffect } from 'react';
import { useOfflineStore } from '../store/offlineStore';
import { apiService } from '../services/apiService';
function dataUrlToFile(dataUrl, filename) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}
export const useOffline = () => {
    const { isOnline, queue, syncError, isSyncing, setOnlineStatus, addToQueue, removeFromQueue, clearQueue, setIsSyncing, setSyncError, incrementRetry, } = useOfflineStore();
    useEffect(() => {
        const handleOnline = () => setOnlineStatus(true);
        const handleOffline = () => setOnlineStatus(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        setOnlineStatus(navigator.onLine);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [setOnlineStatus]);
    const processQueue = useCallback(async () => {
        if (!navigator.onLine || queue.length === 0)
            return;
        setIsSyncing(true);
        setSyncError(null);
        let processed = 0;
        for (const item of queue) {
            try {
                if (item.action === 'identify_photo') {
                    const file = dataUrlToFile(item.data.dataUrl, 'offline-photo.jpg');
                    await apiService.identifyBirdFromPhoto(file, item.data.latitude, item.data.longitude);
                }
                else if (item.action === 'identify_audio') {
                    const file = dataUrlToFile(item.data.dataUrl, 'offline-audio.webm');
                    await apiService.identifyBirdFromAudio(file, item.data.latitude, item.data.longitude);
                }
                else if (item.action === 'create_sighting') {
                    await apiService.createSighting(item.data);
                }
                else if (item.action === 'create_comment') {
                    const { sightingId, text } = item.data;
                    await apiService.createComment(sightingId, text);
                }
                removeFromQueue(item.id);
                processed++;
            }
            catch (err) {
                console.error(`[OfflineSync] Error processing ${item.id}:`, err);
                incrementRetry(item.id);
                if (item.retries >= 3) {
                    removeFromQueue(item.id);
                }
            }
        }
        setIsSyncing(false);
        return processed;
    }, [queue, setIsSyncing, setSyncError, removeFromQueue, incrementRetry]);
    useEffect(() => {
        if (navigator.onLine && queue.length > 0) {
            processQueue();
        }
    }, [navigator.onLine, queue.length, processQueue]);
    const addPhotoToQueue = useCallback((dataUrl, latitude, longitude) => {
        const item = {
            id: crypto.randomUUID(),
            action: 'identify_photo',
            data: { dataUrl, latitude, longitude },
            timestamp: new Date().toISOString(),
            retries: 0,
        };
        addToQueue(item);
    }, [addToQueue]);
    const addAudioToQueue = useCallback((dataUrl, latitude, longitude) => {
        const item = {
            id: crypto.randomUUID(),
            action: 'identify_audio',
            data: { dataUrl, latitude, longitude },
            timestamp: new Date().toISOString(),
            retries: 0,
        };
        addToQueue(item);
    }, [addToQueue]);
    return {
        isOnline,
        queue,
        isSyncing,
        syncError,
        queueLength: queue.length,
        addToQueue,
        addPhotoToQueue,
        addAudioToQueue,
        processQueue,
        clearQueue,
    };
};
//# sourceMappingURL=useOffline.js.map