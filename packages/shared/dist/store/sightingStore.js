import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useSightingStore = create()(persist((set) => ({
    sightings: [],
    loading: false,
    error: null,
    filter: {
        limit: 20,
        offset: 0,
    },
    setSightings: (sightings) => set({ sightings }),
    addSighting: (sighting) => set((state) => ({
        sightings: [sighting, ...state.sightings],
    })),
    removeSighting: (id) => set((state) => ({
        sightings: state.sightings.filter((s) => s.id !== id),
    })),
    updateSighting: (id, updates) => set((state) => ({
        sightings: state.sightings.map((s) => s.id === id ? { ...s, ...updates } : s),
    })),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setFilter: (filter) => set((state) => ({
        filter: { ...state.filter, ...filter },
    })),
    clearSightings: () => set({ sightings: [] }),
}), {
    name: 'sighting-store',
    partialize: (state) => ({
        sightings: state.sightings,
        filter: state.filter,
    }),
}));
//# sourceMappingURL=sightingStore.js.map