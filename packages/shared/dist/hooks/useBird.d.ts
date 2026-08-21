import type { Bird, BirdIdentificationResult } from '../types';
export declare const useBird: () => {
    birds: Bird[];
    loading: boolean;
    error: string | null;
    currentBird: Bird | null;
    identificationResult: BirdIdentificationResult | null;
    getBirds: (limit?: number, offset?: number) => Promise<any>;
    getBirdById: (id: string) => Promise<any>;
    searchBirds: (query: string) => Promise<any>;
    identifyFromPhoto: (file: File, latitude?: number, longitude?: number) => Promise<BirdIdentificationResult>;
    identifyFromAudio: (file: File, latitude?: number, longitude?: number) => Promise<BirdIdentificationResult>;
};
//# sourceMappingURL=useBird.d.ts.map