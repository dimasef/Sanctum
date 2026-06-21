import { gql, type TypedDocumentNode } from '@apollo/client';
import type { Book } from '../books/operations.ts';

export type ShelfStatus = 'WANT_TO_READ' | 'READING' | 'READ';

export const STATUS_ORDER: ShelfStatus[] = ['READING', 'WANT_TO_READ', 'READ'];

export const STATUS_LABELS: Record<ShelfStatus, string> = {
  WANT_TO_READ: 'Want to read',
  READING: 'Reading',
  READ: 'Read',
};

export interface ShelfItem {
  id: string;
  status: ShelfStatus;
  book: Book;
}

export const MY_SHELF: TypedDocumentNode<
  { me: { id: string; shelf: ShelfItem[] } | null },
  Record<string, never>
> = gql`
  query MyShelf {
    me {
      id
      shelf {
        id
        status
        book {
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
  }
`;

type ShelfMutationData = { id: string; status: ShelfStatus; book: { id: string } };
type ShelfMutationVars = { bookId: string; status: ShelfStatus };

export const ADD_TO_SHELF: TypedDocumentNode<
  { addToShelf: ShelfMutationData },
  ShelfMutationVars
> = gql`
  mutation AddToShelf($bookId: ID!, $status: ShelfStatus!) {
    addToShelf(bookId: $bookId, status: $status) {
      id
      status
      book {
        id
      }
    }
  }
`;

export const MOVE_ON_SHELF: TypedDocumentNode<
  { moveOnShelf: ShelfMutationData },
  ShelfMutationVars
> = gql`
  mutation MoveOnShelf($bookId: ID!, $status: ShelfStatus!) {
    moveOnShelf(bookId: $bookId, status: $status) {
      id
      status
      book {
        id
      }
    }
  }
`;

export const REMOVE_FROM_SHELF: TypedDocumentNode<
  { removeFromShelf: boolean },
  { bookId: string }
> = gql`
  mutation RemoveFromShelf($bookId: ID!) {
    removeFromShelf(bookId: $bookId)
  }
`;
