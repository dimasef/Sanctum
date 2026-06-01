import crypto from 'node:crypto';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { config } from '../config.js';

export interface TokenPayload {
  userId: string;
}

export function signAccessToken(userId: string): string {
  const options: SignOptions = {
    expiresIn: config.jwt.accessTtl as SignOptions['expiresIn'],
    jwtid: crypto.randomUUID(),
  };
  return jwt.sign({ userId }, config.jwt.accessSecret, options);
}

export function signRefreshToken(userId: string): string {
  const options: SignOptions = {
    expiresIn: config.jwt.refreshTtl as SignOptions['expiresIn'],
    jwtid: crypto.randomUUID(),
  };
  return jwt.sign({ userId }, config.jwt.refreshSecret, options);
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwt.accessSecret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
}

export function getExpiryDate(token: string): Date {
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded === 'string' || decoded.exp === undefined) {
    throw new Error('Token has no expiry claim');
  }
  return new Date(decoded.exp * 1000);
}
