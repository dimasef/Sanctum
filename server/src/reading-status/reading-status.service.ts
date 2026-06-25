import { prisma } from '../prisma.js';
import type { ReadingStatus, ReadingState } from '../generated/prisma/client.js';

export function setReadingStatus(
  userId: string,
  bookId: string,
  status: ReadingState,
): Promise<ReadingStatus> {
  return prisma.readingStatus.upsert({
    where: { userId_bookId: { userId, bookId } },
    update: { status },
    create: { userId, bookId, status },
  });
}

export async function removeReadingStatus(userId: string, bookId: string): Promise<boolean> {
  await prisma.readingStatus.delete({ where: { userId_bookId: { userId, bookId } } });
  return true;
}
