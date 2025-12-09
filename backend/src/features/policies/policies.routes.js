import { Router } from 'express';
import { authMiddleware, requireRole } from '../../shared/auth.js';
import {
  createPolicy,
  listPolicies,
  getPolicy,
  getPolicyByNumber,
  updatePolicyDetails,
  cancelPolicyRequest,
  renewPolicyRequest,
  getActivePolicies,
  getExpiringPolicies,
  getPolicyStats,
  getPolicyDocuments,
} from '../../core/application/policies.controller.js';

const router = Router();

// Client routes
router.get('/', authMiddleware, requireRole('client', 'admin'), listPolicies);
router.get('/active', authMiddleware, requireRole('client', 'admin'), getActivePolicies);
router.get('/expiring', authMiddleware, requireRole('client', 'admin'), getExpiringPolicies);
router.get('/statistics', authMiddleware, requireRole('admin'), getPolicyStats);
router.get('/stats', authMiddleware, requireRole('admin'), getPolicyStats);
router.get('/:id', authMiddleware, requireRole('client', 'admin'), getPolicy);
router.get(
  '/number/:policyNumber',
  authMiddleware,
  requireRole('client', 'admin'),
  getPolicyByNumber
);
router.get('/:id/documents', authMiddleware, requireRole('client', 'admin'), getPolicyDocuments);
router.put('/:id', authMiddleware, requireRole('client', 'admin'), updatePolicyDetails);
router.post('/:id/cancel', authMiddleware, requireRole('client', 'admin'), cancelPolicyRequest);
router.post('/:id/renew', authMiddleware, requireRole('client', 'admin'), renewPolicyRequest);

// Admin routes
router.post('/', authMiddleware, requireRole('admin'), createPolicy);

export default router;
