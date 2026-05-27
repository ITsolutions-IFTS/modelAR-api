import { Router } from 'express';
import * as EventsController from '../controllers/events.controller';

const router = Router();

router.post('/', EventsController.track);

export default router;
