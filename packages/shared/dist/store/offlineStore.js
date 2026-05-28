import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useOfflineStore = create()(persist((set, get) => ({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    queue: [],
    syncError: null,
    isSyncing: false,
    setOnlineStatus: (online) => set({ isOnline: online }),
    addToQueue: (item) => set((state) => ({
        queue: [...state.queue, item],
    })),
    removeFromQueue: (id) => set((state) => ({
        queue: state.queue.filter((item) => item.id !== id),
    })),
    clearQueue: () => set({ queue: [] }),
    setIsSyncing: (syncing) => set({ isSyncing: syncing }),
    setSyncError: (error) => set({ syncError: error }),
    incrementRetry: (id) => set((state) => ({
        queue: state.queue.map((item) => item.id === id
            ? { ...item, retries: item.retries + 1 }
            : item),
    })),
    getQueueStats: () => {
        const queue = get().queue;
        return {
            total: queue.length,
            photos: queue.filter((item) => item.action === 'identify_photo').length,
            audio: queue.filter((item) => item.action === 'identify_audio').length,
        };
    },
}), {
    name: 'offline-store',
    partialize: (state) => ({
        queue: state.queue,
    }),
}));
//# sourceMappingURL=offlineStore.js.map