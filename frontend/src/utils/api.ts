import axios, { AxiosResponse } from 'axios';
import { useAuthStore } from '../store/authStore';
import { 
  User, 
  Question, 
  QuizResult, 
  CreateQuestionData,
  LoginData,
  RegisterData,
  ApiResponse 
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (data: LoginData): Promise<AxiosResponse<ApiResponse<{ token: string; user: User }>>> =>
    api.post('/auth/login', data),
    
  register: (data: RegisterData): Promise<AxiosResponse<ApiResponse<{ token: string; user: User }>>> =>
    api.post('/auth/register', data),
};

// Questions API calls
export const questionsAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<{ questions: Question[] }>>> =>
    api.get('/questions'),
    
  create: (data: CreateQuestionData): Promise<AxiosResponse<ApiResponse<{ question: Question }>>> =>
    api.post('/questions', data),
    
  update: (id: number, data: Partial<CreateQuestionData>): Promise<AxiosResponse<ApiResponse<{ question: Question }>>> =>
    api.put(`/questions/${id}`, data),
    
  delete: (id: number): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/questions/${id}`),
};

// Quiz API calls
export const quizAPI = {
  start: (): Promise<AxiosResponse<ApiResponse<{ questions: Question[] }>>> =>
    api.get('/quiz/start'),
    
  submit: (data: { answers: Array<{ questionId: number; answer: 'A' | 'B' | 'C' | 'D' }>; timeTaken: number }): Promise<AxiosResponse<ApiResponse<{ result: QuizResult }>>> =>
    api.post('/quiz/submit', data),
};

export default api;