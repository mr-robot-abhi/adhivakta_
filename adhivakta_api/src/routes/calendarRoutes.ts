import express from 'express';
import { getCalendarEvents } from '../controllers/calendarController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();
router.use(authMiddleware);

router.get('/', getCalendarEvents);

export default router;