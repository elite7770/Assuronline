import express from 'express';
import { sendQuoteEmail } from './email.controller.js';
import { authMiddleware, requireRole } from '../../shared/auth.js';

const router = express.Router();

// Send email for a specific quote
router.post('/quotes/:quoteId/send', authMiddleware, requireRole('admin'), sendQuoteEmail);

export default router;
