import React, { useCallback, useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { Plus } from 'lucide-react';
import { useQuestionsStore } from '../../store/questionsStore';
import { questionsAPI } from '../../utils/api';
import QuestionCard from './QuestionCard.tsx';
import QuestionForm from './QuestionForm.tsx';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const QuestionList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const { 
    questions, 
    loading, 
    error, 
    setQuestions, 
    setLoading, 
    setError, 
    clearError 
  } = useQuestionsStore();

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const response = await questionsAPI.getAll();
      setQuestions(response.data.questions);
    } catch (err) {
      let msg = 'Failed to fetch questions';
      if (isAxiosError(err)) {
        const serverMsg = (err.response?.data as { message?: string } | undefined)?.message;
        if (typeof serverMsg === 'string' && serverMsg.trim()) msg = serverMsg;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearError, setQuestions, setError]);

  useEffect(() => {
    void fetchQuestions();
  }, [fetchQuestions]);

  const handleQuestionCreated = () => {
    setShowForm(false);
    fetchQuestions();
  };

  if (loading && questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader text="Loading questions..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Questions</h1>
          <p className="mt-2 text-gray-600">Manage your quiz questions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Question</span>
        </button>
      </div>

      {error && (
        <ErrorMessage message={error} onClose={clearError} />
      )}

      {showForm && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Add New Question</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <QuestionForm onSuccess={handleQuestionCreated} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="grid gap-6">
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No questions available</p>
            <p className="text-gray-400 text-sm mt-2">Create your first question to get started</p>
          </div>
        ) : (
          questions.map((question) => (
            <QuestionCard 
              key={question.id} 
              question={question} 
              onUpdate={fetchQuestions}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionList;