import { gql, type TypedDocumentNode } from '@apollo/client';
import type { Book } from '../books/operations.ts';

export const SHELF_COLORS = [
  '#8a6118',
  '#6a4626',
  '#3f5e3a',
  '#5a3a52',
  '#3a4a5e',
  '#7a2e2e',
] as const;

export const SHELF_ICONS = [
  'favorite',
  'history',
  'star',
  'book',
  'public',
  'science',
  'autoAwesome',
  'bookmark',
] as const;

export type ShelfIconKey = (typeof SHELF_ICONS)[number];

export interface Shelf {
  id: string;
  name: string;
  color: string;
  icon: string;
  bookCount: number;
  books?: Book[];
}

export interface ShelfInput {
  name: string;
  color: string;
  icon: string;
}

export const MY_SHELVES: TypedDocumentNode<
  { me: { id: string; shelves: Shelf[] } | null },
  Record<string, never>
> = gql`
  query MyShelves {
    me {
      id
      shelves {
        id
        name
        color
        icon
        bookCount
        books {
          id
        }
      }
    }
  }
`;

export const SHELF: TypedDocumentNode<{ shelf: Shelf | null }, { id: string }> = gql`
  query Shelf($id: ID!) {
    shelf(id: $id) {
      id
      name
      color
      icon
      bookCount
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
  }
`;

export const CREATE_SHELF: TypedDocumentNode<{ createShelf: Shelf }, { input: ShelfInput }> = gql`
  mutation CreateShelf($input: CreateShelfInput!) {
    createShelf(input: $input) {
      id
      name
      color
      icon
      bookCount
    }
  }
`;

export const UPDATE_SHELF: TypedDocumentNode<
  { updateShelf: Shelf },
  { id: string; input: Partial<ShelfInput> }
> = gql`
  mutation UpdateShelf($id: ID!, $input: UpdateShelfInput!) {
    updateShelf(id: $id, input: $input) {
      id
      name
      color
      icon
    }
  }
`;

export const DELETE_SHELF: TypedDocumentNode<{ deleteShelf: boolean }, { id: string }> = gql`
  mutation DeleteShelf($id: ID!) {
    deleteShelf(id: $id)
  }
`;

type MembershipData = {
  id: string;
  bookCount: number;
  books: { id: string }[];
};

export const ADD_BOOK_TO_SHELF: TypedDocumentNode<
  { addBookToShelf: MembershipData },
  { shelfId: string; bookId: string }
> = gql`
  mutation AddBookToShelf($shelfId: ID!, $bookId: ID!) {
    addBookToShelf(shelfId: $shelfId, bookId: $bookId) {
      id
      bookCount
      books {
        id
      }
    }
  }
`;

export const REMOVE_BOOK_FROM_SHELF: TypedDocumentNode<
  { removeBookFromShelf: MembershipData },
  { shelfId: string; bookId: string }
> = gql`
  mutation RemoveBookFromShelf($shelfId: ID!, $bookId: ID!) {
    removeBookFromShelf(shelfId: $shelfId, bookId: $bookId) {
      id
      bookCount
      books {
        id
      }
    }
  }
`;
