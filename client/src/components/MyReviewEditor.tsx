import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { Alert, Button, Rating, Stack, TextField, Typography } from '@mui/material';
import { BOOK } from '../books/operations.ts';
import { DELETE_REVIEW, UPSERT_REVIEW, type Review } from '../reviews/operations.ts';
import { EditorCard } from './ReviewsSection.styles.ts';

interface MyReviewEditorProps {
  bookId: string;
  existing: Review | null;
}

export function MyReviewEditor({ bookId, existing }: MyReviewEditorProps) {
  const [rating, setRating] = useState<number | null>(existing?.rating ?? null);
  const [body, setBody] = useState(existing?.body ?? '');
  const [error, setError] = useState<string | null>(null);

  const refetch = { refetchQueries: [{ query: BOOK, variables: { id: bookId } }] };
  const [upsertReview, upsertState] = useMutation(UPSERT_REVIEW, refetch);
  const [deleteReview, deleteState] = useMutation(DELETE_REVIEW, refetch);
  const busy = upsertState.loading || deleteState.loading;

  const handleSave = async () => {
    if (rating === null) return;
    setError(null);
    try {
      await upsertReview({ variables: { bookId, rating, body: body.trim() || null } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your review.');
    }
  };

  const handleDelete = async () => {
    setError(null);
    try {
      await deleteReview({ variables: { bookId } });
      setRating(null);
      setBody('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete your review.');
    }
  };

  return (
    <EditorCard>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
        {existing ? 'Your review' : 'Write a review'}
      </Typography>
      <Rating
        value={rating}
        onChange={(_event, value) => setRating(value)}
        disabled={busy}
        size="large"
      />
      <TextField
        value={body}
        onChange={(event) => setBody(event.target.value)}
        disabled={busy}
        placeholder="Share your thoughts on this book… (optional)"
        multiline
        minRows={3}
        fullWidth
        sx={{ mt: 1.5 }}
      />
      <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
        <Button variant="contained" onClick={handleSave} disabled={rating === null || busy}>
          {existing ? 'Update review' : 'Post review'}
        </Button>
        {existing && (
          <Button color="inherit" onClick={handleDelete} disabled={busy}>
            Delete
          </Button>
        )}
      </Stack>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
    </EditorCard>
  );
}
