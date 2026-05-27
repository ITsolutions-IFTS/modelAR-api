import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import * as CampaignsController from '../controllers/campaigns.controller';
import * as AnalyticsController from '../controllers/analytics.controller';

const router = Router();

router.get('/', authMiddleware, CampaignsController.list);
router.get('/:id/analytics', authMiddleware, AnalyticsController.getCampaignAnalytics); // Must come before /:id
router.get('/:id/public', CampaignsController.getPublic); // Public route — must come before /:id
router.get('/:id', authMiddleware, CampaignsController.getById);
router.post('/', authMiddleware, CampaignsController.create);
router.patch('/:id', authMiddleware, CampaignsController.update);
router.delete('/:id', authMiddleware, CampaignsController.remove);

export default router;
