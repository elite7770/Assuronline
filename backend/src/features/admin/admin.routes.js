import { Router } from 'express';
import { authMiddleware, requireRole } from '../../shared/auth.js';
import {
  getPolicyManagement,
  getPaymentManagement,
  getCustomerManagement,
  getClaimManagement,
  getReports,
  getSystemSettings,
  updateSystemSettings,
  resetSystemSettings,
  getDashboardOverview,
  updateUserStatus,
  getUserById,
  deleteUser,
  sendEmailToCustomer,
} from '../../core/application/admin.controller.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(requireRole('admin'));

// Management sections
router.get('/policies', getPolicyManagement);
router.get('/payments', getPaymentManagement);

// Admin actions
router.post('/send-email', sendEmailToCustomer);
router.get('/claims', getClaimManagement);

// Dashboard overview
router.get('/dashboard', getDashboardOverview);

// Reports
router.get('/reports', getReports);

// System settings
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);
router.post('/settings/reset', resetSystemSettings);

// User management
router.get('/customers', getCustomerManagement);
router.get('/users/:id', getUserById);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

export default router;
