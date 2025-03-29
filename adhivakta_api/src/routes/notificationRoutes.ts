// notificationRoutes.ts
import express from 'express';
import { getUserNotifications, markAsRead } from '../controllers/notificationController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();
router.use(authMiddleware);

router.get('/', getUserNotifications);
router.patch('/:id/read', markAsRead);

export default router;