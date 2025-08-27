import React, { useState } from 'react';
import { isAxiosError } from 'axios';
import { Edit, Trash2, Check } from 'lucide-react';
import { Question } from '../../utils/types';
import { questionsAPI } from '../../utils/api';
import { useQuestionsStore } from '../../store/questionsStore';
import EditQuestion from './EditQuestion.tsx';
import ErrorMessage from '../common/ErrorMessage';

interface QuestionCardProps {
  question: Question;
  onUpdate: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const { deleteQuestion } = useQuestionsStore();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      await questionsAPI.delete(question.id);
      deleteQuestion(question.id);
    } catch (err) {
      let msg = 'Failed to delete question';
      if (isAxiosError(err)) {
        const serverMsg = (err.response?.data as { message?: string } | undefined)?.message;
        if (typeof serverMsg === 'string' && serverMsg.trim()) msg = serverMsg;
      }
      setError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    onUpdate();
  };

  const getOptionLetter = (index: number): 'A' | 'B' | 'C' | 'D' => {
    return String.fromCharCode(65 + index) as 'A' | 'B' | 'C' | 'D';
  };

  const options = [
    question.option_a,
    question.option_b,
    question.option_c,
    question.option_d
  ];

  if (isEditing) {
    return (
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Question</h3>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        <EditQuestion 
          question={question}
          onSuccess={handleEditSuccess}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="card">
      {error && (
        <ErrorMessage 
          message={error} 
          onClose={() => setError(null)}
          className="mb-4"
        />
      )}
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-4">
          {question.question_text}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-violet-600 hover:text-violet-800 p-1"
            title="Edit question"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50"
            title="Delete question"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((option, index) => {
          const letter = getOptionLetter(index);
          const isCorrect = question.correct_answer === letter;
          
          return (
            <div
              key={index}
              className={`p-3 rounded-md border flex items-center space-x-2 ${
                showAnswers && isCorrect 
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}
            >
              <span className="font-medium text-sm">{letter}.</span>
              <span className="flex-1">{option}</span>
              {showAnswers && isCorrect && <Check size={16} className="text-green-600" />}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setShowAnswers((s) => !s)}
          className="btn btn-secondary"
        >
          {showAnswers ? 'Hide Answers' : 'Reveal Answers'}
        </button>
        <div className="text-sm text-gray-500">
          {question.created_at && (
            <p>Created: {new Date(question.created_at).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;