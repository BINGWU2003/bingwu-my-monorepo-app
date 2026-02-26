import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ code: 401, message: '未授权', data: null });
    return;
  }

  try {
    const token = authHeader.slice(7);
    const payload = verifyToken(token);
    req.user = { id: payload.userId, role: payload.role };
    next();
  } catch {
    res.status(401).json({ code: 401, message: 'Token 无效或已过期', data: null });
  }
}
