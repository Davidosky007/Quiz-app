import { Router } from 'express';
import { QuestionsController } from '../controllers/questionsController';
import { authenticateToken } from '../middleware/auth';
import { validateQuestion } from '../middleware/validation';

const router = Router();

// All routes are protected
router.use(authenticateToken);

router.get('/', QuestionsController.getAll);
router.post('/', validateQuestion, QuestionsController.create);
router.put('/:id', validateQuestion, QuestionsController.update);
router.delete('/:id', QuestionsController.delete);

export default router;