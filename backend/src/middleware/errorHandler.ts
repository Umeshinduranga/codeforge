// Global Error Handler Middleware
// Add this to backend/src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  message: string;
  error?: string;
  stack?: string;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
  });

  const response: ErrorResponse = {
    message: 'An error occurred',
  };

  // Don't expose error details in production
  if (process.env.NODE_ENV === 'development') {
    response.error = err.message;
    response.stack = err.stack;
  }

  res.status(500).json(response);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
