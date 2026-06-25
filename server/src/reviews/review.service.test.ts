import { describe, it, expect, vi, beforeEach } from 'vitest';

const { upsertMock, deleteMock } = vi.hoisted(() => ({
  upsertMock: vi.fn(),
  deleteMock: vi.fn(),
}));

vi.mock('../prisma.js', () => ({
  prisma: {
    review: { upsert: upsertMock, delete: deleteMock },
  },
}));

import { deleteReview, upsertReview } from './review.service.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('upsertReview validation', () => {
  it.each([0, 6, 3.5, Number.NaN])('rejects rating %s with BAD_USER_INPUT', async (rating) => {
    await expect((async () => upsertReview('user-1', 'book-1', rating))()).rejects.toMatchObject({
      extensions: { code: 'BAD_USER_INPUT' },
    });
    expect(upsertMock).not.toHaveBeenCalled();
  });

  it('upserts a valid review keyed on userId_bookId', async () => {
    upsertMock.mockResolvedValue({ id: 'review-1' });

    await upsertReview('user-1', 'book-1', 5, 'A classic.');

    expect(upsertMock).toHaveBeenCalledWith({
      where: { userId_bookId: { userId: 'user-1', bookId: 'book-1' } },
      update: { rating: 5, body: 'A classic.' },
      create: { userId: 'user-1', bookId: 'book-1', rating: 5, body: 'A classic.' },
    });
  });

  it('normalizes a missing body to null', async () => {
    upsertMock.mockResolvedValue({ id: 'review-1' });

    await upsertReview('user-1', 'book-1', 4);

    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        update: { rating: 4, body: null },
        create: { userId: 'user-1', bookId: 'book-1', rating: 4, body: null },
      }),
    );
  });
});

describe('deleteReview', () => {
  it('deletes the review and returns true', async () => {
    deleteMock.mockResolvedValue({ id: 'review-1' });

    await expect(deleteReview('user-1', 'book-1')).resolves.toBe(true);
    expect(deleteMock).toHaveBeenCalledWith({
      where: { userId_bookId: { userId: 'user-1', bookId: 'book-1' } },
    });
  });
});
