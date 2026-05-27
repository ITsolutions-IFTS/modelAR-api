import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import * as CollectionsController from '../controllers/collections.controller';

const router = Router();

router.get('/', authMiddleware, CollectionsController.list);
router.post('/', authMiddleware, CollectionsController.create);
router.patch('/:id', authMiddleware, CollectionsController.update);
router.delete('/:id', authMiddleware, CollectionsController.remove);

export default router;
