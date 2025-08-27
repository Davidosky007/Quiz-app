import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, RotateCcw, Home } from 'lucide-react';
import { useQuizStore } from '../../store/quizStore';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { result, resetQuiz } = useQuizStore();

  if (!result) {
    navigate('/quiz');
    return null;
  }

  const { score, totalQuestions, correctAnswers, timeTaken } = result;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const accuracy = (correctAnswers / totalQuestions) * 100;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number): string => {
    if (score >= 90) return 'Excellent work! 🎉';
    if (score >= 80) return 'Great job! 👍';
    if (score >= 70) return 'Good effort! 👌';
    if (score >= 60) return 'Not bad! 🙂';
    return 'Keep practicing! 💪';
  };

  const handleRetakeQuiz = () => {
    resetQuiz();
    navigate('/quiz');
  };

  const handleGoHome = () => {
    resetQuiz();
    navigate('/questions');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card text-center">
        <div className="mb-8">
          <div className={`text-6xl font-bold mb-4 ${getScoreColor(score)}`}>
            {score}%
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quiz Complete!
          </h1>
          <p className="text-lg text-gray-600">
            {getScoreMessage(score)}
          </p>
        </div>

        {/* Score breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <CheckCircle className="text-green-600" size={24} />
              <span className="text-green-800 font-semibold">Correct</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <XCircle className="text-red-600" size={24} />
              <span className="text-red-800 font-semibold">Incorrect</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{incorrectAnswers}</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="text-blue-600" size={24} />
              <span className="text-blue-800 font-semibold">Time</span>
            </div>
            <div className="text-2xl font-bold text-violet-600">{formatTime(timeTaken)}</div>
          </div>
        </div>

        {/* Detailed stats */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Questions:</span>
              <span className="font-medium">{totalQuestions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Accuracy:</span>
              <span className="font-medium">{accuracy.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time per Question:</span>
              <span className="font-medium">{Math.round(timeTaken / totalQuestions)}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Score:</span>
              <span className={`font-medium ${getScoreColor(score)}`}>{score}%</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRetakeQuiz}
            className="btn btn-primary flex items-center justify-center space-x-2"
          >
            <RotateCcw size={20} />
            <span>Retake Quiz</span>
          </button>
          <button
            onClick={handleGoHome}
            className="btn btn-secondary flex items-center justify-center space-x-2"
          >
            <Home size={20} />
            <span>Back to Questions</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;