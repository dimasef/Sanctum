import { useQuery } from '@apollo/client/react';
import { Alert, Box, Button, Paper, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { BookFlipCard } from '../components/BookFlipCard.tsx';
import { BookGrid } from '../components/BookGrid.tsx';
import { CenteredSpinner } from '../components/CenteredSpinner.tsx';
import { Eyebrow } from '../components/Eyebrow.tsx';
import { OrnateDivider } from '../components/OrnateDivider.tsx';
import { SectionHeading } from '../components/SectionHeading.tsx';
import { ShelfStats } from '../components/ShelfStats.tsx';
import { MY_SHELF, STATUS_LABELS, STATUS_ORDER } from '../shelf/operations.ts';
import { Ledge, Shelf } from './ShelfPage.styles.ts';

function ShelfPage() {
  const { data, loading, error } = useQuery(MY_SHELF);

  if (loading) return <CenteredSpinner mt={10} />;

  if (error) return <Alert severity="error">{error.message}</Alert>;

  const items = data?.me?.shelf ?? [];

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Eyebrow>Your Reading Life</Eyebrow>
        <Typography variant="h2" sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem' } }}>
          My Shelf
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: 'text.secondary', fontStyle: 'italic', mt: 1.5 }}
        >
          The volumes you long for, those in hand, and the ones you&apos;ve closed.
        </Typography>
        <OrnateDivider />
      </Box>

      {items.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 7,
            textAlign: 'center',
            borderStyle: 'dashed',
            backgroundColor: 'transparent',
            maxWidth: 520,
            mx: 'auto',
          }}
        >
          <Typography sx={{ fontSize: 56, mb: 1 }}>📖</Typography>
          <Typography variant="h6" gutterBottom>
            Your shelf is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Find a book and add it to start tracking your reading.
          </Typography>
          <Button variant="contained" component={RouterLink} to="/">
            Discover books
          </Button>
        </Paper>
      ) : (
        <>
          <ShelfStats
            reading={items.filter((item) => item.status === 'READING').length}
            wantToRead={items.filter((item) => item.status === 'WANT_TO_READ').length}
            read={items.filter((item) => item.status === 'READ').length}
          />

          {STATUS_ORDER.map((statusKey) => {
            const books = items.filter((item) => item.status === statusKey);
            if (books.length === 0) return null;
            return (
              <Shelf key={statusKey}>
                <SectionHeading count={books.length}>{STATUS_LABELS[statusKey]}</SectionHeading>
                <BookGrid>
                  {books.map((item) => (
                    <BookFlipCard
                      key={item.id}
                      to={`/book/${item.book.id}`}
                      coverUrl={item.book.coverUrl}
                      title={item.book.title}
                      authors={item.book.authors}
                      publishedYear={item.book.publishedYear}
                      description={item.book.description}
                    />
                  ))}
                </BookGrid>
                <Ledge />
              </Shelf>
            );
          })}
        </>
      )}
    </Box>
  );
}

export default ShelfPage;
