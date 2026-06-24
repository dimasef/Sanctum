import { describe, it, expect, vi, beforeEach } from 'vitest';

const { findFirstMock } = vi.hoisted(() => ({ findFirstMock: vi.fn() }));

vi.mock('../prisma.js', () => ({
  prisma: {
    shelf: {
      findFirst: findFirstMock,
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    shelfBook: { create: vi.fn(), delete: vi.fn() },
  },
}));

import { addBookToShelf, createShelf, deleteShelf, updateShelf } from './shelf.service.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ownership guard', () => {
  it('rejects acting on a shelf the user does not own with NOT_FOUND', async () => {
    findFirstMock.mockResolvedValue(null);

    await expect(addBookToShelf('user-1', 'other-shelf', 'book-1')).rejects.toMatchObject({
      extensions: { code: 'NOT_FOUND' },
    });
    await expect(updateShelf('user-1', 'other-shelf', { name: 'x' })).rejects.toMatchObject({
      extensions: { code: 'NOT_FOUND' },
    });
    await expect(deleteShelf('user-1', 'other-shelf')).rejects.toMatchObject({
      extensions: { code: 'NOT_FOUND' },
    });
  });
});

describe('createShelf validation', () => {
  it('rejects an unsupported color', async () => {
    await expect(createShelf('user-1', 'Favs', '#zzzzzz', 'favorite')).rejects.toMatchObject({
      extensions: { code: 'BAD_USER_INPUT' },
    });
  });

  it('rejects an unsupported icon', async () => {
    await expect(createShelf('user-1', 'Favs', '#8a6118', 'nope')).rejects.toMatchObject({
      extensions: { code: 'BAD_USER_INPUT' },
    });
  });
});
