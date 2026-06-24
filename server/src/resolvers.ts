import * as googleBooks from './books/googleBooks.js';
import * as bookService from './books/book.service.js';
import * as shelfService from './shelf/shelf.service.js';
import * as reviewService from './reviews/review.service.js';
import { requireUserId } from './auth/guard.js';
import type { Book, Review, Shelf, User, ShelfStatus } from './generated/prisma/client.js';
import type { Context } from './context.js';
import * as authService from './auth/auth.service.js';
import * as s3Service from './storage/s3.service.js';
import * as userService from './user/user.service.js';
import * as collectionService from './collections/collection.service.js';
import type { Collection } from './generated/prisma/client.js';

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
    collection: (_p: unknown, args: { id: string }, ctx: Context) =>
      ctx.prisma.collection.findFirst({ where: { id: args.id, userId: requireUserId(ctx) } }),
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
    createCollection: (
      _p: unknown,
      args: { input: { name: string; color: string; icon: string } },
      ctx: Context,
    ) =>
      collectionService.createCollection(
        requireUserId(ctx),
        args.input.name,
        args.input.color,
        args.input.icon,
      ),
    updateCollection: (
      _p: unknown,
      args: { id: string; input: { name?: string; color?: string; icon?: string } },
      ctx: Context,
    ) => collectionService.updateCollection(requireUserId(ctx), args.id, args.input),
    deleteCollection: (_p: unknown, args: { id: string }, ctx: Context) =>
      collectionService.deleteCollection(requireUserId(ctx), args.id),
    addBookToCollection: async (
      _p: unknown,
      args: { collectionId: string; bookId: string },
      ctx: Context,
    ) => {
      const collection = await collectionService.addBookToCollection(
        requireUserId(ctx),
        args.collectionId,
        args.bookId,
      );
      ctx.loaders.itemsByCollectionId.clear(args.collectionId);
      return collection;
    },
    removeBookFromCollection: async (
      _p: unknown,
      args: { collectionId: string; bookId: string },
      ctx: Context,
    ) => {
      const collection = await collectionService.removeBookFromCollection(
        requireUserId(ctx),
        args.collectionId,
        args.bookId,
      );
      ctx.loaders.itemsByCollectionId.clear(args.collectionId);
      return collection;
    },
  },

  User: {
    createdAt: (parent: User) => parent.createdAt.toISOString(),
    shelf: (parent: User, _a: unknown, ctx: Context) => ctx.loaders.shelvesByUserId.load(parent.id),
    reviews: (parent: User, _a: unknown, ctx: Context) =>
      ctx.loaders.reviewsByUserId.load(parent.id),
    collections: (parent: User, _a: unknown, ctx: Context) =>
      ctx.loaders.collectionsByUserId.load(parent.id),
  },

  Collection: {
    createdAt: (parent: Collection) => parent.createdAt.toISOString(),
    bookCount: async (parent: Collection, _a: unknown, ctx: Context) =>
      (await ctx.loaders.itemsByCollectionId.load(parent.id)).length,
    books: async (parent: Collection, _a: unknown, ctx: Context) => {
      const items = await ctx.loaders.itemsByCollectionId.load(parent.id);
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
