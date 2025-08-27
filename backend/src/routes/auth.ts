import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { asyncHandler } from '../utils/asyncHandler';
import { validateRegister, validateLogin } from '../middleware/validation';

const router = Router();

router.post('/register', validateRegister, asyncHandler(AuthController.register));
router.post('/login', validateLogin, asyncHandler(AuthController.login));

export default router;