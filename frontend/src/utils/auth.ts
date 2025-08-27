import { User } from './types';

export const getStoredToken = (): string | null => {
  return localStorage.getItem('quiz-app-token');
};

export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem('quiz-app-user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }
  return null;
};

export const clearAuthStorage = (): void => {
  localStorage.removeItem('quiz-app-token');
  localStorage.removeItem('quiz-app-user');
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};