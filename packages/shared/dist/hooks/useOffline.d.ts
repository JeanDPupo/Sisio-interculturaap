import { OfflineQueueItem } from '../store/offlineStore';
export declare const useOffline: () => {
    isOnline: boolean;
    queue: OfflineQueueItem[];
    isSyncing: boolean;
    syncError: string | null;
    queueLength: number;
    addToQueue: (item: OfflineQueueItem) => void;
    addPhotoToQueue: any;
    addAudioToQueue: any;
    processQueue: any;
    clearQueue: () => void;
};
//# sourceMappingURL=useOffline.d.ts.map