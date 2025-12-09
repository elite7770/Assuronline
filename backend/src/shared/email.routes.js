import { Router } from 'express';
import { authMiddleware, requireRole } from './auth.js';
import {
  sendQuoteCreatedEmail,
  sendQuoteApprovedEmail,
  sendPolicyCreatedEmail,
  sendPaymentReminderEmail,
  sendCustomEmail,
  sendBulkEmails,
  verifyEmailConfiguration,
  getEmailTemplates,
} from '../features/email/email.controller.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Email verification (public for testing)
router.get('/verify', verifyEmailConfiguration);

// Get email templates
router.get('/templates', getEmailTemplates);

// Send specific emails
router.post('/quote/:quoteId/created', requireRole('client', 'admin'), sendQuoteCreatedEmail);
router.post('/quote/:quoteId/approved', requireRole('client', 'admin'), sendQuoteApprovedEmail);
router.post('/policy/:policyId/created', requireRole('client', 'admin'), sendPolicyCreatedEmail);
router.post(
  '/payment/:paymentId/reminder',
  requireRole('client', 'admin'),
  sendPaymentReminderEmail
);

// Custom and bulk emails (admin only)
router.post('/custom', requireRole('admin'), sendCustomEmail);
router.post('/bulk', requireRole('admin'), sendBulkEmails);

export default router;
