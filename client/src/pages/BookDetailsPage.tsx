import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { BookCover } from '../components/BookCover.tsx';
import { CoverUploadControl } from '../components/CoverUploadControl.tsx';
import { BOOK } from '../books/operations.ts';
import { stripHtml } from '../books/stripHtml.ts';
import {
  ADD_TO_SHELF,
  MOVE_ON_SHELF,
  MY_SHELF,
  REMOVE_FROM_SHELF,
  STATUS_LABELS,
  STATUS_ORDER,
  type ShelfStatus,
} from '../shelf/operations.ts';
import { useAuth } from '../auth/authContext.ts';
import { CenteredSpinner } from '../components/CenteredSpinner.tsx';
import { Eyebrow } from '../components/Eyebrow.tsx';
import { CoverPane, InfoPanel, Layout } from './BookDetailsPage.styles.ts';

function BookDetailsPage() {
  const { id = '' } = useParams();
  const { status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { data, loading, error } = useQuery(BOOK, { variables: { id } });
  const shelf = useQuery(MY_SHELF, { skip: status !== 'authenticated' });

  const [addToShelf, addState] = useMutation(ADD_TO_SHELF, {
    refetchQueries: [{ query: MY_SHELF }],
  });
  const [moveOnShelf, moveState] = useMutation(MOVE_ON_SHELF);
  const [removeFromShelf, removeState] = useMutation(REMOVE_FROM_SHELF, {
    refetchQueries: [{ query: MY_SHELF }],
  });

  const [shelfError, setShelfError] = useState<string | null>(null);

  if (loading) return <CenteredSpinner mt={10} />;
  if (error) return <Alert severity="error">{error.message}</Alert>;
  if (!data?.book) return <Alert severity="warning">Book not found.</Alert>;

  const book = data.book;
  const currentStatus = shelf.data?.me?.shelf.find((item) => item.book.id === id)?.status ?? null;
  const busy = addState.loading || moveState.loading || removeState.loading;
  const blurb = stripHtml(book.description);

  const handleStatus = async (next: ShelfStatus) => {
    if (status !== 'authenticated') {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (next === currentStatus) return;
    setShelfError(null);
    try {
      if (currentStatus === null) await addToShelf({ variables: { bookId: id, status: next } });
      else await moveOnShelf({ variables: { bookId: id, status: next } });
    } catch (err) {
      setShelfError(err instanceof Error ? err.message : 'Could not update your shelf.');
    }
  };

  const handleRemove = async () => {
    setShelfError(null);
    try {
      await removeFromShelf({ variables: { bookId: id } });
    } catch (err) {
      setShelfError(err instanceof Error ? err.message : 'Could not update your shelf.');
    }
  };

  return (
    <Box>
      <Button component={RouterLink} to="/" sx={{ mb: 3, ml: -1 }}>
        ← Back
      </Button>

      <Layout>
        <Box sx={{ alignSelf: 'start', position: { sm: 'sticky' }, top: (t) => t.spacing(12) }}>
          <CoverPane>
            <BookCover key={book.coverUrl} coverUrl={book.coverUrl} alt={book.title} size="full" />
          </CoverPane>
          {status === 'authenticated' && (
            <CoverUploadControl bookId={book.id} hasCustomCover={book.hasCustomCover} />
          )}
        </Box>

        <InfoPanel>
          <Eyebrow>From the Collection</Eyebrow>
          <Typography variant="h3" sx={{ fontSize: { xs: '2.2rem', sm: '2.8rem' } }} gutterBottom>
            {book.title}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: 'text.secondary', fontStyle: 'italic', fontSize: '1.1rem' }}
          >
            {book.authors.length > 0 ? book.authors.join(', ') : 'Unknown author'}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
            {book.publishedYear !== null && <Chip label={book.publishedYear} size="small" />}
            {book.isbn && <Chip label={`ISBN ${book.isbn}`} size="small" variant="outlined" />}
          </Stack>

          <Box sx={{ mt: 3 }}>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={currentStatus}
              disabled={busy}
              onChange={(_event, value: ShelfStatus | null) => value && handleStatus(value)}
            >
              {STATUS_ORDER.map((s) => (
                <ToggleButton key={s} value={s}>
                  {STATUS_LABELS[s]}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            {currentStatus && status === 'authenticated' && (
              <Button color="inherit" disabled={busy} onClick={handleRemove} sx={{ ml: 1 }}>
                Remove
              </Button>
            )}

            {status !== 'authenticated' && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Sign in to keep this book on your shelf.
              </Typography>
            )}
          </Box>

          {shelfError && (
            <Alert severity="error" sx={{ mt: 2 }} onClose={() => setShelfError(null)}>
              {shelfError}
            </Alert>
          )}

          <Box
            sx={{
              mt: 4,
              mb: 2,
              height: '1px',
              background: (t) => `linear-gradient(90deg, ${t.palette.gilt.main}, transparent)`,
              opacity: 0.6,
            }}
          />
          <Typography
            variant="body1"
            sx={{ whiteSpace: 'pre-line', lineHeight: 1.8, fontSize: '1.05rem' }}
          >
            {blurb ?? 'No description available.'}
          </Typography>
        </InfoPanel>
      </Layout>
    </Box>
  );
}

export default BookDetailsPage;
