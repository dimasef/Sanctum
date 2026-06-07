import * as googleBooks from './books/googleBooks.js';
import * as bookService from './books/book.service.js';
import * as shelfService from './shelf/shelf.service.js';
import * as reviewService from './reviews/review.service.js';
import { requireUserId } from './auth/guard.js';
import type { Book, Review, Shelf, User, ShelfStatus } from './generated/prisma/client.js';
import type { Context } from './context.js';
import * as authService from './auth/auth.service.js';

export const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, ctx: Context) => {
      if (!ctx.userId) return null;
      return ctx.prisma.user.findUnique({ where: { id: ctx.userId } });
    },
    books: async (_parent: unknown, _args: unknown, ctx: Context) => ctx.prisma.book.findMany(),
    book: async (_parent: unknown, args: { id: string }, ctx: Context) =>
      ctx.prisma.book.findUnique({ where: { id: args.id } }),
    users: async (_parent: unknown, _args: unknown, ctx: Context) => ctx.prisma.user.findMany(),
    user: async (_parent: unknown, args: { id: string }, ctx: Context) =>
      ctx.prisma.user.findUnique({ where: { id: args.id } }),
    searchBooks: (_p: unknown, args: { query: string }) => googleBooks.searchBooks(args.query),
  },

  Mutation: {
    register: (
      _parent: unknown,
      args: { input: { email: string; password: string; name: string } },
    ) => authService.register(args.input),
    login: (_parent: unknown, args: { input: { email: string; password: string } }) =>
      authService.login(args.input),
    refreshToken: (_parent: unknown, args: { token: string }) => authService.refresh(args.token),
    logout: (_parent: unknown, args: { token: string }) => authService.logout(args.token),
    importBook: (_p: unknown, args: { googleId: string }, ctx: Context) => {
      requireUserId(ctx);
      return bookService.importBook(args.googleId);
    },
    addToShelf: (_p: unknown, args: { bookId: string; status: ShelfStatus }, ctx: Context) =>
      shelfService.addToShelf(requireUserId(ctx), args.bookId, args.status),
    moveOnShelf: (_p: unknown, args: { bookId: string; status: ShelfStatus }, ctx: Context) =>
      shelfService.moveOnShelf(requireUserId(ctx), args.bookId, args.status),
    removeFromShelf: (_p: unknown, args: { bookId: string }, ctx: Context) =>
      shelfService.removeFromShelf(requireUserId(ctx), args.bookId),
    upsertReview: (
      _p: unknown,
      args: { bookId: string; rating: number; body?: string | null },
      ctx: Context,
    ) => reviewService.upsertReview(requireUserId(ctx), args.bookId, args.rating, args.body),
    deleteReview: (_p: unknown, args: { bookId: string }, ctx: Context) =>
      reviewService.deleteReview(requireUserId(ctx), args.bookId),
  },

  User: {
    createdAt: (parent: User) => parent.createdAt.toISOString(),
    shelf: (parent: User, _a: unknown, ctx: Context) => ctx.loaders.shelvesByUserId.load(parent.id),
    reviews: (parent: User, _a: unknown, ctx: Context) =>
      ctx.loaders.reviewsByUserId.load(parent.id),
  },
  Book: {
    reviews: (parent: Book, _a: unknown, ctx: Context) =>
      ctx.loaders.reviewsByBookId.load(parent.id),
  },
  ShelfItem: {
    addedAt: (parent: Shelf) => parent.addedAt.toISOString(),
    user: (parent: Shelf, _a: unknown, ctx: Context) => ctx.loaders.userById.load(parent.userId),
    book: (parent: Shelf, _a: unknown, ctx: Context) => ctx.loaders.bookById.load(parent.bookId),
  },
  Review: {
    createdAt: (parent: Review) => parent.createdAt.toISOString(),
    updatedAt: (parent: Review) => parent.updatedAt.toISOString(),
    user: (parent: Review, _a: unknown, ctx: Context) => ctx.loaders.userById.load(parent.userId),
    book: (parent: Review, _a: unknown, ctx: Context) => ctx.loaders.bookById.load(parent.bookId),
  },
};
