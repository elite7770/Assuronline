import express from 'express';
import { generateQuotePDF } from './pdf.controller.js';
import { authMiddleware, requireRole } from '../../shared/auth.js';

const router = express.Router();

// Generate PDF for a specific quote
router.get('/quotes/:quoteId/pdf', authMiddleware, requireRole('admin'), generateQuotePDF);

export default router;
