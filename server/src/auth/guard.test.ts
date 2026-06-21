import { describe, it, expect } from 'vitest';
import { GraphQLError } from 'graphql';
import { requireUserId } from './guard.js';
import type { Context } from '../context.js';

describe('requireUserId', () => {
  it('returns the userId when the context is authenticated', () => {
    const ctx = { userId: 'user-1' } as Context;
    expect(requireUserId(ctx)).toBe('user-1');
  });

  it('throws an UNAUTHENTICATED GraphQLError for an anonymous context', () => {
    const ctx = { userId: null } as Context;
    expect(() => requireUserId(ctx)).toThrow(GraphQLError);
    try {
      requireUserId(ctx);
    } catch (err) {
      expect((err as GraphQLError).extensions.code).toBe('UNAUTHENTICATED');
    }
  });
});
