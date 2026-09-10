import express from 'express';
import { getConversations, getMessagesWithUser, sendDirectMessage } from '../controllers/messageController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/conversations', getConversations);
router.get('/:partnerId', getMessagesWithUser);
router.post('/:partnerId', sendDirectMessage);

export default router;
