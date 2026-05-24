import { create } from 'zustand';
import { Bird, BirdIdentificationResult } from '../types';

type BirdStore = {
  birds: Bird[];
  currentBird: Bird | null;
  identificationResult: BirdIdentificationResult | null;
  loading: boolean;
  error: string | null;
  setBirds: (birds: Bird[]) => void;
  setCurrentBird: (bird: Bird | null) => void;
  setIdentificationResult: (result: BirdIdentificationResult | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addBird: (bird: Bird) => void;
};

export const useBirdStore = create<BirdStore>((set) => ({
  birds: [],
  currentBird: null,
  identificationResult: null,
  loading: false,
  error: null,

  setBirds: (birds) => set({ birds }),

  setCurrentBird: (bird) => set({ currentBird: bird }),

  setIdentificationResult: (result) =>
    set({ identificationResult: result, currentBird: result?.bird || null }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  addBird: (bird) =>
    set((state) => ({
      birds: [bird, ...state.birds],
    })),
}));
