import { gql, type TypedDocumentNode } from '@apollo/client';

export interface Book {
  id: string;
  googleId: string;
  title: string;
  authors: string[];
  description: string | null;
  coverUrl: string | null;
  publishedYear: number | null;
}

export interface BookSearchResult {
  googleId: string;
  title: string;
  authors: string[];
  description: string | null;
  coverUrl: string | null;
  publishedYear: number | null;
}

export const BOOKS: TypedDocumentNode<{ books: Book[] }, Record<string, never>> = gql`
  query Books {
    books {
      id
      googleId
      title
      authors
      description
      coverUrl
      publishedYear
    }
  }
`;

export const SEARCH_BOOKS: TypedDocumentNode<
  { searchBooks: BookSearchResult[] },
  { query: string }
> = gql`
  query SearchBooks($query: String!) {
    searchBooks(query: $query) {
      googleId
      title
      authors
      description
      coverUrl
      publishedYear
    }
  }
`;

export const IMPORT_BOOK: TypedDocumentNode<{ importBook: Book }, { googleId: string }> = gql`
  mutation ImportBook($googleId: String!) {
    importBook(googleId: $googleId) {
      id
      googleId
      title
      authors
      description
      coverUrl
      publishedYear
    }
  }
`;
