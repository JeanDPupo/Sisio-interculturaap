import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Sighting, SightingState } from '../types';

type SightingStore = SightingState & {
  setSightings: (sightings: Sighting[]) => void;
  addSighting: (sighting: Sighting) => void;
  removeSighting: (id: string) => void;
  updateSighting: (id: string, updates: Partial<Sighting>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilter: (filter: Partial<SightingState['filter']>) => void;
  clearSightings: () => void;
};

export const useSightingStore = create<SightingStore>()(
  persist(
    (set) => ({
      sightings: [],
      loading: false,
      error: null,
      filter: {
        limit: 20,
        offset: 0,
      },

      setSightings: (sightings) => set({ sightings }),

      addSighting: (sighting) =>
        set((state) => ({
          sightings: [sighting, ...state.sightings],
        })),

      removeSighting: (id) =>
        set((state) => ({
          sightings: state.sightings.filter((s) => s.id !== id),
        })),

      updateSighting: (id, updates) =>
        set((state) => ({
          sightings: state.sightings.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      setFilter: (filter) =>
        set((state) => ({
          filter: { ...state.filter, ...filter },
        })),

      clearSightings: () => set({ sightings: [] }),
    }),
    {
      name: 'sighting-store',
      partialize: (state) => ({
        sightings: state.sightings,
        filter: state.filter,
      }),
    }
  )
);
