import type { IdentificationProviderConfig, IdentifyOptions } from './types';
import type { BirdIdentificationResult } from '../../types';
export declare class ProviderManager {
    private providers;
    constructor(configs?: IdentificationProviderConfig[]);
    private initProviders;
    private createProvider;
    identify(options: IdentifyOptions): Promise<{
        result: BirdIdentificationResult | null;
        usedProvider: string;
    }>;
    getAvailableProviders(): string[];
}
export declare function getProviderManager(configs?: IdentificationProviderConfig[]): ProviderManager;
//# sourceMappingURL=providerManager.d.ts.map