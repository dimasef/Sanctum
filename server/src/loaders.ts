import DataLoader from 'dataloader';
import type { PrismaClient } from './generated/prisma/client.js';

function oneToMany<T>(
  fetch: (keys: string[]) => Promise<T[]>,
  keyOf: (row: T) => string,
): DataLoader<string, T[]> {
  return new DataLoader<string, T[]>(async (keys) => {
    const rows = await fetch([...keys]);
    const grouped = new Map<string, T[]>();
    for (const row of rows) {
      const k = keyOf(row);
      const arr = grouped.get(k);
      if (arr) arr.push(row);
      else grouped.set(k, [row]);
    }
    return keys.map((k) => grouped.get(k) ?? []);
  });
}

function toOne<T extends { id: string }>(
  fetch: (ids: string[]) => Promise<T[]>,
): DataLoader<string, T | null> {
  return new DataLoader<string, T | null>(async (ids) => {
    const rows = await fetch([...ids]);
    const byId = new Map(rows.map((r) => [r.id, r]));
    return ids.map((id) => byId.get(id) ?? null);
  });
}

export function createLoaders(prisma: PrismaClient, userId: string | null) {
  return {
    reviewsByBookId: oneToMany(
      (ids) => prisma.review.findMany({ where: { bookId: { in: ids } } }),
      (r) => r.bookId,
    ),
    reviewsByUserId: oneToMany(
      (ids) => prisma.review.findMany({ where: { userId: { in: ids } } }),
      (r) => r.userId,
    ),
    shelvesByUserId: oneToMany(
      (ids) => prisma.shelf.findMany({ where: { userId: { in: ids } } }),
      (s) => s.userId,
    ),
    userById: toOne((ids) => prisma.user.findMany({ where: { id: { in: ids } } })),
    bookById: toOne((ids) => prisma.book.findMany({ where: { id: { in: ids } } })),
    collectionsByUserId: oneToMany(
      (ids) => prisma.collection.findMany({ where: { userId: { in: ids } } }),
      (c) => c.userId,
    ),
    collectionById: toOne((ids) => prisma.collection.findMany({ where: { id: { in: ids } } })),
    itemsByCollectionId: oneToMany(
      (ids) => prisma.collectionItem.findMany({ where: { collectionId: { in: ids } } }),
      (it) => it.collectionId,
    ),
    coverOverrideByBookId: new DataLoader<string, string | null>(async (bookIds) => {
      if (!userId) return bookIds.map(() => null);
      const rows = await prisma.bookCover.findMany({
        where: { userId, bookId: { in: [...bookIds] } },
        select: { bookId: true, coverUrl: true },
      });
      const byBookId = new Map(rows.map((r) => [r.bookId, r.coverUrl]));
      return bookIds.map((id) => byBookId.get(id) ?? null);
    }),
  };
}

export type Loaders = ReturnType<typeof createLoaders>;
