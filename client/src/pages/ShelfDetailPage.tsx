import { useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { BookFlipCard } from '../components/BookFlipCard.tsx';
import { BookGrid } from '../components/BookGrid.tsx';
import { CenteredSpinner } from '../components/CenteredSpinner.tsx';
import { ShelfFormDialog } from '../components/ShelfFormDialog.tsx';
import { ShelfIcon } from '../components/ShelfIcon.tsx';
import { Eyebrow } from '../components/Eyebrow.tsx';
import { OrnateDivider } from '../components/OrnateDivider.tsx';
import { SectionHeading } from '../components/SectionHeading.tsx';
import {
  SHELF,
  DELETE_SHELF,
  MY_SHELVES,
  REMOVE_BOOK_FROM_SHELF,
} from '../shelf/operations.ts';
import {
  MY_READING,
  STATUS_LABELS,
  STATUS_ORDER,
  type ReadingState,
} from '../reading-status/operations.ts';

function ShelfDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(SHELF, { variables: { id } });
  const reading = useQuery(MY_READING);
  const [editOpen, setEditOpen] = useState(false);

  const [removeBook] = useMutation(REMOVE_BOOK_FROM_SHELF, {
    refetchQueries: [{ query: SHELF, variables: { id } }],
  });
  const [deleteShelf, deleteState] = useMutation(DELETE_SHELF, {
    refetchQueries: [{ query: MY_SHELVES }],
  });

  if (loading) return <CenteredSpinner mt={10} />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  const shelf = data?.shelf;
  if (!shelf) return <Alert severity="warning">Shelf not found.</Alert>;

  const books = shelf.books ?? [];

  const statusByBookId = new Map<string, ReadingState>(
    (reading.data?.me?.readingStatuses ?? []).map((item) => [item.book.id, item.status]),
  );
  const groups: { key: string; label: string; books: typeof books }[] = [
    ...STATUS_ORDER.map((statusKey) => ({
      key: statusKey,
      label: STATUS_LABELS[statusKey],
      books: books.filter((book) => statusByBookId.get(book.id) === statusKey),
    })),
    {
      key: 'UNSHELVED',
      label: 'Not on a reading shelf',
      books: books.filter((book) => !statusByBookId.has(book.id)),
    },
  ];

  const handleDelete = async () => {
    if (!window.confirm(`Delete the shelf “${shelf.name}”? This can't be undone.`)) return;
    await deleteShelf({ variables: { id } });
    navigate('/shelves');
  };

  const renderBook = (book: (typeof books)[number]) => (
    <BookFlipCard
      key={book.id}
      to={`/book/${book.id}`}
      coverUrl={book.coverUrl}
      title={book.title}
      authors={book.authors}
      publishedYear={book.publishedYear}
      description={book.description}
      action={
        <Button
          size="small"
          color="inherit"
          onClick={(e) => {
            e.preventDefault();
            void removeBook({ variables: { shelfId: id, bookId: book.id } });
          }}
        >
          Remove
        </Button>
      }
    />
  );

  return (
    <Box>
      <Button component={RouterLink} to="/shelves" sx={{ mb: 3, ml: -1 }}>
        ← My Shelves
      </Button>

      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Eyebrow>A Shelf</Eyebrow>
        <Box
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}
        >
          <ShelfIcon icon={shelf.icon} sx={{ color: shelf.color, fontSize: 40 }} />
          <Typography variant="h2" sx={{ fontSize: { xs: '2.2rem', sm: '3rem' } }}>
            {shelf.name}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', mt: 2 }}>
          <Button size="small" startIcon={<EditIcon />} onClick={() => setEditOpen(true)}>
            Edit
          </Button>
          <Button
            size="small"
            color="inherit"
            startIcon={<DeleteIcon />}
            disabled={deleteState.loading}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Stack>
        <OrnateDivider />
      </Box>

      {books.length === 0 ? (
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
          <Typography sx={{ fontSize: 56, mb: 1 }}>📚</Typography>
          <Typography variant="h6" gutterBottom>
            No books yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Open a book and add it to this shelf from its page.
          </Typography>
          <Button variant="contained" component={RouterLink} to="/">
            Discover books
          </Button>
        </Paper>
      ) : (
        groups.map((group) =>
          group.books.length === 0 ? null : (
            <Box key={group.key} sx={{ mb: 5 }}>
              <SectionHeading count={group.books.length}>{group.label}</SectionHeading>
              <BookGrid>{group.books.map(renderBook)}</BookGrid>
            </Box>
          ),
        )
      )}

      <ShelfFormDialog open={editOpen} onClose={() => setEditOpen(false)} shelf={shelf} />
    </Box>
  );
}

export default ShelfDetailPage;
