import express from 'express';
import { authMiddleware as authenticate } from './auth.js';
import {
  getSettings,
  updateSettings,
  updateCategory,
  resetSettings,
  getDefaultSettings
} from '../core/application/settings.controller.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// GET /api/v1/settings - Get user settings
router.get('/', getSettings);

// PUT /api/v1/settings - Update user settings
router.put('/', updateSettings);

// PUT /api/v1/settings/:category - Update specific category
router.put('/:category', updateCategory);

// POST /api/v1/settings/reset - Reset settings to default
router.post('/reset', resetSettings);

// GET /api/v1/settings/default - Get default settings
router.get('/default', getDefaultSettings);

export default router;

