import { Request, Response, NextFunction } from 'express';
import { verifyToken, AuthPayload } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Skip auth for OPTIONS preflight requests
  if (req.method === 'OPTIONS') {
    return next();
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token' });
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const requireRole = (requiredRole: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ error: `Forbidden: Requires ${requiredRole} role` });
    }
    next();
  };
};
