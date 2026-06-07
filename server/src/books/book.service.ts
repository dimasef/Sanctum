import { prisma } from '../prisma.js';
import type { Book } from '../generated/prisma/client.js';
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
