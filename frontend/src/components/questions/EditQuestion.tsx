import React, { useState } from 'react';
import { isAxiosError } from 'axios';
import { Question, CreateQuestionData } from '../../utils/types';
import { questionsAPI } from '../../utils/api';
import { useQuestionsStore } from '../../store/questionsStore';
import ErrorMessage from '../common/ErrorMessage';
import Loader from '../common/Loader';

interface EditQuestionProps {
  question: Question;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditQuestion: React.FC<EditQuestionProps> = ({ question, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<CreateQuestionData>({
    question_text: question.question_text,
    option_a: question.option_a,
    option_b: question.option_b,
    option_c: question.option_c,
    option_d: question.option_d,
    correct_answer: question.correct_answer || 'A'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateQuestion } = useQuestionsStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      const response = await questionsAPI.update(question.id, formData);
      updateQuestion(question.id, response.data.question);
      onSuccess();
    } catch (err) {
      let msg = 'Failed to update question';
      if (isAxiosError(err)) {
        const serverMsg = (err.response?.data as { message?: string } | undefined)?.message;
        if (typeof serverMsg === 'string' && serverMsg.trim()) msg = serverMsg;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <ErrorMessage message={error} onClose={() => setError(null)} />
      )}

      <div>
        <label htmlFor="question_text" className="block text-sm font-medium text-gray-700 mb-2">
          Question Text
        </label>
        <textarea
          id="question_text"
          name="question_text"
          rows={3}
          required
          value={formData.question_text}
          onChange={handleChange}
          className="input resize-none"
          placeholder="Enter your question here..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="option_a" className="block text-sm font-medium text-gray-700 mb-2">
            Option A
          </label>
          <input
            id="option_a"
            name="option_a"
            type="text"
            required
            value={formData.option_a}
            onChange={handleChange}
            className="input"
            placeholder="First option"
          />
        </div>

        <div>
          <label htmlFor="option_b" className="block text-sm font-medium text-gray-700 mb-2">
            Option B
          </label>
          <input
            id="option_b"
            name="option_b"
            type="text"
            required
            value={formData.option_b}
            onChange={handleChange}
            className="input"
            placeholder="Second option"
          />
        </div>

        <div>
          <label htmlFor="option_c" className="block text-sm font-medium text-gray-700 mb-2">
            Option C
          </label>
          <input
            id="option_c"
            name="option_c"
            type="text"
            required
            value={formData.option_c}
            onChange={handleChange}
            className="input"
            placeholder="Third option"
          />
        </div>

        <div>
          <label htmlFor="option_d" className="block text-sm font-medium text-gray-700 mb-2">
            Option D
          </label>
          <input
            id="option_d"
            name="option_d"
            type="text"
            required
            value={formData.option_d}
            onChange={handleChange}
            className="input"
            placeholder="Fourth option"
          />
        </div>
      </div>

      <div>
        <label htmlFor="correct_answer" className="block text-sm font-medium text-gray-700 mb-2">
          Correct Answer
        </label>
        <select
          id="correct_answer"
          name="correct_answer"
          required
          value={formData.correct_answer}
          onChange={handleChange}
          className="input"
        >
          <option value="A">A - {formData.option_a}</option>
          <option value="B">B - {formData.option_b}</option>
          <option value="C">C - {formData.option_c}</option>
          <option value="D">D - {formData.option_d}</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary flex items-center space-x-2"
        >
          {loading ? <Loader size="sm" /> : <span>Update Question</span>}
        </button>
      </div>
    </form>
  );
};

export default EditQuestion;