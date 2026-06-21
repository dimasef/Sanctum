import type { Request } from 'express';
import { prisma } from './prisma.js';
import { verifyAccessToken } from './auth/tokens.js';
import { createLoaders, type Loaders } from './loaders.js';

export interface Context {
  prisma: typeof prisma;
  userId: string | null;
  loaders: Loaders;
}

function extractUserId(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;

  const token = header.slice('Bearer '.length);
  try {
    return verifyAccessToken(token).userId;
  } catch {
    // Invalid or expired token → treat as anonymous, don't crash the request.
    return null;
  }
}

export function createContext(req: Request): Context {
  const userId = extractUserId(req);
  return {
    prisma,
    userId,
    loaders: createLoaders(prisma, userId),
  };
}
