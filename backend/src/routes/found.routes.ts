import { Router } from 'express';
import {
  createFoundItem,
  getAllFoundItems,
  getFoundItemById,
  deleteFoundItem,
} from '../controllers/found.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllFoundItems);
router.post('/', authenticate, createFoundItem);
router.get('/:id', getFoundItemById);
router.delete('/:id', authenticate, deleteFoundItem);

export default router;
