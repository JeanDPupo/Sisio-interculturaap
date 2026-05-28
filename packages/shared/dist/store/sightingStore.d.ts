import { Sighting, SightingState } from '../types';
type SightingStore = SightingState & {
    setSightings: (sightings: Sighting[]) => void;
    addSighting: (sighting: Sighting) => void;
    removeSighting: (id: string) => void;
    updateSighting: (id: string, updates: Partial<Sighting>) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setFilter: (filter: Partial<SightingState['filter']>) => void;
    clearSightings: () => void;
};
export declare const useSightingStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<SightingStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<SightingStore, {
            sightings: Sighting[];
            filter: {
                user_id?: string;
                groupby?: "day" | "bird" | "location";
                limit: number;
                offset: number;
            };
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: SightingStore) => void) => () => void;
        onFinishHydration: (fn: (state: SightingStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<SightingStore, {
            sightings: Sighting[];
            filter: {
                user_id?: string;
                groupby?: "day" | "bird" | "location";
                limit: number;
                offset: number;
            };
        }>>;
    };
}>;
export {};
//# sourceMappingURL=sightingStore.d.ts.map