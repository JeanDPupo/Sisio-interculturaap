import { useCallback } from 'react';
import { useAuthStore } from '../store/userStore';
import { apiService } from '../services/apiService';
import { User, RegisterData, LoginCredentials } from '../types';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isGuest,
    accessToken,
    refreshToken,
    loading,
    error,
    setLoading,
    setError,
    loginSuccess,
    registerSuccess,
    guestLogin,
    logout: storeLogout,
    upgradeGuest: storeUpgradeGuest,
    updateUserProfile,
    setUser,
  } = useAuthStore();

  const register = useCallback(
    async (data: RegisterData) => {
      setLoading(true);
      try {
        const response = await apiService.register(data.name, data.email, data.password);
        registerSuccess(response.data);
        apiService.setAccessToken(response.data.access_token);
        return response.data;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Error en registro';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, registerSuccess]
  );

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true);
      try {
        const response = await apiService.login(credentials.email, credentials.password);
        loginSuccess(response.data);
        apiService.setAccessToken(response.data.access_token);
        return response.data;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Error en login';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, loginSuccess]
  );

  const createGuestUser = useCallback(
    async (name: string) => {
      setLoading(true);
      try {
        const response = await apiService.createGuestUser(name);
        guestLogin(response.data);
        return response.data;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Error creando usuario guest';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, guestLogin]
  );

  const upgradeGuestToRegistered = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        if (!user?.id) throw new Error('No guest user found');
        const response = await apiService.upgradeGuestUser(user.id, email, password);
        storeUpgradeGuest(email, password);
        loginSuccess(response.data);
        apiService.setAccessToken(response.data.access_token);
        return response.data;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Error actualizando usuario';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user?.id, setLoading, setError, storeUpgradeGuest, loginSuccess]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await apiService.logout();
      storeLogout();
      apiService.setAccessToken(null);
    } catch (err: any) {
      console.error('Error en logout:', err);
    } finally {
      setLoading(false);
    }
  }, [setLoading, storeLogout]);

  const refreshAccessToken = useCallback(async () => {
    try {
      if (!refreshToken) return;
      const response = await apiService.refreshToken(refreshToken);
      if (response.data.access_token) {
        apiService.setAccessToken(response.data.access_token);
      }
    } catch (err: any) {
      console.error('Error refreshing token:', err);
    }
  }, [refreshToken]);

  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      try {
        await apiService.updateUserProfile(updates);
        updateUserProfile(updates);
        return updates;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Error actualizando perfil';
        setError(message);
        throw err;
      }
    },
    [updateUserProfile, setError]
  );

  return {
    user,
    isAuthenticated,
    isGuest,
    accessToken,
    loading,
    error,
    setError,
    register,
    login,
    createGuestUser,
    upgradeGuestToRegistered,
    logout,
    refreshAccessToken,
    updateProfile,
  };
};
