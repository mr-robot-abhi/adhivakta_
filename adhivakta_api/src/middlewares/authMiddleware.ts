import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Authentication attempt without token');
    return res.status(401).json({ message: 'Authentication token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { 
      id: string; 
      role: string;
    };
    req.user = decoded;
    next();
  } catch (error: any) {
    logger.error(`Authentication error: ${error.message}`);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn(
        `Unauthorized access attempt by user ${req.user?.id} to ${req.path}`
      );
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    next();
  };
};