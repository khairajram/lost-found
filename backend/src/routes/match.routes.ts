import { Router } from 'express';
import {
  getMatches,
  getMatchById,
  acceptMatch,
  rejectMatch,
  submitVerification,
  confirmReturned,
} from '../controllers/match.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getMatches);
router.get('/:id', authenticate, getMatchById);
router.post('/:id/accept', authenticate, acceptMatch);
router.post('/:id/reject', authenticate, rejectMatch);
router.post('/:id/verify', authenticate, submitVerification);
router.post('/:id/returned', authenticate, confirmReturned);

export default router;
