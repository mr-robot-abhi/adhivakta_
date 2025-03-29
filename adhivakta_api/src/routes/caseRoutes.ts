import express from 'express';
import {
  createCase,
  getCases,
  getCaseDetails,
  updateCase,
  addHearing,
  searchCases,
  getCaseTimeline
} from '../controllers/caseController';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Apply auth middleware to all case routes
router.use(authMiddleware);

// Client and lawyer routes
router.get('/', getCases);
router.get('/search', searchCases);
router.get('/:id', getCaseDetails);
router.get('/:id/timeline', getCaseTimeline);

// Client-only routes
router.post('/', roleMiddleware(['client', 'admin']), createCase);
router.put('/:id', roleMiddleware(['client', 'admin']), updateCase);

// Lawyer-only routes
router.patch('/:id/hearings', roleMiddleware(['lawyer', 'admin']), addHearing);

export default router;