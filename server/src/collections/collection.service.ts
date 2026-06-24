import { GraphQLError } from 'graphql';
import { prisma } from '../prisma.js';
import type { Collection } from '../generated/prisma/client.js';
import { isValidColor, isValidIcon } from './constants.js';

function assertValid(color?: string | null, icon?: string | null): void {
  if (color !== undefined && color !== null && !isValidColor(color)) {
    throw new GraphQLError('Unsupported collection color', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
  if (icon !== undefined && icon !== null && !isValidIcon(icon)) {
    throw new GraphQLError('Unsupported collection icon', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
}

async function requireOwnedCollection(userId: string, collectionId: string): Promise<Collection> {
  const collection = await prisma.collection.findFirst({ where: { id: collectionId, userId } });
  if (!collection) {
    throw new GraphQLError('Collection not found', { extensions: { code: 'NOT_FOUND' } });
  }
  return collection;
}

function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
}

export async function createCollection(
  userId: string,
  name: string,
  color: string,
  icon: string,
): Promise<Collection> {
  assertValid(color, icon);
  try {
    return await prisma.collection.create({ data: { userId, name, color, icon } });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new GraphQLError('A collection with that name already exists', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    throw error;
  }
}

export async function updateCollection(
  userId: string,
  collectionId: string,
  input: { name?: string; color?: string; icon?: string },
): Promise<Collection> {
  await requireOwnedCollection(userId, collectionId);
  assertValid(input.color, input.icon);

  const data: { name?: string; color?: string; icon?: string } = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.color !== undefined) data.color = input.color;
  if (input.icon !== undefined) data.icon = input.icon;

  try {
    return await prisma.collection.update({ where: { id: collectionId }, data });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new GraphQLError('A collection with that name already exists', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    throw error;
  }
}

export async function deleteCollection(userId: string, collectionId: string): Promise<boolean> {
  await requireOwnedCollection(userId, collectionId);
  await prisma.collection.delete({ where: { id: collectionId } });
  return true;
}

export async function addBookToCollection(
  userId: string,
  collectionId: string,
  bookId: string,
): Promise<Collection> {
  const collection = await requireOwnedCollection(userId, collectionId);
  try {
    await prisma.collectionItem.create({ data: { collectionId, bookId } });
  } catch (error) {
    if (!isUniqueViolation(error)) throw error;
  }
  return collection;
}

export async function removeBookFromCollection(
  userId: string,
  collectionId: string,
  bookId: string,
): Promise<Collection> {
  const collection = await requireOwnedCollection(userId, collectionId);
  await prisma.collectionItem
    .delete({ where: { collectionId_bookId: { collectionId, bookId } } })
    .catch(() => undefined);
  return collection;
}
