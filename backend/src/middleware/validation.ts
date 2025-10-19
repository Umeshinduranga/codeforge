// Input Validation Middleware
// Add this to backend/src/middleware/validation.ts

import { Request, Response, NextFunction } from 'express';

export const validateCodeAnalysis = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      message: 'Code is required',
      field: 'code',
    });
  }

  if (typeof code !== 'string') {
    return res.status(400).json({
      message: 'Code must be a string',
      field: 'code',
    });
  }

  // Limit code size to 1MB
  if (code.length > 1000000) {
    return res.status(400).json({
      message: 'Code is too large (max 1MB)',
      field: 'code',
    });
  }

  next();
};

export const validateGitHubPush = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { repo, branch, filePath, content, message } = req.body;

  const errors: string[] = [];

  if (!repo || typeof repo !== 'string') {
    errors.push('repo is required and must be a string');
  }

  if (!branch || typeof branch !== 'string') {
    errors.push('branch is required and must be a string');
  }

  if (!filePath || typeof filePath !== 'string') {
    errors.push('filePath is required and must be a string');
  }

  if (!content || typeof content !== 'string') {
    errors.push('content is required and must be a string');
  }

  if (!message || typeof message !== 'string') {
    errors.push('message is required and must be a string');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

export const validateBranchName = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { branch } = req.body;

  if (!branch) {
    return res.status(400).json({
      message: 'Branch name is required',
    });
  }

  // GitHub branch name rules
  const branchRegex = /^[a-zA-Z0-9._\/-]+$/;
  if (!branchRegex.test(branch)) {
    return res.status(400).json({
      message: 'Invalid branch name. Use only letters, numbers, -, _, ., /',
    });
  }

  // Reserved names
  const reserved = ['HEAD', 'refs', 'remotes'];
  if (reserved.some(r => branch.startsWith(r))) {
    return res.status(400).json({
      message: `Branch name cannot start with: ${reserved.join(', ')}`,
    });
  }

  next();
};
