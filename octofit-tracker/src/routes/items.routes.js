import { Router } from 'express';
import {
  getItemsController,
  getItemByIdController,
  createItemController,
} from '../controllers/items.controller.js';

const router = Router();

router.get('/', getItemsController);
router.get('/:id', getItemByIdController);
router.post('/', createItemController);

export default router;
