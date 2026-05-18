import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  getQueueStats: () => { total: number; photos: number; audio: number };
};

export const useOfflineStore = create<OfflineStore>()(
  persist(
    (set, get) => ({
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      queue: [],
      syncError: null,
      isSyncing: false,

      setOnlineStatus: (online) => set({ isOnline: online }),

      addToQueue: (item) =>
        set((state) => ({
          queue: [...state.queue, item],
        })),

      removeFromQueue: (id) =>
        set((state) => ({
          queue: state.queue.filter((item) => item.id !== id),
        })),

      clearQueue: () => set({ queue: [] }),

      setIsSyncing: (syncing) => set({ isSyncing: syncing }),

      setSyncError: (error) => set({ syncError: error }),

      incrementRetry: (id) =>
        set((state) => ({
          queue: state.queue.map((item) =>
            item.id === id
              ? { ...item, retries: item.retries + 1 }
              : item
          ),
        })),

      getQueueStats: () => {
        const queue = get().queue;
        return {
          total: queue.length,
          photos: queue.filter(
            (item) => item.action === 'identify_photo'
          ).length,
          audio: queue.filter(
            (item) => item.action === 'identify_audio'
          ).length,
        };
      },
    }),
    {
      name: 'offline-store',
      partialize: (state) => ({
        queue: state.queue,
      }),
    }
  )
);
