import React from 'react';
import Header from '../components/common/Header';
import QuizInterface from '../components/quiz/QuizInterface';

const QuizPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <QuizInterface />
        </div>
      </main>
    </div>
  );
};

export default QuizPage;