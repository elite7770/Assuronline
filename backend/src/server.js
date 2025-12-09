import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { notFoundHandler, errorHandler } from './shared/error.js';
import dotenv from 'dotenv';
import authRoutes from './features/auth/auth.routes.js';
import profileRoutes from './features/auth/profile.routes.js';
import settingsRoutes from './shared/settings.routes.js';
import { testDbConnection } from './infrastructure/database/db.js';
import policiesRoutes from './features/policies/policies.routes.js';
import claimsRoutes from './features/claims/claims.routes.js';
import paymentsRoutes from './features/payments/payments.routes.js';
import notificationsRoutes from './shared/notifications.routes.js';
import documentsRoutes from './shared/documents.routes.js';
import adminRoutes from './features/admin/admin.routes.js';
import dashboardRoutes from './features/admin/dashboard.routes.js';
import quotesRoutes from './features/quotes/quotes.routes.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Import new email and PDF routes
import emailQuoteRoutes from './features/email/email.routes.js';
import pdfRoutes from './features/pdf/pdf.routes.js';

dotenv.config();

// Environment variables validation
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const app = express();

// Security middlewares
app.use(helmet());

const corsWhitelist = (process.env.CORS_ORIGINS || '').split(',').filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (corsWhitelist.length === 0 || corsWhitelist.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json());

// Basic rate limiting (per IP) - more generous for dashboard usage
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Increased from 100 to 200 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: '15 minutes'
    },
    // Skip rate limiting for health checks
    skip: (req) => req.path === '/api/v1/health'
  })
);

// More lenient rate limiting for dashboard endpoints
const dashboardRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // 50 requests per 5 minutes for dashboard
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Dashboard rate limit exceeded',
    message: 'Too many dashboard requests. Please wait a moment before refreshing.',
    retryAfter: '5 minutes'
  }
});

const apiV1 = '/api/v1';

app.get(`${apiV1}/health`, async (req, res) => {
  try {
    const now = await testDbConnection();
    res.json({ status: 'OK', timestamp: Date.now(), dbTime: now });
  } catch {
    res.status(500).json({ status: 'ERROR', message: 'DB connection failed' });
  }
});

// Temporary legacy health endpoint (can be removed later)
app.get('/health', async (req, res) => {
  try {
    const now = await testDbConnection();
    res.json({ status: 'OK', timestamp: Date.now(), dbTime: now });
  } catch {
    res.status(500).json({ status: 'ERROR', message: 'DB connection failed' });
  }
});

app.use(`${apiV1}/auth`, authRoutes);
app.use(`${apiV1}/profile`, profileRoutes);
app.use(`${apiV1}/settings`, settingsRoutes);
app.use(`${apiV1}/policies`, policiesRoutes);
app.use(`${apiV1}/claims`, claimsRoutes);
app.use(`${apiV1}/payments`, paymentsRoutes);
app.use(`${apiV1}/notifications`, notificationsRoutes);
app.use(`${apiV1}/documents`, documentsRoutes);
app.use(`${apiV1}/admin`, dashboardRateLimit, adminRoutes);
app.use(`${apiV1}/dashboard`, dashboardRoutes);
app.use(`${apiV1}/quotes`, quotesRoutes);

// Register new email and PDF routes
app.use(`${apiV1}/email`, emailQuoteRoutes);
app.use(`${apiV1}/pdf`, pdfRoutes);

// Swagger UI for OpenAPI docs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const openApiPath = path.join(__dirname, 'openapi.json');
let openApiDocument = null;
try {
  const raw = fs.readFileSync(openApiPath, 'utf-8');
  openApiDocument = JSON.parse(raw);
} catch {}
if (openApiDocument) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.use(`${apiV1}/docs`, swaggerUi.serve, swaggerUi.setup(openApiDocument));
}

// 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
