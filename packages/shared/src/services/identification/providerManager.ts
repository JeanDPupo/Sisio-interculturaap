import type { IdentificationProvider, IdentificationProviderConfig, IdentifyOptions } from './types';
import type { BirdIdentificationResult } from '../../types';
import { GroqProvider } from './GroqProvider';

function getGroqKey(): string {
  if (typeof process !== 'undefined' && process.env) {
    return process.env.EXPO_PUBLIC_GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || '';
  }
  return '';
}

const DEFAULT_PROVIDERS: IdentificationProviderConfig[] = [
  {
    name: 'groq',
    apiKey: getGroqKey(),
    model: 'llama-3.2-11b-vision-preview',
    enabled: true,
    priority: 1,
  },
];

export class ProviderManager {
  private providers: IdentificationProvider[] = [];

  constructor(configs?: IdentificationProviderConfig[]) {
    const cfgs = configs && configs.length > 0 ? configs : DEFAULT_PROVIDERS;
    this.initProviders(cfgs);
  }

  private initProviders(configs: IdentificationProviderConfig[]): void {
    const sorted = [...configs].sort((a, b) => a.priority - b.priority);
    for (const cfg of sorted) {
      if (!cfg.enabled) continue;
      const provider = this.createProvider(cfg);
      if (provider && provider.isAvailable()) {
        this.providers.push(provider);
      }
    }
  }

  private createProvider(config: IdentificationProviderConfig): IdentificationProvider | null {
    switch (config.name) {
      case 'groq':
        return new GroqProvider(config);
      default:
        return null;
    }
  }

  async identify(options: IdentifyOptions): Promise<{
    result: BirdIdentificationResult | null;
    usedProvider: string;
  }> {
    const errors: { provider: string; error: string }[] = [];

    for (const provider of this.providers) {
      try {
        const result = await provider.identify(options.imageBase64);
        if (result) {
          return { result, usedProvider: provider.name };
        }
        errors.push({ provider: provider.name, error: 'Provider returned null' });
      } catch (err: any) {
        errors.push({ provider: provider.name, error: err?.message || 'Unknown error' });
        console.warn(`[ProviderManager] ${provider.name} failed:`, err);
      }
    }

    console.warn('[ProviderManager] All providers failed:', errors);
    return { result: null, usedProvider: 'none' };
  }

  getAvailableProviders(): string[] {
    return this.providers.map((p) => p.name);
  }
}

let _instance: ProviderManager | null = null;

export function getProviderManager(configs?: IdentificationProviderConfig[]): ProviderManager {
  if (!_instance || configs) {
    _instance = new ProviderManager(configs);
  }
  return _instance;
}
