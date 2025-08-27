export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Question {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer?: 'A' | 'B' | 'C' | 'D';
  created_by?: number;
  created_at?: string;
}

export interface QuizAnswer {
  questionId: number;
  answer: 'A' | 'B' | 'C' | 'D';
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  timeTaken: number;
  correctAnswers: number;
  id?: number;
}

export interface CreateQuestionData {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ApiResponse<T = unknown> {
  message: string;
  [key: string]: T | string;
}

export interface ApiError {
  error: string;
  message: string;
}