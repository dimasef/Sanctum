import { GraphQLError } from 'graphql';
import type { Context } from '../context.js';

export function requireUserId(ctx: Context): string {
  if (!ctx.userId) {
    throw new GraphQLError('You must be logged in', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
  return ctx.userId;
}
