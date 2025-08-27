import { create } from 'zustand';
import { Question, QuizAnswer, QuizResult } from '../utils/types';

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  startTime: Date | null;
  isQuizActive: boolean;
  result: QuizResult | null;
  loading: boolean;
  error: string | null;
  
  setQuestions: (questions: Question[]) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  setAnswer: (questionId: number, answer: 'A' | 'B' | 'C' | 'D') => void;
  getAnswer: (questionId: number) => 'A' | 'B' | 'C' | 'D' | undefined;
  startQuiz: () => void;
  submitQuiz: (result: QuizResult) => void;
  resetQuiz: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  startTime: null,
  isQuizActive: false,
  result: null,
  loading: false,
  error: null,
  
  setQuestions: (questions) => set({ questions }),
  
  nextQuestion: () => set((state) => ({
    currentQuestionIndex: Math.min(
      state.currentQuestionIndex + 1,
      state.questions.length - 1
    )
  })),
  
  prevQuestion: () => set((state) => ({
    currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0)
  })),
  
  goToQuestion: (index) => set((state) => ({
    currentQuestionIndex: Math.max(0, Math.min(index, state.questions.length - 1))
  })),
  
  setAnswer: (questionId, answer) => set((state) => {
    const existingAnswerIndex = state.answers.findIndex(a => a.questionId === questionId);
    const newAnswers = [...state.answers];
    
    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex] = { questionId, answer };
    } else {
      newAnswers.push({ questionId, answer });
    }
    
    return { answers: newAnswers };
  }),
  
  getAnswer: (questionId) => {
    const answer = get().answers.find(a => a.questionId === questionId);
    return answer?.answer;
  },
  
  startQuiz: () => set({ 
    startTime: new Date(), 
    isQuizActive: true,
    currentQuestionIndex: 0,
    answers: [],
    result: null
  }),
  
  submitQuiz: (result) => set({ 
    result, 
    isQuizActive: false 
  }),
  
  resetQuiz: () => set({
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    startTime: null,
    isQuizActive: false,
    result: null,
    error: null
  }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
}));