import { GraphQLError } from 'graphql';
import { prisma } from '../prisma.js';
import type { Review } from '../generated/prisma/client.js';

export function upsertReview(
  userId: string,
  bookId: string,
  rating: number,
  body?: string | null,
): Promise<Review> {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new GraphQLError('Rating must be an integer between 1 and 5', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
  return prisma.review.upsert({
    where: { userId_bookId: { userId, bookId } },
    update: { rating, body: body ?? null },
    create: { userId, bookId, rating, body: body ?? null },
  });
}

export async function deleteReview(userId: string, bookId: string): Promise<boolean> {
  await prisma.review.delete({ where: { userId_bookId: { userId, bookId } } });
  return true;
}
