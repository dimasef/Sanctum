import { useQuery } from '@apollo/client/react';
import { Alert, Box, Rating, Stack, Typography } from '@mui/material';
import { BookCover } from './BookCover.tsx';
import { CenteredSpinner } from './CenteredSpinner.tsx';
import { Eyebrow } from './Eyebrow.tsx';
import { formatReviewDate, MY_REVIEWS } from '../reviews/operations.ts';
import { Container, ReviewRow, Thumb } from './MyReviewsList.styles.ts';

export function MyReviewsList() {
  const { data, loading, error } = useQuery(MY_REVIEWS, { fetchPolicy: 'cache-and-network' });

  if (loading && !data) return <CenteredSpinner mt={4} />;
  if (error && !data) return <Alert severity="error">{error.message}</Alert>;

  const reviews = data?.me?.reviews ?? [];

  return (
    <Container>
      <Eyebrow>My Reviews</Eyebrow>
      <Box sx={{ mt: 2 }}>
        {reviews.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            You haven't reviewed any books yet.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {reviews.map((review) => (
              <ReviewRow key={review.id} to={`/book/${review.book.id}`}>
                <Thumb>
                  <BookCover coverUrl={review.book.coverUrl} alt={review.book.title} size="card" />
                </Thumb>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600 }} noWrap>
                    {review.book.title}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 0.5, flexWrap: 'wrap', rowGap: 0.5, alignItems: 'center' }}
                  >
                    <Rating value={review.rating} readOnly size="small" />
                    <Typography variant="caption" color="text.secondary">
                      {formatReviewDate(review.updatedAt)}
                    </Typography>
                  </Stack>
                  {review.body && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {review.body}
                    </Typography>
                  )}
                </Box>
              </ReviewRow>
            ))}
          </Stack>
        )}
      </Box>
    </Container>
  );
}
