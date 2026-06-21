import { describe, it, expect } from 'vitest';
import { coverSrc } from './coverUrl.ts';

describe('coverSrc', () => {
  it('returns null when there is no url', () => {
    expect(coverSrc(null, 2)).toBeNull();
  });

  it('upgrades http to https and strips the edge=curl flag on Google urls', () => {
    expect(coverSrc('http://books.google.com/books?id=1&edge=curl', 1)).toBe(
      'https://books.google.com/books?id=1&zoom=1',
    );
  });

  it('replaces an existing zoom level on Google urls', () => {
    expect(coverSrc('https://books.google.com/books?id=1&zoom=5', 2)).toBe(
      'https://books.google.com/books?id=1&zoom=2',
    );
  });

  it('appends a zoom level when the Google url has none', () => {
    expect(coverSrc('https://books.google.com/books?id=1', 3)).toBe(
      'https://books.google.com/books?id=1&zoom=3',
    );
  });

  it('leaves non-Google urls untouched (no zoom param added)', () => {
    const s3 = 'https://test-bucket.s3.eu-central-1.amazonaws.com/covers/u/b/x.png';
    expect(coverSrc(s3, 2)).toBe(s3);
  });
});
