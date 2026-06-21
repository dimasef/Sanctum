import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  Alert,
  Box,
  Button,
  InputAdornment,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { BookFlipCard } from '../components/BookFlipCard.tsx';
import { BookGrid } from '../components/BookGrid.tsx';
import { CenteredSpinner } from '../components/CenteredSpinner.tsx';
import { Eyebrow } from '../components/Eyebrow.tsx';
import { OrnateDivider } from '../components/OrnateDivider.tsx';
import { SectionHeading } from '../components/SectionHeading.tsx';
import { BOOKS, IMPORT_BOOK, SEARCH_BOOKS } from '../books/operations.ts';
import { MY_SHELF, type ShelfItem } from '../shelf/operations.ts';
import { useAuth } from '../auth/authContext.ts';

const MIN_QUERY_LENGTH = 2;

function HomePage() {
  const { status, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = status === 'authenticated';

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
  const shelf = useQuery(MY_SHELF, { skip: !isAuthenticated });
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
    if (!isAuthenticated) {
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
      return (
        <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Nothing found for “{query}”. Try another title or author.
        </Typography>
      );
    }

    return (
      <>
        <SectionHeading count={results.length}>Found in the world&apos;s books</SectionHeading>
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
      </>
    );
  };

  const renderHome = () => {
    if (catalog.loading || (isAuthenticated && shelf.loading)) return <CenteredSpinner />;
    if (catalog.error) return <Alert severity="error">{catalog.error.message}</Alert>;

    const books = catalog.data?.books ?? [];
    const shelfItems: ShelfItem[] = isAuthenticated ? (shelf.data?.me?.shelf ?? []) : [];
    const shelfBookIds = new Set(shelfItems.map((item) => item.book.id));

    const personalSections = [
      { title: 'Continue reading', items: shelfItems.filter((i) => i.status === 'READING') },
      { title: 'Want to read', items: shelfItems.filter((i) => i.status === 'WANT_TO_READ') },
    ].filter((section) => section.items.length > 0);

    const discovery = isAuthenticated
      ? books.filter((book) => !shelfBookIds.has(book.id))
      : books;

    return (
      <>
        {personalSections.map((section) => (
          <Box key={section.title} sx={{ mb: 5 }}>
            <SectionHeading count={section.items.length}>{section.title}</SectionHeading>
            <BookGrid>
              {section.items.map((item) => (
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
          </Box>
        ))}

        {isAuthenticated && shelfItems.length === 0 && (
          <Typography color="text.secondary" sx={{ fontStyle: 'italic', mb: 5 }}>
            Your shelves are empty — search above to add your first volume, or pick one from
            Sanctum below.
          </Typography>
        )}

        {discovery.length > 0 && (
          <Box>
            <SectionHeading count={discovery.length}>
              {isAuthenticated ? 'More in Sanctum' : 'Recently added to Sanctum'}
            </SectionHeading>
            <BookGrid>
              {discovery.map((book) => (
                <BookFlipCard
                  key={book.id}
                  to={`/book/${book.id}`}
                  coverUrl={book.coverUrl}
                  title={book.title}
                  authors={book.authors}
                  publishedYear={book.publishedYear}
                  description={book.description}
                />
              ))}
            </BookGrid>
            {!isAuthenticated && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 3, fontStyle: 'italic' }}
              >
                Volumes readers have brought into Sanctum.{' '}
                <MuiLink component={RouterLink} to="/login">
                  Sign in
                </MuiLink>{' '}
                to start shelves of your own.
              </Typography>
            )}
          </Box>
        )}

        {discovery.length === 0 && personalSections.length === 0 && (
          <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
            The shelves stand empty — search above to add your first volume.
          </Typography>
        )}
      </>
    );
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Eyebrow>{isAuthenticated ? `Welcome back, ${user?.name ?? 'reader'}` : 'Your Private Library'}</Eyebrow>
        <Typography variant="h1" sx={{ fontSize: { xs: '3rem', sm: '4.5rem' }, lineHeight: 1 }}>
          Sanctum
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: 'text.secondary',
            fontStyle: 'italic',
            mt: 2,
            fontSize: '1.1rem',
            maxWidth: 560,
            mx: 'auto',
          }}
        >
          Search the world&apos;s books, and keep the ones that matter close — a quiet
          room of your own making.
        </Typography>
        <OrnateDivider />
      </Box>

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
                <SearchIcon sx={{ color: 'gilt.main' }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          maxWidth: 640,
          mx: 'auto',
          display: 'flex',
          mb: 6,
          '& .MuiOutlinedInput-root': { borderRadius: 999, px: 1 },
          '& input': { py: 1.6, fontSize: '1.05rem' },
        }}
      />

      {importError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setImportError(null)}>
          {importError}
        </Alert>
      )}

      {searching ? renderSearch() : renderHome()}
    </Box>
  );
}

export default HomePage;
