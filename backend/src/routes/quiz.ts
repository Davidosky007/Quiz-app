import { Router } from 'express';
import { QuizController } from '../controllers/quizController';
import { authenticateToken } from '../middleware/auth';
import { validateQuizSubmission } from '../middleware/validation';

const router = Router();

// All routes are protected
router.use(authenticateToken);

router.get('/start', QuizController.startQuiz);
router.post('/submit', validateQuizSubmission, QuizController.submitQuiz);

export default router;