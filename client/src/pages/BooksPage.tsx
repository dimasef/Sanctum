import { gql, type TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Typography,
} from '@mui/material';

interface Book {
  id: string;
  title: string;
  authors: string[];
  coverUrl: string | null;
  publishedYear: number | null;
}
interface BooksData {
  books: Book[];
}

const BOOKS: TypedDocumentNode<BooksData, Record<string, never>> = gql`
  query Books {
    books {
      id
      title
      authors
      coverUrl
      publishedYear
    }
  }
`;

function BooksPage() {
  const { data, loading, error } = useQuery(BOOKS);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Discover books
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Your personal library, beautifully kept.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
        }}
      >
        {data?.books.map((book) => (
          <Card
            key={book.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
            }}
          >
            {book.coverUrl ? (
              <CardMedia
                component="img"
                image={book.coverUrl}
                alt={book.title}
                sx={{ height: 240, objectFit: 'cover' }}
              />
            ) : (
              <Box
                sx={{
                  height: 240,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'action.hover',
                  fontSize: 56,
                }}
              >
                📖
              </Box>
            )}

            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                {book.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {book.authors.length > 0 ? book.authors.join(', ') : 'Unknown author'}
              </Typography>
              {book.publishedYear !== null && (
                <Chip label={book.publishedYear} size="small" sx={{ mt: 1.5 }} />
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default BooksPage;
