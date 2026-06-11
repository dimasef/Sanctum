import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { BookFlipCard } from '../components/BookFlipCard.tsx';
import { BookGrid } from '../components/BookGrid.tsx';
import { BOOKS, IMPORT_BOOK, SEARCH_BOOKS } from '../books/operations.ts';
import { useAuth } from '../auth/authContext.ts';

const MIN_QUERY_LENGTH = 2;

function CenteredSpinner() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <CircularProgress />
    </Box>
  );
}

function HomePage() {
  const { status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [term, setTerm] = useState('');
  const [query, setQuery] = useState('');
  const [imported, setImported] = useState<Set<string>>(new Set());
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setQuery(term.trim()), 350);
    return () => clearTimeout(id);
  }, [term]);

  const searching = query.length >= MIN_QUERY_LENGTH;

  const catalog = useQuery(BOOKS);
  const search = useQuery(SEARCH_BOOKS, { variables: { query }, skip: !searching });

  const [importBook] = useMutation(IMPORT_BOOK, {
    update(cache, { data }) {
      const book = data?.importBook;
      if (!book) return;
      const existing = cache.readQuery({ query: BOOKS });
      if (!existing || existing.books.some((b) => b.id === book.id)) return;
      cache.writeQuery({ query: BOOKS, data: { books: [book, ...existing.books] } });
    },
  });

  const handleImport = async (googleId: string) => {
    if (status !== 'authenticated') {
      navigate('/login', { state: { from: location } });
      return;
    }
    setImportError(null);
    setPendingId(googleId);
    try {
      await importBook({ variables: { googleId } });
      setImported((prev) => new Set(prev).add(googleId));
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Could not import this book.');
    } finally {
      setPendingId(null);
    }
  };

  const libraryGoogleIds = new Set((catalog.data?.books ?? []).map((b) => b.googleId));

  const renderSearch = () => {
    if (search.error) return <Alert severity="error">{search.error.message}</Alert>;

    const results = (search.data ?? search.previousData)?.searchBooks ?? [];
    if (search.loading && results.length === 0) return <CenteredSpinner />;
    if (!search.loading && results.length === 0) {
      return <Typography color="text.secondary">No books found for “{query}”.</Typography>;
    }

    return (
      <BookGrid>
        {results.map((book) => {
          const isImported = imported.has(book.googleId) || libraryGoogleIds.has(book.googleId);
          return (
            <BookFlipCard
              key={book.googleId}
              coverUrl={book.coverUrl}
              title={book.title}
              authors={book.authors}
              publishedYear={book.publishedYear}
              description={book.description}
              action={
                <Button
                  fullWidth
                  size="small"
                  variant={isImported ? 'outlined' : 'contained'}
                  disabled={isImported}
                  loading={pendingId === book.googleId}
                  onClick={() => handleImport(book.googleId)}
                >
                  {isImported ? 'In library' : 'Import'}
                </Button>
              }
            />
          );
        })}
      </BookGrid>
    );
  };

  const renderCatalogue = () => {
    if (catalog.loading) return <CenteredSpinner />;
    if (catalog.error) return <Alert severity="error">{catalog.error.message}</Alert>;

    const books = catalog.data?.books ?? [];
    if (books.length === 0) {
      return (
        <Typography color="text.secondary">
          Your library is empty — search above to add your first book.
        </Typography>
      );
    }

    return (
      <BookGrid>
        {books.map((book) => (
          <BookFlipCard
            key={book.id}
            coverUrl={book.coverUrl}
            title={book.title}
            authors={book.authors}
            publishedYear={book.publishedYear}
            description={book.description}
          />
        ))}
      </BookGrid>
    );
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Sanctum
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Your private library. Search the world&apos;s books and keep your own.
      </Typography>

      <TextField
        placeholder="Search by title, author or ISBN…"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        fullWidth
        autoFocus
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 4 }}
      />

      {importError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setImportError(null)}>
          {importError}
        </Alert>
      )}

      {!searching && (
        <Typography variant="h5" sx={{ mb: 2.5 }}>
          Your library
        </Typography>
      )}

      {searching ? renderSearch() : renderCatalogue()}
    </Box>
  );
}

export default HomePage;
