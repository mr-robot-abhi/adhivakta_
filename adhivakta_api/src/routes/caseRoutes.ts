import express from 'express';
import {
  createCase,
  getCases,
  getCaseDetails,
  updateCase,
  getCaseStats,
  getUpcomingHearings
} from '../controllers/caseController';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Apply auth middleware to all case routes
router.use(authMiddleware);

// Client and lawyer routes
router.get('/', getCases);
router.get('/stats', getCaseStats);
router.get('/hearings/upcoming', getUpcomingHearings);
router.get('/:id', getCaseDetails);

// Client-only routes
router.post('/', roleMiddleware(['client', 'admin']), createCase);
router.put('/:id', roleMiddleware(['client', 'admin']), updateCase);

export default router;