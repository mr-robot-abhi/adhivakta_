import express from 'express';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware';
import {
  createClient,
  getClientProfile,
  updateClientProfile,
  getClientCases,
  searchClients
} from '../controllers/clientController';

const router = express.Router();

// Apply auth middleware to all client routes
router.use(authMiddleware);

// Client creation (admin only)
router.post('/', roleMiddleware(['admin']), createClient);

// Client profile routes
router.get('/:id', roleMiddleware(['admin', 'lawyer', 'client']), getClientProfile);
router.put('/:id', roleMiddleware(['admin', 'client']), updateClientProfile);

// Client cases listing
router.get('/:id/cases', roleMiddleware(['admin', 'lawyer', 'client']), getClientCases);

// Client search (admin/lawyer only)
router.get('/search', roleMiddleware(['admin', 'lawyer']), searchClients);

export default router;