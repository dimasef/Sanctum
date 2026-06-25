import { Box, Rating, Stack, Typography } from '@mui/material';
import { useAuth } from '../auth/authContext.ts';
import { Eyebrow } from './Eyebrow.tsx';
import { MyReviewEditor } from './MyReviewEditor.tsx';
import { ReviewCard } from './ReviewCard.tsx';
import { GiltRule, ReviewList } from './ReviewsSection.styles.ts';
import type { Review } from '../reviews/operations.ts';

export function ReviewsSection({ bookId, reviews }: { bookId: string; reviews: Review[] }) {
  const { status, user } = useAuth();
  const authenticated = status === 'authenticated';

  const myReview = user ? (reviews.find((review) => review.user.id === user.id) ?? null) : null;
  const others = user ? reviews.filter((review) => review.user.id !== user.id) : reviews;

  const count = reviews.length;
  const average = count ? reviews.reduce((sum, review) => sum + review.rating, 0) / count : 0;

  return (
    <Box sx={{ mt: 6 }}>
      <GiltRule sx={{ mb: 3 }} />
      <Stack
        direction="row"
        spacing={2}
        sx={{ flexWrap: 'wrap', rowGap: 1, mb: 3, alignItems: 'baseline' }}
      >
        <Eyebrow>Reviews</Eyebrow>
        {count > 0 && (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Rating value={average} precision={0.1} readOnly size="small" />
            <Typography variant="body2" color="text.secondary">
              {average.toFixed(1)} · {count} {count === 1 ? 'review' : 'reviews'}
            </Typography>
          </Stack>
        )}
      </Stack>

      {authenticated ? (
        <Box sx={{ mb: 4 }}>
          <MyReviewEditor key={`${bookId}:${myReview?.id ?? 'new'}`} bookId={bookId} existing={myReview} />
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Sign in to leave a review.
        </Typography>
      )}

      <ReviewList>
        {others.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        {others.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            {count === 0
              ? 'No reviews yet — be the first to share your thoughts.'
              : 'No other reviews yet.'}
          </Typography>
        )}
      </ReviewList>
    </Box>
  );
}
