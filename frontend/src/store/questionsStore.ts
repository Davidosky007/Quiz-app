import { create } from 'zustand';
import { Question } from '../utils/types';

interface QuestionsState {
  questions: Question[];
  loading: boolean;
  error: string | null;
  
  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (id: number, question: Question) => void;
  deleteQuestion: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useQuestionsStore = create<QuestionsState>((set) => ({
  questions: [],
  loading: false,
  error: null,
  
  setQuestions: (questions) => set({ questions }),
  
  addQuestion: (question) => set((state) => ({
    questions: [question, ...state.questions]
  })),
  
  updateQuestion: (id, updatedQuestion) => set((state) => ({
    questions: state.questions.map(q => 
      q.id === id ? updatedQuestion : q
    )
  })),
  
  deleteQuestion: (id) => set((state) => ({
    questions: state.questions.filter(q => q.id !== id)
  })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
}));