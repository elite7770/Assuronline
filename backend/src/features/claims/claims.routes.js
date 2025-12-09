import { Router } from 'express';
import { authMiddleware, requireRole } from '../../shared/auth.js';
import {
  createClaim,
  editClaim,
  listClaims,
  reviewClaim,
  approveClaim,
  rejectClaim,
  settleClaim,
} from '../../core/application/claims.controller.js';

const router = Router();

// client
router.post('/', authMiddleware, requireRole('client', 'admin'), createClaim);
router.patch('/:id', authMiddleware, requireRole('client', 'admin'), editClaim);
router.get('/', authMiddleware, requireRole('client', 'admin'), listClaims);

// admin
router.post('/admin/:id/review', authMiddleware, requireRole('admin'), reviewClaim);
router.post('/admin/:id/approve', authMiddleware, requireRole('admin'), approveClaim);
router.post('/admin/:id/reject', authMiddleware, requireRole('admin'), rejectClaim);
router.post('/admin/:id/settle', authMiddleware, requireRole('admin'), settleClaim);

export default router;
