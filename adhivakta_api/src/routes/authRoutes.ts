import express from 'express';
import {
  signup,
  login,
  getProfile,
  refreshToken,
  socialLogin
} from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/social', socialLogin); // New route

// Protected routes remain unchanged...
router.get('/profile', authMiddleware, getProfile);
router.post('/refresh-token', authMiddleware, refreshToken);

export default router;