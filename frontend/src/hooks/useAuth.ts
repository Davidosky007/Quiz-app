import { useAuthStore } from '../store/authStore';
import { authAPI } from '../utils/api';
import { LoginData, RegisterData } from '../utils/types';
import { useState } from 'react';
import { isAxiosError } from 'axios';

export const useAuth = () => {
  const { token, user, isAuthenticated, login, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (
    data: LoginData
  ): Promise<{ success: true } | { success: false; error: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login(data);
      const { token: authToken, user: authUser } = response.data;
      
      login(authToken, authUser);
      return { success: true };
    } catch (err) {
      let msg = 'Login failed';
      if (isAxiosError(err)) {
        const serverMsg = (err.response?.data as { message?: string } | undefined)?.message;
        if (typeof serverMsg === 'string' && serverMsg.trim()) msg = serverMsg;
      }
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (
    data: RegisterData
  ): Promise<{ success: true } | { success: false; error: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.register(data);
      const { token: authToken, user: authUser } = response.data;
      
      login(authToken, authUser);
      return { success: true };
    } catch (err) {
      let msg = 'Registration failed';
      if (isAxiosError(err)) {
        const serverMsg = (err.response?.data as { message?: string } | undefined)?.message;
        if (typeof serverMsg === 'string' && serverMsg.trim()) msg = serverMsg;
      }
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return {
    token,
    user,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError: () => setError(null),
  };
};