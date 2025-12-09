import { Router } from 'express';
import { authMiddleware, requireRole } from './auth.js';
import {
  generatePolicyDocument,
  generateInvoiceDocument,
  generateQuoteDocument,
  downloadDocument,
  listUserDocuments,
  deleteDocument,
} from '../core/application/documents.controller.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Generate documents
router.post('/policy/:policyId', requireRole('client', 'admin'), generatePolicyDocument);
router.post('/policy/number/:policyNumber', requireRole('client', 'admin'), generatePolicyDocument);
router.post('/invoice/:paymentId', requireRole('client', 'admin'), generateInvoiceDocument);
router.post('/quote/:quoteId', requireRole('client', 'admin'), generateQuoteDocument);

// Download documents
router.get('/download/:fileId', requireRole('client', 'admin'), downloadDocument);

// List user documents
router.get('/list', requireRole('client', 'admin'), listUserDocuments);

// Delete documents
router.delete('/:fileId', requireRole('client', 'admin'), deleteDocument);

export default router;
