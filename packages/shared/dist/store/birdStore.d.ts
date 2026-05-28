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
export declare const useBirdStore: import("zustand").UseBoundStore<import("zustand").StoreApi<BirdStore>>;
export {};
//# sourceMappingURL=birdStore.d.ts.map