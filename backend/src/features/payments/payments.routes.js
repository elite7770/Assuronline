import { Router } from 'express';
import { authMiddleware, requireRole } from '../../shared/auth.js';
import {
  createPaymentIntent,
  confirmPaymentAndInvoice,
  adminUpdatePaymentStatus,
  getInvoice,
  getPayments,
  getAllPayments,
  getPaymentStatistics,
  getPendingPayments,
  getOverduePayments,
  getMonthlyRevenue,
} from '../../core/application/payments.controller.js';

const router = Router();

// client
router.get('/', authMiddleware, requireRole('client', 'admin'), getPayments);
router.post('/', authMiddleware, requireRole('client', 'admin'), createPaymentIntent);
router.post(
  '/:id/confirm',
  authMiddleware,
  requireRole('client', 'admin'),
  confirmPaymentAndInvoice
);
router.get('/:id/invoice', authMiddleware, requireRole('client', 'admin'), getInvoice);

// admin
router.get('/all', authMiddleware, requireRole('admin'), getAllPayments);
router.get('/stats', authMiddleware, requireRole('admin'), getPaymentStatistics);
router.get('/pending', authMiddleware, requireRole('admin'), getPendingPayments);
router.get('/overdue', authMiddleware, requireRole('admin'), getOverduePayments);
router.get('/revenue/monthly', authMiddleware, requireRole('admin'), getMonthlyRevenue);
router.patch('/admin/:id', authMiddleware, requireRole('admin'), adminUpdatePaymentStatus);

export default router;
