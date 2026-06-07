import { prisma } from '../prisma.js';
import type { Shelf, ShelfStatus } from '../generated/prisma/client.js';

export function addToShelf(userId: string, bookId: string, status: ShelfStatus): Promise<Shelf> {
  return prisma.shelf.create({ data: { userId, bookId, status } });
}

export function moveOnShelf(userId: string, bookId: string, status: ShelfStatus): Promise<Shelf> {
  return prisma.shelf.update({
    where: { userId_bookId: { userId, bookId } },
    data: { status },
  });
}

export async function removeFromShelf(userId: string, bookId: string): Promise<boolean> {
  await prisma.shelf.delete({ where: { userId_bookId: { userId, bookId } } });
  return true;
}
