import { User, AuthState } from '../types';
type AuthStore = AuthState & {
    setUser: (user: User | null) => void;
    setTokens: (accessToken: string, refreshToken?: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    loginSuccess: (data: {
        user: User;
        access_token: string;
        refresh_token?: string;
    }) => void;
    registerSuccess: (data: {
        user: User;
        access_token: string;
        refresh_token?: string;
    }) => void;
    guestLogin: (data: {
        name: string;
        guest_id: string;
    }) => void;
    logout: () => void;
    upgradeGuest: (email: string, password: string) => void;
    updateUserProfile: (user: Partial<User>) => void;
};
export declare const useAuthStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<AuthStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<AuthStore, {
            user: User | null;
            isAuthenticated: boolean;
            isGuest: boolean;
            accessToken: string | null;
            refreshToken: string | null;
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: AuthStore) => void) => () => void;
        onFinishHydration: (fn: (state: AuthStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<AuthStore, {
            user: User | null;
            isAuthenticated: boolean;
            isGuest: boolean;
            accessToken: string | null;
            refreshToken: string | null;
        }>>;
    };
}>;
export {};
//# sourceMappingURL=userStore.d.ts.map