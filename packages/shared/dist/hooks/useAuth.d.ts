import { User, RegisterData, LoginCredentials } from '../types';
export declare const useAuth: () => {
    user: User | null;
    isAuthenticated: boolean;
    isGuest: boolean;
    accessToken: string | null;
    loading: boolean;
    error: string | null;
    setError: (error: string | null) => void;
    register: (data: RegisterData) => Promise<any>;
    login: (credentials: LoginCredentials) => Promise<any>;
    createGuestUser: (name: string) => Promise<any>;
    upgradeGuestToRegistered: (email: string, password: string) => Promise<any>;
    logout: () => Promise<void>;
    refreshAccessToken: () => Promise<void>;
    updateProfile: (updates: Partial<User>) => Promise<Partial<User>>;
};
//# sourceMappingURL=useAuth.d.ts.map