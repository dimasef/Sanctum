import { gql, type TypedDocumentNode } from '@apollo/client';

export interface ReviewAuthor {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface Review {
  id: string;
  rating: number;
  body: string | null;
  createdAt: string;
  updatedAt: string;
  user: ReviewAuthor;
}

export interface ReviewBook {
  id: string;
  title: string;
  authors: string[];
  coverUrl: string | null;
}

export interface ReviewWithBook {
  id: string;
  rating: number;
  body: string | null;
  createdAt: string;
  updatedAt: string;
  book: ReviewBook;
}

export function formatReviewDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export const UPSERT_REVIEW: TypedDocumentNode<
  { upsertReview: Review },
  { bookId: string; rating: number; body: string | null }
> = gql`
  mutation UpsertReview($bookId: ID!, $rating: Int!, $body: String) {
    upsertReview(bookId: $bookId, rating: $rating, body: $body) {
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
`;

export const DELETE_REVIEW: TypedDocumentNode<{ deleteReview: boolean }, { bookId: string }> = gql`
  mutation DeleteReview($bookId: ID!) {
    deleteReview(bookId: $bookId)
  }
`;

export const MY_REVIEWS: TypedDocumentNode<
  { me: { id: string; reviews: ReviewWithBook[] } | null },
  Record<string, never>
> = gql`
  query MyReviews {
    me {
      id
      reviews {
        id
        rating
        body
        createdAt
        updatedAt
        book {
          id
          title
          authors
          coverUrl
        }
      }
    }
  }
`;
