import { GroqProvider } from './GroqProvider.js';
function getGroqKey() {
    if (typeof process !== 'undefined' && process.env) {
        return process.env.EXPO_PUBLIC_GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || '';
    }
    return '';
}
const DEFAULT_PROVIDERS = [
    {
        name: 'groq',
        apiKey: getGroqKey(),
        model: 'llama-3.2-11b-vision-preview',
        enabled: true,
        priority: 1,
    },
];
export class ProviderManager {
    providers = [];
    constructor(configs) {
        const cfgs = configs && configs.length > 0 ? configs : DEFAULT_PROVIDERS;
        this.initProviders(cfgs);
    }
    initProviders(configs) {
        const sorted = [...configs].sort((a, b) => a.priority - b.priority);
        for (const cfg of sorted) {
            if (!cfg.enabled)
                continue;
            const provider = this.createProvider(cfg);
            if (provider && provider.isAvailable()) {
                this.providers.push(provider);
            }
        }
    }
    createProvider(config) {
        switch (config.name) {
            case 'groq':
                return new GroqProvider(config);
            default:
                return null;
        }
    }
    async identify(options) {
        const errors = [];
        for (const provider of this.providers) {
            try {
                const result = await provider.identify(options.imageBase64);
                if (result) {
                    return { result, usedProvider: provider.name };
                }
                errors.push({ provider: provider.name, error: 'Provider returned null' });
            }
            catch (err) {
                errors.push({ provider: provider.name, error: err?.message || 'Unknown error' });
                console.warn(`[ProviderManager] ${provider.name} failed:`, err);
            }
        }
        console.warn('[ProviderManager] All providers failed:', errors);
        return { result: null, usedProvider: 'none' };
    }
    getAvailableProviders() {
        return this.providers.map((p) => p.name);
    }
}
let _instance = null;
export function getProviderManager(configs) {
    if (!_instance || configs) {
        _instance = new ProviderManager(configs);
    }
    return _instance;
}
