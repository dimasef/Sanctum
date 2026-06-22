import { GraphQLError } from 'graphql';
import { config } from '../config.js';

const API_BASE = 'https://www.googleapis.com/books/v1/volumes';

// Our normalized internal shape (anti-corruption layer).
export interface BookData {
  googleId: string;
  title: string;
  authors: string[];
  description: string | null;
  coverUrl: string | null;
  publishedYear: number | null;
  isbn: string | null;
}

// Partial typing of the Google Books response — only the fields we consume.
interface GoogleVolume {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    description?: string;
    publishedDate?: string;
    imageLinks?: { thumbnail?: string };
    industryIdentifiers?: { type: string; identifier: string }[];
  };
}

interface GoogleVolumesResponse {
  items?: GoogleVolume[];
}

function mapVolume(volume: GoogleVolume): BookData {
  const info = volume.volumeInfo ?? {};
  const isbn =
    info.industryIdentifiers?.find((i) => i.type === 'ISBN_13')?.identifier ??
    info.industryIdentifiers?.find((i) => i.type === 'ISBN_10')?.identifier ??
    null;
  const year = info.publishedDate
    ? Number.parseInt(info.publishedDate.slice(0, 4), 10)
    : Number.NaN;

  return {
    googleId: volume.id,
    title: info.title ?? 'Untitled',
    authors: info.authors ?? [],
    description: info.description ?? null,
    coverUrl: info.imageLinks?.thumbnail ?? null,
    publishedYear: Number.isNaN(year) ? null : year,
    isbn,
  };
}

async function fetchGoogle<T>(path: string): Promise<T> {
  const sep = path.includes('?') ? '&' : '?';
  const url = `${API_BASE}${path}${sep}key=${config.googleBooksApiKey}&country=US`;

  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new GraphQLError('Failed to reach Google Books API', {
      extensions: { code: 'BAD_GATEWAY' },
    });
  }

  if (!res.ok) {
    throw new GraphQLError(`Google Books API returned ${res.status}`, {
      extensions: { code: 'BAD_GATEWAY' },
    });
  }

  return res.json() as Promise<T>;
}

export async function searchBooks(query: string): Promise<BookData[]> {
  const data = await fetchGoogle<GoogleVolumesResponse>(
    `?q=${encodeURIComponent(query)}&maxResults=10`,
  );
  return (data.items ?? []).map(mapVolume);
}

export async function getVolume(googleId: string): Promise<BookData> {
  const volume = await fetchGoogle<GoogleVolume>(`/${encodeURIComponent(googleId)}`);
  return mapVolume(volume);
}
