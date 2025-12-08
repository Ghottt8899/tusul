import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export async function hashPassword(p: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(p, salt);
}
export async function verifyPassword(p: string, hashed: string) {
  return bcrypt.compare(p, hashed);
}
export function signToken(sub: string, role = 'user') {
  const expSec = config.jwtExpiresMin * 60;
  return jwt.sign({ sub, role }, config.jwtSecret, { expiresIn: expSec });
}
export function verifyToken(t: string) {
  return jwt.verify(t, config.jwtSecret) as { sub: string; role: string };
}
