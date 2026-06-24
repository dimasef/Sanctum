import { gql, type TypedDocumentNode } from '@apollo/client';
import type { Book } from '../books/operations.ts';

export type ReadingState = 'WANT_TO_READ' | 'READING' | 'READ';

export const STATUS_ORDER: ReadingState[] = ['READING', 'WANT_TO_READ', 'READ'];

export const STATUS_LABELS: Record<ReadingState, string> = {
  WANT_TO_READ: 'Want to read',
  READING: 'Reading',
  READ: 'Read',
};

export interface ReadingStatus {
  id: string;
  status: ReadingState;
  book: Book;
}

export const MY_READING: TypedDocumentNode<
  { me: { id: string; readingStatuses: ReadingStatus[] } | null },
  Record<string, never>
> = gql`
  query MyReading {
    me {
      id
      readingStatuses {
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

export const SET_READING_STATUS: TypedDocumentNode<
  { setReadingStatus: { id: string; status: ReadingState; book: { id: string } } },
  { bookId: string; status: ReadingState }
> = gql`
  mutation SetReadingStatus($bookId: ID!, $status: ReadingState!) {
    setReadingStatus(bookId: $bookId, status: $status) {
      id
      status
      book {
        id
      }
    }
  }
`;

export const REMOVE_READING_STATUS: TypedDocumentNode<
  { removeReadingStatus: boolean },
  { bookId: string }
> = gql`
  mutation RemoveReadingStatus($bookId: ID!) {
    removeReadingStatus(bookId: $bookId)
  }
`;
