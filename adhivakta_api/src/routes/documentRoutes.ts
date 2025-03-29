import express from 'express';
import { uploadDocument, getCaseDocuments } from '../controllers/documentController';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

router.post('/upload', roleMiddleware(['client', 'lawyer', 'admin']), uploadDocument);
router.get('/case/:caseId', getCaseDocuments);

export default router;