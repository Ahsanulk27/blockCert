import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    console.log("🔑 Auth header:", authHeader);   //  log header

    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      console.log("❌ No token found in header");
      return res.status(401).json({ error: 'Access token is required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    console.log("📥 Decoded token:", decoded);   //  log payload

    const user = await prisma.issuer.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true }
    });
    console.log("👤 User found:", user);         //  log DB lookup result

    if (!user) {
      console.log("❌ No user found for token ID:", decoded.id);
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("⚠️ Token verification error:", err);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

