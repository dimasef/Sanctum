import { prisma } from './prisma.js';

export interface Context {
  prisma: typeof prisma;
}

export function createContext(): Context {
  return { prisma };
}
