import { Router } from 'express';
import { authMiddleware, requireRole } from '../../shared/auth.js';
import {
  getQuoteEstimate,
  createNewQuote,
  getUserQuotes,
  getQuoteById,
  getQuoteByNumber,
  updateQuote,
  getAllQuotes,
  getQuoteStats,
  deleteQuoteById,
  getVehicleBrands,
  getVehicleModels,
  getMoroccanCities,
} from '../../core/application/quotes.controller.js';

const router = Router();

// Public routes (no authentication required)
router.post('/estimate', getQuoteEstimate);
router.post('/create-public', createNewQuote); // Public quote creation
router.get('/brands/:type', getVehicleBrands);
router.get('/models/:type/:brand', getVehicleModels);
router.get('/cities', getMoroccanCities);

// Protected routes (authentication required)
router.use(authMiddleware);

// User routes
router.post('/create', createNewQuote);
router.get('/my-quotes', getUserQuotes);
router.get('/number/:quoteNumber', getQuoteByNumber);
router.get('/:id', getQuoteById);
router.delete('/:id', deleteQuoteById);

// Admin routes
router.get('/admin/all', requireRole('admin'), getAllQuotes);
router.get('/admin/stats', requireRole('admin'), getQuoteStats);
router.put('/admin/:id', requireRole('admin'), updateQuote);

export default router;
