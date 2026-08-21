import type { BirdIdentificationResult } from '../../types';
export interface IdentificationProviderConfig {
    name: string;
    apiKey?: string;
    model?: string;
    enabled: boolean;
    priority: number;
}
export interface IdentificationProvider {
    readonly name: string;
    identify(imageBase64: string): Promise<BirdIdentificationResult | null>;
    isAvailable(): boolean;
}
export interface ProviderManagerOptions {
    providers: IdentificationProviderConfig[];
}
export interface IdentifyOptions {
    imageBase64: string;
    timeout?: number;
}
//# sourceMappingURL=types.d.ts.map