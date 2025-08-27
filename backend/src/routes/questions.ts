import { Router } from 'express';
import { QuestionsController } from '../controllers/questionsController';
import { authenticateToken } from '../middleware/auth';
import { validateQuestion } from '../middleware/validation';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All routes are protected
router.use(authenticateToken);

router.get('/', asyncHandler(QuestionsController.getAll));
router.post('/', validateQuestion, asyncHandler(QuestionsController.create));
router.put('/:id', validateQuestion, asyncHandler(QuestionsController.update));
router.delete('/:id', asyncHandler(QuestionsController.delete));

export default router;