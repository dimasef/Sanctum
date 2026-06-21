import { prisma } from '../prisma.js';
import type { Book } from '../generated/prisma/client.js';
import * as s3Service from '../storage/s3.service.js';
import { getVolume } from './googleBooks.js';

export async function importBook(googleId: string): Promise<Book> {
  const data = await getVolume(googleId);

  return prisma.book.upsert({
    where: { googleId: data.googleId },
    update: {
      title: data.title,
      authors: data.authors,
      description: data.description,
      coverUrl: data.coverUrl,
      publishedYear: data.publishedYear,
      isbn: data.isbn,
    },
    create: {
      googleId: data.googleId,
      title: data.title,
      authors: data.authors,
      description: data.description,
      coverUrl: data.coverUrl,
      publishedYear: data.publishedYear,
      isbn: data.isbn,
    },
  });
}

export async function setBookCover(userId: string, bookId: string, coverUrl: string) {
  const existing = await prisma.bookCover.findUnique({
    where: { userId_bookId: { userId, bookId } },
  });
  await prisma.bookCover.upsert({
    where: { userId_bookId: { userId, bookId } },
    create: { userId, bookId, coverUrl },
    update: { coverUrl },
  });
  if (existing && existing.coverUrl !== coverUrl) {
    await s3Service.deleteByPublicUrl(existing.coverUrl).catch(() => {});
  }
}

export async function removeBookCover(userId: string, bookId: string) {
  const existing = await prisma.bookCover.findUnique({
    where: { userId_bookId: { userId, bookId } },
  });
  if (existing) {
    await prisma.bookCover.delete({ where: { userId_bookId: { userId, bookId } } });
    await s3Service.deleteByPublicUrl(existing.coverUrl).catch(() => {});
  }
}
