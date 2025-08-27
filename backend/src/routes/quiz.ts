import { Router } from 'express';
import { QuizController } from '../controllers/quizController';
import { authenticateToken } from '../middleware/auth';
import { validateQuizSubmission } from '../middleware/validation';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All routes are protected
router.use(authenticateToken);

router.get('/start', asyncHandler(QuizController.startQuiz));
router.post('/submit', validateQuizSubmission, asyncHandler(QuizController.submitQuiz));

export default router;