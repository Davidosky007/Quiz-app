import { Request } from 'express';

export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  created_at: Date;
}

export interface Question {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  created_by: number;
  created_at: Date;
}

export interface QuizAnswer {
  questionId: number;
  answer: 'A' | 'B' | 'C' | 'D';
}

export interface QuizResult {
  id?: number;
  user_id: number;
  score: number;
  total_questions: number;
  time_taken: number;
  correct_answers: number;
  created_at?: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateQuestionRequest {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
}

export interface UpdateQuestionRequest extends Partial<CreateQuestionRequest> {}

export interface QuizSubmission {
  answers: QuizAnswer[];
  timeTaken: number;
}