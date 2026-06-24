import { gql, type TypedDocumentNode } from '@apollo/client';
import type { Book } from '../books/operations.ts';

export const COLLECTION_COLORS = [
  '#8a6118',
  '#6a4626',
  '#3f5e3a',
  '#5a3a52',
  '#3a4a5e',
  '#7a2e2e',
] as const;

export const COLLECTION_ICONS = [
  'favorite',
  'history',
  'star',
  'book',
  'public',
  'science',
  'autoAwesome',
  'bookmark',
] as const;

export type CollectionIconKey = (typeof COLLECTION_ICONS)[number];

export interface Collection {
  id: string;
  name: string;
  color: string;
  icon: string;
  bookCount: number;
  books?: Book[];
}

export interface CollectionInput {
  name: string;
  color: string;
  icon: string;
}

export const MY_COLLECTIONS: TypedDocumentNode<
  { me: { id: string; collections: Collection[] } | null },
  Record<string, never>
> = gql`
  query MyCollections {
    me {
      id
      collections {
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

export const COLLECTION: TypedDocumentNode<{ collection: Collection | null }, { id: string }> = gql`
  query Collection($id: ID!) {
    collection(id: $id) {
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

export const CREATE_COLLECTION: TypedDocumentNode<
  { createCollection: Collection },
  { input: CollectionInput }
> = gql`
  mutation CreateCollection($input: CreateCollectionInput!) {
    createCollection(input: $input) {
      id
      name
      color
      icon
      bookCount
    }
  }
`;

export const UPDATE_COLLECTION: TypedDocumentNode<
  { updateCollection: Collection },
  { id: string; input: Partial<CollectionInput> }
> = gql`
  mutation UpdateCollection($id: ID!, $input: UpdateCollectionInput!) {
    updateCollection(id: $id, input: $input) {
      id
      name
      color
      icon
    }
  }
`;

export const DELETE_COLLECTION: TypedDocumentNode<{ deleteCollection: boolean }, { id: string }> =
  gql`
    mutation DeleteCollection($id: ID!) {
      deleteCollection(id: $id)
    }
  `;

type MembershipData = {
  id: string;
  bookCount: number;
  books: { id: string }[];
};

export const ADD_BOOK_TO_COLLECTION: TypedDocumentNode<
  { addBookToCollection: MembershipData },
  { collectionId: string; bookId: string }
> = gql`
  mutation AddBookToCollection($collectionId: ID!, $bookId: ID!) {
    addBookToCollection(collectionId: $collectionId, bookId: $bookId) {
      id
      bookCount
      books {
        id
      }
    }
  }
`;

export const REMOVE_BOOK_FROM_COLLECTION: TypedDocumentNode<
  { removeBookFromCollection: MembershipData },
  { collectionId: string; bookId: string }
> = gql`
  mutation RemoveBookFromCollection($collectionId: ID!, $bookId: ID!) {
    removeBookFromCollection(collectionId: $collectionId, bookId: $bookId) {
      id
      bookCount
      books {
        id
      }
    }
  }
`;
