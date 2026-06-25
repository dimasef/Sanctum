import { Avatar, Box, Rating, Stack, Typography } from '@mui/material';
import { formatReviewDate, type Review } from '../reviews/operations.ts';
import { ReviewItem } from './ReviewsSection.styles.ts';

export function ReviewCard({ review }: { review: Review }) {
  return (
    <ReviewItem>
      <Avatar src={review.user.avatarUrl ?? undefined} sx={{ width: 44, height: 44 }}>
        {review.user.name.charAt(0).toUpperCase()}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ flexWrap: 'wrap', rowGap: 0.5, alignItems: 'center' }}
        >
          <Typography sx={{ fontWeight: 600 }}>{review.user.name}</Typography>
          <Rating value={review.rating} readOnly size="small" />
          <Typography variant="caption" color="text.secondary">
            {formatReviewDate(review.updatedAt)}
          </Typography>
        </Stack>
        {review.body && (
          <Typography
            variant="body1"
            sx={{ mt: 1, whiteSpace: 'pre-line', lineHeight: 1.7, color: 'text.secondary' }}
          >
            {review.body}
          </Typography>
        )}
      </Box>
    </ReviewItem>
  );
}
