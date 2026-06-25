import * as googleBooks from './books/googleBooks.js';
import * as bookService from './books/book.service.js';
import * as readingStatusService from './reading-status/reading-status.service.js';
import * as reviewService from './reviews/review.service.js';
import { requireUserId } from './auth/guard.js';
import type {
  Book,
  Review,
  ReadingStatus,
  Shelf,
  User,
  ReadingState,
} from './generated/prisma/client.js';
import type { Context } from './context.js';
import * as authService from './auth/auth.service.js';
import * as s3Service from './storage/s3.service.js';
import * as userService from './user/user.service.js';
import * as shelfService from './shelf/shelf.service.js';

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
    shelf: (_p: unknown, args: { id: string }, ctx: Context) =>
      ctx.prisma.shelf.findFirst({ where: { id: args.id, userId: requireUserId(ctx) } }),
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
    setReadingStatus: (
      _p: unknown,
      args: { bookId: string; status: ReadingState },
      ctx: Context,
    ) => readingStatusService.setReadingStatus(requireUserId(ctx), args.bookId, args.status),
    removeReadingStatus: (_p: unknown, args: { bookId: string }, ctx: Context) =>
      readingStatusService.removeReadingStatus(requireUserId(ctx), args.bookId),
    upsertReview: (
      _p: unknown,
      args: { bookId: string; rating: number; body?: string | null },
      ctx: Context,
    ) => reviewService.upsertReview(requireUserId(ctx), args.bookId, args.rating, args.body),
    deleteReview: (_p: unknown, args: { bookId: string }, ctx: Context) =>
      reviewService.deleteReview(requireUserId(ctx), args.bookId),
    requestAvatarUploadUrl: (_p: unknown, args: { contentType: string }, ctx: Context) =>
      s3Service.createAvatarUploadUrl(requireUserId(ctx), args.contentType),
    updateProfile: (
      _p: unknown,
      args: { input: { name?: string; bio?: string | null; avatarUrl?: string | null } },
      ctx: Context,
    ) => userService.updateProfile(requireUserId(ctx), args.input),
    requestCoverUploadUrl: (
      _p: unknown,
      args: { bookId: string; contentType: string },
      ctx: Context,
    ) => s3Service.createCoverUploadUrl(requireUserId(ctx), args.bookId, args.contentType),
    setBookCover: async (_p: unknown, args: { bookId: string; coverUrl: string }, ctx: Context) => {
      await bookService.setBookCover(requireUserId(ctx), args.bookId, args.coverUrl);
      ctx.loaders.coverOverrideByBookId.clear(args.bookId);
      return ctx.prisma.book.findUnique({ where: { id: args.bookId } });
    },
    removeBookCover: async (_p: unknown, args: { bookId: string }, ctx: Context) => {
      await bookService.removeBookCover(requireUserId(ctx), args.bookId);
      ctx.loaders.coverOverrideByBookId.clear(args.bookId);
      return ctx.prisma.book.findUnique({ where: { id: args.bookId } });
    },
    createShelf: (
      _p: unknown,
      args: { input: { name: string; color: string; icon: string } },
      ctx: Context,
    ) =>
      shelfService.createShelf(
        requireUserId(ctx),
        args.input.name,
        args.input.color,
        args.input.icon,
      ),
    updateShelf: (
      _p: unknown,
      args: { id: string; input: { name?: string; color?: string; icon?: string } },
      ctx: Context,
    ) => shelfService.updateShelf(requireUserId(ctx), args.id, args.input),
    deleteShelf: (_p: unknown, args: { id: string }, ctx: Context) =>
      shelfService.deleteShelf(requireUserId(ctx), args.id),
    addBookToShelf: async (
      _p: unknown,
      args: { shelfId: string; bookId: string },
      ctx: Context,
    ) => {
      const shelf = await shelfService.addBookToShelf(
        requireUserId(ctx),
        args.shelfId,
        args.bookId,
      );
      ctx.loaders.booksByShelfId.clear(args.shelfId);
      return shelf;
    },
    removeBookFromShelf: async (
      _p: unknown,
      args: { shelfId: string; bookId: string },
      ctx: Context,
    ) => {
      const shelf = await shelfService.removeBookFromShelf(
        requireUserId(ctx),
        args.shelfId,
        args.bookId,
      );
      ctx.loaders.booksByShelfId.clear(args.shelfId);
      return shelf;
    },
  },

  User: {
    createdAt: (parent: User) => parent.createdAt.toISOString(),
    readingStatuses: (parent: User, _a: unknown, ctx: Context) =>
      ctx.loaders.readingStatusesByUserId.load(parent.id),
    reviews: (parent: User, _a: unknown, ctx: Context) =>
      ctx.loaders.reviewsByUserId.load(parent.id),
    shelves: (parent: User, _a: unknown, ctx: Context) =>
      ctx.loaders.shelvesByUserId.load(parent.id),
  },

  Shelf: {
    createdAt: (parent: Shelf) => parent.createdAt.toISOString(),
    bookCount: async (parent: Shelf, _a: unknown, ctx: Context) =>
      (await ctx.loaders.booksByShelfId.load(parent.id)).length,
    books: async (parent: Shelf, _a: unknown, ctx: Context) => {
      const items = await ctx.loaders.booksByShelfId.load(parent.id);
      return Promise.all(items.map((item) => ctx.loaders.bookById.load(item.bookId)));
    },
  },
  Book: {
    coverUrl: async (parent: Book, _a: unknown, ctx: Context) => {
      if (!ctx.userId) return parent.coverUrl;
      const override = await ctx.loaders.coverOverrideByBookId.load(parent.id);
      return override ?? parent.coverUrl;
    },
    hasCustomCover: async (parent: Book, _a: unknown, ctx: Context) => {
      if (!ctx.userId) return false;
      return (await ctx.loaders.coverOverrideByBookId.load(parent.id)) !== null;
    },
    reviews: (parent: Book, _a: unknown, ctx: Context) =>
      ctx.loaders.reviewsByBookId.load(parent.id),
  },
  ReadingStatus: {
    addedAt: (parent: ReadingStatus) => parent.addedAt.toISOString(),
    user: (parent: ReadingStatus, _a: unknown, ctx: Context) =>
      ctx.loaders.userById.load(parent.userId),
    book: (parent: ReadingStatus, _a: unknown, ctx: Context) =>
      ctx.loaders.bookById.load(parent.bookId),
  },
  Review: {
    createdAt: (parent: Review) => parent.createdAt.toISOString(),
    updatedAt: (parent: Review) => parent.updatedAt.toISOString(),
    user: (parent: Review, _a: unknown, ctx: Context) => ctx.loaders.userById.load(parent.userId),
    book: (parent: Review, _a: unknown, ctx: Context) => ctx.loaders.bookById.load(parent.bookId),
  },
};
