import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Import routes from features
import authRoutes from './features/auth/auth.routes.js';
import profileRoutes from './features/auth/profile.routes.js';
import quotesRoutes from './features/quotes/quotes.routes.js';
import policiesRoutes from './features/policies/policies.routes.js';
import claimsRoutes from './features/claims/claims.routes.js';
import paymentsRoutes from './features/payments/payments.routes.js';
import adminRoutes from './features/admin/admin.routes.js';
import dashboardRoutes from './features/admin/dashboard.routes.js';

// Import shared routes
import notificationsRoutes from './shared/notifications.routes.js';
import documentsRoutes from './shared/documents.routes.js';
import emailRoutes from './shared/email.routes.js';
import settingsRoutes from './shared/settings.routes.js';

// Import middleware
import { notFoundHandler, errorHandler } from './shared/error.js';

// Import database config
import { testDbConnection } from './infrastructure/database/db.js';

dotenv.config();

// Environment variables validation
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);

if (missingEnvVars.length > 0) {
  logger.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
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

// Basic rate limiting (per IP) - generous for SPA with parallel requests
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 req/15min per IP — SPA fires many parallel requests on load
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
    },
    skip: (req) => req.path === '/api/v1/health' || req.path === '/health',
  })
);

const apiV1 = '/api/v1';

// Health check endpoint
app.get(`${apiV1}/health`, async (req, res) => {
  try {
    const now = await testDbConnection();
    res.json({ status: 'OK', timestamp: Date.now(), dbTime: now });
  } catch {
    res.status(500).json({ status: 'ERROR', message: 'DB connection failed' });
  }
});

// Legacy health endpoint
app.get('/health', async (req, res) => {
  try {
    const now = await testDbConnection();
    res.json({ status: 'OK', timestamp: Date.now(), dbTime: now });
  } catch {
    res.status(500).json({ status: 'ERROR', message: 'DB connection failed' });
  }
});

// Feature-based routes
app.use(`${apiV1}/auth`, authRoutes);
app.use(`${apiV1}/profile`, profileRoutes);
app.use(`${apiV1}/quotes`, quotesRoutes);
app.use(`${apiV1}/policies`, policiesRoutes);
app.use(`${apiV1}/claims`, claimsRoutes);
app.use(`${apiV1}/payments`, paymentsRoutes);
app.use(`${apiV1}/admin`, adminRoutes);
app.use(`${apiV1}/dashboard`, dashboardRoutes);

// Shared routes
app.use(`${apiV1}/notifications`, notificationsRoutes);
app.use(`${apiV1}/documents`, documentsRoutes);
app.use(`${apiV1}/email`, emailRoutes);
app.use(`${apiV1}/settings`, settingsRoutes);

// Swagger UI setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const openApiPath = path.join(__dirname, 'openapi.json');

try {
  const swaggerUi = await import('swagger-ui-express');
  const fs = await import('fs');

  let openApiDocument = null;
  try {
    const raw = fs.readFileSync(openApiPath, 'utf-8');
    openApiDocument = JSON.parse(raw);
  } catch { }

  if (openApiDocument) {
    app.use('/api/docs', swaggerUi.default.serve, swaggerUi.default.setup(openApiDocument));
    app.use(`${apiV1}/docs`, swaggerUi.default.serve, swaggerUi.default.setup(openApiDocument));
  }
} catch (error) {
  logger.warn('Swagger UI not available:', error.message);
}

// Custom Logger
import logger from './shared/logger.js';

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  logger.info(`🚀 AssurOnline Backend running on http://localhost:${port}`);
  logger.info(`📚 API Documentation: http://localhost:${port}/api/docs`);
});

export default app;
