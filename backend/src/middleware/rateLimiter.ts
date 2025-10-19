// Rate Limiter Middleware
// Add this to backend/src/middleware/rateLimiter.ts

import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// Stricter limiter for code analysis (resource intensive)
export const analysisLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit to 10 analysis requests per minute
  message: 'Too many analysis requests, please try again later.',
});

// Usage in index.ts:
// app.use('/api/', apiLimiter);
// app.use('/auth/', authLimiter);
// app.post('/api/analyze', analysisLimiter, async (req, res) => { ... });
