import { describe, it, expect, vi } from 'vitest';
import { resolvers } from './resolvers.js';
import type { Context } from './context.js';
import type { Book } from './generated/prisma/client.js';

const book = {
  id: 'book-1',
  coverUrl: 'https://books.google.com/canonical.jpg',
} as unknown as Book;

function ctxWith(userId: string | null, override: string | null): Context {
  return {
    userId,
    loaders: {
      coverOverrideByBookId: { load: vi.fn().mockResolvedValue(override) },
    },
  } as unknown as Context;
}

describe('Book.coverUrl', () => {
  it('returns the canonical cover for an anonymous viewer', async () => {
    expect(await resolvers.Book.coverUrl(book, {}, ctxWith(null, 'ignored'))).toBe(book.coverUrl);
  });

  it('returns the canonical cover when the viewer has no override', async () => {
    expect(await resolvers.Book.coverUrl(book, {}, ctxWith('user-1', null))).toBe(book.coverUrl);
  });

  it("returns the viewer's override when present", async () => {
    const override = `https://test-bucket.s3.eu-central-1.amazonaws.com/covers/user-1/book-1/x.png`;
    expect(await resolvers.Book.coverUrl(book, {}, ctxWith('user-1', override))).toBe(override);
  });
});

describe('Book.hasCustomCover', () => {
  it('is false for an anonymous viewer', async () => {
    expect(await resolvers.Book.hasCustomCover(book, {}, ctxWith(null, 'x'))).toBe(false);
  });

  it('is false when the viewer has no override', async () => {
    expect(await resolvers.Book.hasCustomCover(book, {}, ctxWith('user-1', null))).toBe(false);
  });

  it('is true when the viewer has an override', async () => {
    expect(await resolvers.Book.hasCustomCover(book, {}, ctxWith('user-1', 'x'))).toBe(true);
  });
});
