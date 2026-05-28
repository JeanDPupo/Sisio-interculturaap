export interface OfflineQueueItem {
    id: string;
    action: 'identify_photo' | 'identify_audio' | 'create_sighting' | 'create_comment';
    data: Record<string, unknown>;
    timestamp: string;
    retries: number;
}
type OfflineStore = {
    isOnline: boolean;
    queue: OfflineQueueItem[];
    syncError: string | null;
    isSyncing: boolean;
    setOnlineStatus: (online: boolean) => void;
    addToQueue: (item: OfflineQueueItem) => void;
    removeFromQueue: (id: string) => void;
    clearQueue: () => void;
    setIsSyncing: (syncing: boolean) => void;
    setSyncError: (error: string | null) => void;
    incrementRetry: (id: string) => void;
    getQueueStats: () => {
        total: number;
        photos: number;
        audio: number;
    };
};
export declare const useOfflineStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<OfflineStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<OfflineStore, {
            queue: OfflineQueueItem[];
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: OfflineStore) => void) => () => void;
        onFinishHydration: (fn: (state: OfflineStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<OfflineStore, {
            queue: OfflineQueueItem[];
        }>>;
    };
}>;
export {};
//# sourceMappingURL=offlineStore.d.ts.map