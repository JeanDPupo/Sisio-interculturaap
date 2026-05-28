import { Bird, BirdIdentificationResult } from '../types';
export declare const useBird: () => {
    birds: Bird[];
    loading: boolean;
    error: string | null;
    currentBird: Bird | null;
    identificationResult: BirdIdentificationResult | null;
    getBirds: any;
    getBirdById: any;
    searchBirds: any;
    identifyFromPhoto: any;
    identifyFromAudio: any;
};
//# sourceMappingURL=useBird.d.ts.map