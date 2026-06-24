import { describe, it, expect, vi, beforeEach } from 'vitest';

const { findFirstMock } = vi.hoisted(() => ({ findFirstMock: vi.fn() }));

vi.mock('../prisma.js', () => ({
  prisma: {
    collection: {
      findFirst: findFirstMock,
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    collectionItem: { create: vi.fn(), delete: vi.fn() },
  },
}));

import {
  addBookToCollection,
  createCollection,
  deleteCollection,
  updateCollection,
} from './collection.service.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ownership guard', () => {
  it('rejects acting on a collection the user does not own with NOT_FOUND', async () => {
    findFirstMock.mockResolvedValue(null);

    await expect(addBookToCollection('user-1', 'other-collection', 'book-1')).rejects.toMatchObject({
      extensions: { code: 'NOT_FOUND' },
    });
    await expect(
      updateCollection('user-1', 'other-collection', { name: 'x' }),
    ).rejects.toMatchObject({ extensions: { code: 'NOT_FOUND' } });
    await expect(deleteCollection('user-1', 'other-collection')).rejects.toMatchObject({
      extensions: { code: 'NOT_FOUND' },
    });
  });
});

describe('createCollection validation', () => {
  it('rejects an unsupported color', async () => {
    await expect(createCollection('user-1', 'Favs', '#zzzzzz', 'favorite')).rejects.toMatchObject({
      extensions: { code: 'BAD_USER_INPUT' },
    });
  });

  it('rejects an unsupported icon', async () => {
    await expect(createCollection('user-1', 'Favs', '#8a6118', 'nope')).rejects.toMatchObject({
      extensions: { code: 'BAD_USER_INPUT' },
    });
  });
});
