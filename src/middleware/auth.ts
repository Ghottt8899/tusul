import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/security';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = verifyToken(token);
    (req as any).user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
