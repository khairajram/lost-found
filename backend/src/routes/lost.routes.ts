import { Router } from 'express';
import {
  createLostItem,
  getAllLostItems,
  getLostItemById,
  deleteLostItem,
} from '../controllers/lost.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllLostItems);
router.post('/', authenticate, createLostItem);
router.get('/:id', getLostItemById);
router.delete('/:id', authenticate, deleteLostItem);

export default router;
