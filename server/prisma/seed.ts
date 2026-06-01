import 'dotenv/config';
import { PrismaClient, ShelfStatus } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  const user = await prisma.user.upsert({
    where: { email: 'demo@bookshelf.dev' },
    update: {},
    create: {
      email: 'demo@bookshelf.dev',
      passwordHash: 'placeholder-not-a-real-hash',
      name: 'Demo Reader',
      bio: 'Just here to read.',
    },
  });

  const cleanCode = await prisma.book.upsert({
    where: { googleId: 'clean-code-001' },
    update: {},
    create: {
      googleId: 'clean-code-001',
      title: 'Clean Code',
      authors: ['Robert C. Martin'],
      publishedYear: 2008,
      isbn: '9780132350884',
    },
  });

  const pragmatic = await prisma.book.upsert({
    where: { googleId: 'pragmatic-001' },
    update: {},
    create: {
      googleId: 'pragmatic-001',
      title: 'The Pragmatic Programmer',
      authors: ['Andrew Hunt', 'David Thomas'],
      publishedYear: 1999,
    },
  });

  await prisma.shelf.upsert({
    where: { userId_bookId: { userId: user.id, bookId: cleanCode.id } },
    update: { status: ShelfStatus.READ },
    create: { userId: user.id, bookId: cleanCode.id, status: ShelfStatus.READ },
  });

  await prisma.shelf.upsert({
    where: { userId_bookId: { userId: user.id, bookId: pragmatic.id } },
    update: { status: ShelfStatus.READING },
    create: { userId: user.id, bookId: pragmatic.id, status: ShelfStatus.READING },
  });

  await prisma.review.upsert({
    where: { userId_bookId: { userId: user.id, bookId: cleanCode.id } },
    update: { rating: 5, body: 'A classic.' },
    create: { userId: user.id, bookId: cleanCode.id, rating: 5, body: 'A classic.' },
  });

  console.log('Seed complete ✅');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
