import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register',(authController.register))
router.post('/login', (authController.login));
router.post('/refresh-token', (authController.refreshToken));
router.get('/user', authMiddleware, authController.get);

export default router