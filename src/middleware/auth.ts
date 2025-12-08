import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/security';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header('Authorization');
  const token = header?.replace(/^Bearer\s+/, '');
  if (!token) return res.status(401).json({ message: 'No token' });

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ message: 'Invalid token' });

  // ✅ payload баталгаажсан тохиолдолд л user-г тохируулна
  (req as any).user = { id: payload.sub, role: payload.role };
  next();
}
