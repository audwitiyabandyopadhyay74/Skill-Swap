import express from 'express';
import { getSessions, createSession, updateSessionStatus, addMessage as sendMessage } from '../controllers/sessionController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getSessions);
router.post('/', createSession);
router.patch('/:id', updateSessionStatus);
router.post('/:id/messages', sendMessage);

export default router;
