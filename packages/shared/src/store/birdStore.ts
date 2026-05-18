import { create } from 'zustand';
import { Bird, BirdIdentificationResult } from '../types';

type BirdStore = {
  birds: Bird[];
  currentBird: Bird | null;
  lastIdentificationResult: BirdIdentificationResult | null;
  loading: boolean;
  error: string | null;
  setBirds: (birds: Bird[]) => void;
  setCurrentBird: (bird: Bird | null) => void;
  setLastIdentificationResult: (result: BirdIdentificationResult | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addBird: (bird: Bird) => void;
  addIdentificationResult: (result: BirdIdentificationResult) => void;
};

export const useBirdStore = create<BirdStore>((set) => ({
  birds: [],
  currentBird: null,
  lastIdentificationResult: null,
  loading: false,
  error: null,

  setBirds: (birds) => set({ birds }),

  setCurrentBird: (bird) => set({ currentBird: bird }),

  setLastIdentificationResult: (result) =>
    set({ lastIdentificationResult: result }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  addBird: (bird) =>
    set((state) => ({
      birds: [bird, ...state.birds],
    })),

  addIdentificationResult: (result) =>
    set((state) => ({
      lastIdentificationResult: result,
      currentBird: result.bird || null,
      birds: result.bird
        ? [result.bird, ...state.birds.filter((b) => b.id !== result.bird!.id)]
        : state.birds,
    })),
}));
