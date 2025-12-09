import { Router } from 'express';
import { authMiddleware, requireRole } from './auth.js';
import {
  listNotifications,
  markRead,
  adminBroadcast,
} from '../core/application/notifications.controller.js';

const router = Router();

router.get('/', authMiddleware, requireRole('client', 'admin'), listNotifications);
router.post('/:id/read', authMiddleware, requireRole('client', 'admin'), markRead);

router.post('/admin/broadcast', authMiddleware, requireRole('admin'), adminBroadcast);

export default router;
