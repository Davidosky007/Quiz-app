import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useTimer } from '../../hooks/useTimer';
import { useQuizStore } from '../../store/quizStore';

const Timer: React.FC = () => {
  const { isQuizActive } = useQuizStore();
  const { formattedTime, start, stop } = useTimer();

  useEffect(() => {
    if (isQuizActive) {
      start();
    } else {
      stop();
    }

    return () => {
      stop();
    };
  }, [isQuizActive, start, stop]);

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
        <Clock size={20} className="text-gray-600" />
        <span className="text-lg font-mono font-medium text-gray-900">
          {formattedTime}
        </span>
      </div>
    </div>
  );
};

export default Timer;