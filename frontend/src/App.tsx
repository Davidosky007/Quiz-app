import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/common/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import QuestionsPage from './pages/QuestionsPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/auth" 
            element={<AuthPage />} 
          />
          <Route 
            path="/questions" 
            element={
              <ProtectedRoute>
                <QuestionsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/quiz" 
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/quiz/results" 
            element={
              <ProtectedRoute>
                <ResultsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <Navigate 
                to={isAuthenticated ? "/questions" : "/auth"} 
                replace 
              />
            } 
          />
          <Route 
            path="*" 
            element={
              <Navigate 
                to={isAuthenticated ? "/questions" : "/auth"} 
                replace 
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;