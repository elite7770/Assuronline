import { Router } from 'express';
import { authMiddleware } from '../../shared/auth.js';
import { getClientDashboard } from '../../core/application/dashboard.controller.js';

const router = Router();

router.use(authMiddleware);

// Client self dashboard
router.get('/me', getClientDashboard);

export default router;
