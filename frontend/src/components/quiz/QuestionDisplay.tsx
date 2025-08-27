import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuizStore } from '../../store/quizStore';
import { quizAPI } from '../../utils/api';
import { isAxiosError } from 'axios';

const QuestionDisplay: React.FC = () => {
  const navigate = useNavigate();
  const { 
    questions, 
    currentQuestionIndex, 
    answers,
    startTime,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    setAnswer,
    getAnswer,
    submitQuiz,
    setError
  } = useQuizStore();

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = getAnswer(currentQuestion.id);
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleAnswerSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    setAnswer(currentQuestion.id, answer);
  };

  const handleSubmitQuiz = async () => {
    if (answers.length !== questions.length) {
      if (!window.confirm('You haven\'t answered all questions. Do you want to submit anyway?')) {
        return;
      }
    }

    try {
      const timeTaken = startTime ? Math.floor((Date.now() - startTime.getTime()) / 1000) : 0;
      const response = await quizAPI.submit({ answers, timeTaken });
      submitQuiz(response.data.result);
      navigate('/quiz/results');
    } catch (err) {
      let msg = 'Failed to submit quiz';
      if (isAxiosError(err)) {
        const serverMsg = (err.response?.data as { message?: string } | undefined)?.message;
        if (typeof serverMsg === 'string' && serverMsg.trim()) msg = serverMsg;
      }
      setError(msg);
    }
  };

  const getOptionLetter = (index: number): 'A' | 'B' | 'C' | 'D' => {
    return String.fromCharCode(65 + index) as 'A' | 'B' | 'C' | 'D';
  };

  const options = [
    currentQuestion.option_a,
    currentQuestion.option_b,
    currentQuestion.option_c,
    currentQuestion.option_d
  ];

  return (
    <div className="space-y-6">
      <div className="card">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {answers.length} answered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQuestion.question_text}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {options.map((option, index) => {
              const letter = getOptionLetter(index);
              const isSelected = selectedAnswer === letter;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(letter as 'A' | 'B' | 'C' | 'D')}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="font-medium text-sm">{letter}.</span>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevQuestion}
            disabled={isFirstQuestion}
            className={`btn flex items-center space-x-2 ${
              isFirstQuestion 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'btn-secondary'
            }`}
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {questions.map((_, index) => {
              const isAnswered = answers.some(a => a.questionId === questions[index].id);
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-8 h-8 rounded text-sm font-medium ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isAnswered
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          {isLastQuestion ? (
            <button
              onClick={handleSubmitQuiz}
              className="btn btn-primary text-lg px-6"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="btn btn-primary flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;