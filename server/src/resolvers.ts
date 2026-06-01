import type { Book, Review, Shelf, User } from './generated/prisma/client.js';
import type { Context } from './context.js';

export const resolvers = {
  Query: {
    books: async (_parent: unknown, _args: unknown, ctx: Context) => ctx.prisma.book.findMany(),
    book: async (_parent: unknown, args: { id: string }, ctx: Context) =>
      ctx.prisma.book.findUnique({ where: { id: args.id } }),
    users: async (_parent: unknown, _args: unknown, ctx: Context) => ctx.prisma.user.findMany(),
    user: async (_parent: unknown, args: { id: string }, ctx: Context) =>
      ctx.prisma.user.findUnique({ where: { id: args.id } }),
  },

  User: {
    createdAt: (parent: User) => parent.createdAt.toISOString(),
    shelf: (parent: User, _a: unknown, ctx: Context) =>
      ctx.prisma.shelf.findMany({ where: { userId: parent.id } }),
    reviews: (parent: User, _a: unknown, ctx: Context) =>
      ctx.prisma.review.findMany({ where: { userId: parent.id } }),
  },
  Book: {
    reviews: (parent: Book, _a: unknown, ctx: Context) =>
      ctx.prisma.review.findMany({ where: { bookId: parent.id } }),
  },
  ShelfItem: {
    addedAt: (parent: Shelf) => parent.addedAt.toISOString(),
    user: (parent: Shelf, _a: unknown, ctx: Context) =>
      ctx.prisma.user.findUnique({ where: { id: parent.userId } }),
    book: (parent: Shelf, _a: unknown, ctx: Context) =>
      ctx.prisma.book.findUnique({ where: { id: parent.bookId } }),
  },
  Review: {
    createdAt: (parent: Review) => parent.createdAt.toISOString(),
    updatedAt: (parent: Review) => parent.updatedAt.toISOString(),
    user: (parent: Review, _a: unknown, ctx: Context) =>
      ctx.prisma.user.findUnique({ where: { id: parent.userId } }),
    book: (parent: Review, _a: unknown, ctx: Context) =>
      ctx.prisma.book.findUnique({ where: { id: parent.bookId } }),
  },
};
