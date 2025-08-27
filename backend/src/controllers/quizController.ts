import { Response, NextFunction } from 'express';
import { QuestionModel } from '../models/Question';
import { QuizResultModel } from '../models/QuizResult';
import { AuthRequest, QuizSubmission, QuizAnswer } from '../types';

export class QuizController {
  static async startQuiz(req: AuthRequest, res: Response, _next: NextFunction) {
    try {
      // Get all questions without correct answers
      const questions = await QuestionModel.findAllForQuiz();

      if (questions.length === 0) {
        return res.status(404).json({
          error: 'No questions available',
          message: 'There are no questions available for the quiz'
        });
      }

      res.json({
        message: 'Quiz started successfully',
        questions
      });
    } catch (error) {
      console.error('Start quiz error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to start quiz'
      });
    }
  }

  static async submitQuiz(req: AuthRequest, res: Response, _next: NextFunction) {
    try {
      const { answers, timeTaken } = req.body as QuizSubmission;
      const userId = req.user!.id;

      // Get correct answers for submitted questions
  const questionIds = answers.map((answer: QuizAnswer) => answer.questionId);
      const correctAnswers = await QuestionModel.getCorrectAnswers(questionIds);

      // Calculate score
      let correctCount = 0;
      const totalQuestions = answers.length;

  answers.forEach((userAnswer: QuizAnswer) => {
        const correctAnswer = correctAnswers.find(ca => ca.id === userAnswer.questionId);
        if (correctAnswer && correctAnswer.correct_answer === userAnswer.answer) {
          correctCount++;
        }
      });

      const score = Math.round((correctCount / totalQuestions) * 100);

      // Save quiz result
      const quizResult = await QuizResultModel.create({
        user_id: userId,
        score,
        total_questions: totalQuestions,
        time_taken: timeTaken,
        correct_answers: correctCount
      });

  res.status(201).json({
        message: 'Quiz submitted successfully',
        result: {
          score,
          totalQuestions,
          correctAnswers: correctCount,
          timeTaken,
          id: quizResult.id
        }
      });
    } catch (error) {
      console.error('Submit quiz error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to submit quiz'
      });
    }
  }
}