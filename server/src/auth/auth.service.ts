import crypto from 'node:crypto';
import { GraphQLError } from 'graphql';
import { prisma } from '../prisma.js';
import type { User, Prisma } from '../generated/prisma/client.js';
import { hashPassword, verifyPassword } from './password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken, getExpiryDate } from './tokens.js';

interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Refresh tokens are high-entropy, so a fast hash (SHA-256) is enough here —
// unlike passwords, which need a slow hash(argon2).
function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Issues a new token pair and persists the refresh token (hashed) for revocation.
async function issueTokens(user: User, db: Prisma.TransactionClient = prisma): Promise<AuthResult> {
  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  await db.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: getExpiryDate(refreshToken),
    },
  });

  return { accessToken, refreshToken, user };
}

export async function register(input: {
  email: string;
  password: string;
  name: string;
}): Promise<AuthResult> {
  if (input.password.length < 8) {
    throw new GraphQLError('Password must be at least 8 characters', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing) {
    throw new GraphQLError('Email already in use', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash: await hashPassword(input.password),
    },
  });

  return issueTokens(user);
}

export async function login(input: { email: string; password: string }): Promise<AuthResult> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });
  // Same error whether the email is unknown or the password is wrong —
  // do not reveal which one, to avoid user enumeration.
  const invalid = new GraphQLError('Invalid email or password', {
    extensions: { code: 'UNAUTHENTICATED' },
  });
  if (!user) throw invalid;

  const ok = await verifyPassword(user.passwordHash, input.password);
  if (!ok) throw invalid;

  return issueTokens(user);
}

export async function refresh(token: string): Promise<AuthResult> {
  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new GraphQLError('Invalid refresh token', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });
  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new GraphQLError('Refresh token is no longer valid', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  // Rotation: revoke the used refresh token before issuing a new pair.
  return prisma.$transaction(async (tx) => {
    await tx.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });
    const user = await tx.user.findUniqueOrThrow({ where: { id: payload.userId } });
    return issueTokens(user, tx);
  });
}

export async function logout(token: string): Promise<boolean> {
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashToken(token), revokedAt: null },
    data: { revokedAt: new Date() },
  });
  return true;
}
