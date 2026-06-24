import { GraphQLError } from 'graphql';
import { prisma } from '../prisma.js';
import type { Shelf } from '../generated/prisma/client.js';
import { isValidColor, isValidIcon } from './constants.js';

function assertValid(color?: string | null, icon?: string | null): void {
  if (color !== undefined && color !== null && !isValidColor(color)) {
    throw new GraphQLError('Unsupported shelf color', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
  if (icon !== undefined && icon !== null && !isValidIcon(icon)) {
    throw new GraphQLError('Unsupported shelf icon', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
}

async function requireOwnedShelf(userId: string, shelfId: string): Promise<Shelf> {
  const shelf = await prisma.shelf.findFirst({ where: { id: shelfId, userId } });
  if (!shelf) {
    throw new GraphQLError('Shelf not found', { extensions: { code: 'NOT_FOUND' } });
  }
  return shelf;
}

function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
}

export async function createShelf(
  userId: string,
  name: string,
  color: string,
  icon: string,
): Promise<Shelf> {
  assertValid(color, icon);
  try {
    return await prisma.shelf.create({ data: { userId, name, color, icon } });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new GraphQLError('A shelf with that name already exists', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    throw error;
  }
}

export async function updateShelf(
  userId: string,
  shelfId: string,
  input: { name?: string; color?: string; icon?: string },
): Promise<Shelf> {
  await requireOwnedShelf(userId, shelfId);
  assertValid(input.color, input.icon);

  const data: { name?: string; color?: string; icon?: string } = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.color !== undefined) data.color = input.color;
  if (input.icon !== undefined) data.icon = input.icon;

  try {
    return await prisma.shelf.update({ where: { id: shelfId }, data });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new GraphQLError('A shelf with that name already exists', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    throw error;
  }
}

export async function deleteShelf(userId: string, shelfId: string): Promise<boolean> {
  await requireOwnedShelf(userId, shelfId);
  await prisma.shelf.delete({ where: { id: shelfId } });
  return true;
}

export async function addBookToShelf(
  userId: string,
  shelfId: string,
  bookId: string,
): Promise<Shelf> {
  const shelf = await requireOwnedShelf(userId, shelfId);
  try {
    await prisma.shelfBook.create({ data: { shelfId, bookId } });
  } catch (error) {
    if (!isUniqueViolation(error)) throw error;
  }
  return shelf;
}

export async function removeBookFromShelf(
  userId: string,
  shelfId: string,
  bookId: string,
): Promise<Shelf> {
  const shelf = await requireOwnedShelf(userId, shelfId);
  await prisma.shelfBook
    .delete({ where: { shelfId_bookId: { shelfId, bookId } } })
    .catch(() => undefined);
  return shelf;
}
