import { gql, type TypedDocumentNode } from '@apollo/client';
import type { UploadUrl } from '../lib/imageUpload.ts';
import type { Review } from '../reviews/operations.ts';

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

export interface BookDetail extends Book {
  isbn: string | null;
  hasCustomCover: boolean;
  reviews: Review[];
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

export const BOOK: TypedDocumentNode<{ book: BookDetail | null }, { id: string }> = gql`
  query Book($id: ID!) {
    book(id: $id) {
      id
      googleId
      title
      authors
      description
      coverUrl
      publishedYear
      isbn
      hasCustomCover
      reviews {
        id
        rating
        body
        createdAt
        updatedAt
        user {
          id
          name
          avatarUrl
        }
      }
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

export const REQUEST_COVER_UPLOAD_URL: TypedDocumentNode<
  { requestCoverUploadUrl: UploadUrl },
  { bookId: string; contentType: string }
> = gql`
  mutation RequestCoverUploadUrl($bookId: ID!, $contentType: String!) {
    requestCoverUploadUrl(bookId: $bookId, contentType: $contentType) {
      uploadUrl
      publicUrl
    }
  }
`;

export const SET_BOOK_COVER: TypedDocumentNode<
  { setBookCover: { id: string; coverUrl: string | null; hasCustomCover: boolean } },
  { bookId: string; coverUrl: string }
> = gql`
  mutation SetBookCover($bookId: ID!, $coverUrl: String!) {
    setBookCover(bookId: $bookId, coverUrl: $coverUrl) {
      id
      coverUrl
      hasCustomCover
    }
  }
`;

export const REMOVE_BOOK_COVER: TypedDocumentNode<
  { removeBookCover: { id: string; coverUrl: string | null; hasCustomCover: boolean } },
  { bookId: string }
> = gql`
  mutation RemoveBookCover($bookId: ID!) {
    removeBookCover(bookId: $bookId) {
      id
      coverUrl
      hasCustomCover
    }
  }
`;
