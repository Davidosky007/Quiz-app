import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import logger from './utils/logger';

import authRoutes from './routes/auth';
import questionsRoutes from './routes/questions';
import quizRoutes from './routes/quiz';
import { errorHandler, notFound } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || '/api';

// Security middleware
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Basic rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration (strict)
function normalizeOrigin(val: string): string | null {
  try {
    const u = new URL(val);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    return `${u.protocol}//${u.host}`.toLowerCase();
  } catch {
    return null;
  }
}

const rawOrigins: string[] = [
  ...(process.env.FRONTEND_URLS ? process.env.FRONTEND_URLS.split(',') : []),
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:5173'] : []),
].map(s => s.trim()).filter(Boolean);

const allowedOriginsSet = new Set(
  rawOrigins
    .map(normalizeOrigin)
    .filter((v): v is string => Boolean(v))
);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      // In production, block requests with no Origin (e.g., curl) to reduce attack surface
      if (process.env.NODE_ENV === 'production') {
        logger.warn('CORS blocked request with no Origin header');
        return callback(new Error('Not allowed by CORS'));
      }
      return callback(null, true);
    }
    const normalized = origin.toLowerCase();
    if (allowedOriginsSet.has(normalized)) return callback(null, true);
    logger.warn(`CORS blocked origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: false, // no cookies required; tokens are in Authorization header
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/questions`, questionsRoutes);
app.use(`${API_PREFIX}/quiz`, quizRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
  logger.info(`Frontend URL: ${process.env.FRONTEND_URL}`);
  if (allowedOriginsSet.size) {
    logger.info(`CORS allowed origins: ${Array.from(allowedOriginsSet).join(', ')}`);
  }
});

// Graceful shutdown
const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];
signals.forEach((sig) => {
  process.on(sig, () => {
    logger.info(`Received ${sig}, shutting down gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
    // Force close after timeout
    setTimeout(() => {
      logger.error('Forcing shutdown');
      process.exit(1);
    }, 10000).unref();
  });
});

export default app;