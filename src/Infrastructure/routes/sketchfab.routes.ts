import { Router } from 'express';
import { SketchfabController } from '../controllers/sketchfab.controller';

const router = Router();

router.get('/search', SketchfabController.search);
router.get('/models/:uid/download', SketchfabController.getDownload);
router.get('/models/:uid', SketchfabController.getModel);

export default router;
