import type { IdentificationProvider, IdentificationProviderConfig } from './types';
import type { BirdIdentificationResult } from '../../types';
export declare class GroqProvider implements IdentificationProvider {
    readonly name: string;
    private apiKey;
    private model;
    private _available;
    constructor(config: IdentificationProviderConfig);
    isAvailable(): boolean;
    identify(imageBase64: string): Promise<BirdIdentificationResult | null>;
}
//# sourceMappingURL=GroqProvider.d.ts.map