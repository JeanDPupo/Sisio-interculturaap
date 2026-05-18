import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState, LoginCredentials, RegisterData } from '../types';

type AuthStore = AuthState & {
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loginSuccess: (data: { user: User; access_token: string; refresh_token?: string }) => void;
  registerSuccess: (data: { user: User; access_token: string; refresh_token?: string }) => void;
  guestLogin: (data: { name: string; guest_id: string }) => void;
  logout: () => void;
  upgradeGuest: (email: string, password: string) => void;
  updateUserProfile: (user: Partial<User>) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isGuest: false,
      accessToken: null,
      refreshToken: null,
      loading: false,
      error: null,

      setUser: (user) => set({ user }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      loginSuccess: (data) =>
        set({
          user: data.user,
          accessToken: data.access_token,
          refreshToken: data.refresh_token || null,
          isAuthenticated: true,
          isGuest: false,
          error: null,
          loading: false,
        }),

      registerSuccess: (data) =>
        set({
          user: data.user,
          accessToken: data.access_token,
          refreshToken: data.refresh_token || null,
          isAuthenticated: true,
          isGuest: false,
          error: null,
          loading: false,
        }),

      guestLogin: (data) =>
        set({
          user: {
            id: data.guest_id,
            name: data.name,
            language: 'es',
            theme_preference: 'light',
            is_admin: false,
            is_guest: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          isAuthenticated: false,
          isGuest: true,
          error: null,
          loading: false,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isGuest: false,
          accessToken: null,
          refreshToken: null,
          error: null,
        }),

      upgradeGuest: (email, password) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, email, is_guest: false }
            : null,
          isGuest: false,
          isAuthenticated: true,
        })),

      updateUserProfile: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isGuest: state.isGuest,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
