import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

export const generateToken = (payload: { id: number; email: string }): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): { id: number; email: string } => {
  return jwt.verify(token, JWT_SECRET) as { id: number; email: string };
};