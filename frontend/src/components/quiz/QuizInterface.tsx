import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../../store/quizStore';
import { quizAPI } from '../../utils/api';
import QuestionDisplay from './QuestionDisplay.tsx';
import Timer from './Timer.tsx';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import { isAxiosError } from 'axios';

const QuizInterface: React.FC = () => {
  const navigate = useNavigate();
  const { 
    questions, 
    isQuizActive,
    loading, 
    error,
    setQuestions,
    startQuiz,
    setLoading,
    setError,
    resetQuiz
  } = useQuizStore();

  const initializeQuiz = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await quizAPI.start();
      setQuestions(response.data.questions);
    } catch (err) {
      let msg = 'Failed to start quiz';
      if (isAxiosError(err)) {
        const serverMsg = (err.response?.data as { message?: string } | undefined)?.message;
        if (typeof serverMsg === 'string' && serverMsg.trim()) msg = serverMsg;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setQuestions]);

  useEffect(() => {
    void initializeQuiz();
    return () => {
      // Don't reset quiz on component unmount if quiz is active
      // User might navigate away and come back
    };
  }, [initializeQuiz]);

  const handleStartQuiz = () => {
    startQuiz();
  };

  const handleBackToQuestions = () => {
    resetQuiz();
    navigate('/questions');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader text="Loading quiz..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <ErrorMessage message={error} />
        <div className="mt-4 text-center">
          <button
            onClick={handleBackToQuestions}
            className="btn btn-secondary"
          >
            Back to Questions
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Questions Available</h1>
          <p className="text-gray-600 mb-6">
            There are no questions available for the quiz. Please add some questions first.
          </p>
          <button
            onClick={handleBackToQuestions}
            className="btn btn-primary"
          >
            Go to Questions
          </button>
        </div>
      </div>
    );
  }

  if (!isQuizActive) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Quiz?</h1>
          <p className="text-gray-600 mb-6">
            This quiz contains {questions.length} questions. Take your time and answer all questions.
          </p>
          <div className="space-y-4">
            <button
              onClick={handleStartQuiz}
              className="btn btn-primary text-lg px-8 py-3"
            >
              Start Quiz
            </button>
            <div>
              <button
                onClick={handleBackToQuestions}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Back to Questions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Timer />
      </div>
      <QuestionDisplay />
    </div>
  );
};

export default QuizInterface;