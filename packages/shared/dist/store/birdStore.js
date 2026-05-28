import { create } from 'zustand';
export const useBirdStore = create((set) => ({
    birds: [],
    currentBird: null,
    identificationResult: null,
    loading: false,
    error: null,
    setBirds: (birds) => set({ birds }),
    setCurrentBird: (bird) => set({ currentBird: bird }),
    setIdentificationResult: (result) => set({ identificationResult: result, currentBird: result?.bird || null }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    addBird: (bird) => set((state) => ({
        birds: [bird, ...state.birds],
    })),
}));
//# sourceMappingURL=birdStore.js.map