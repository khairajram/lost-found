import { Router } from 'express';
import {
  getConversations,
  getOrCreateMatchConversation,
  getMessages,
  sendMessage,
} from '../controllers/chat.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getConversations);
router.get('/match/:matchId', authenticate, getOrCreateMatchConversation);
router.get('/:id/messages', authenticate, getMessages);
router.post('/:id/messages', authenticate, sendMessage);

export default router;
