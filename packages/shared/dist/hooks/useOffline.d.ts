import { OfflineQueueItem } from '../store/offlineStore';
export declare const useOffline: () => {
    isOnline: boolean;
    queue: OfflineQueueItem[];
    isSyncing: boolean;
    syncError: string | null;
    queueLength: number;
    addToQueue: (item: OfflineQueueItem) => void;
    addPhotoToQueue: (dataUrl: string, latitude?: number, longitude?: number) => void;
    addAudioToQueue: (dataUrl: string, latitude?: number, longitude?: number) => void;
    processQueue: () => Promise<number | undefined>;
    clearQueue: () => void;
};
//# sourceMappingURL=useOffline.d.ts.map