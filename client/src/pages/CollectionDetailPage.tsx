import { useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { BookFlipCard } from '../components/BookFlipCard.tsx';
import { BookGrid } from '../components/BookGrid.tsx';
import { CenteredSpinner } from '../components/CenteredSpinner.tsx';
import { CollectionFormDialog } from '../components/CollectionFormDialog.tsx';
import { CollectionIcon } from '../components/CollectionIcon.tsx';
import { Eyebrow } from '../components/Eyebrow.tsx';
import { OrnateDivider } from '../components/OrnateDivider.tsx';
import { SectionHeading } from '../components/SectionHeading.tsx';
import {
  COLLECTION,
  DELETE_COLLECTION,
  MY_COLLECTIONS,
  REMOVE_BOOK_FROM_COLLECTION,
} from '../collections/operations.ts';
import { MY_SHELF, STATUS_LABELS, STATUS_ORDER, type ShelfStatus } from '../shelf/operations.ts';

function CollectionDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(COLLECTION, { variables: { id } });
  const shelf = useQuery(MY_SHELF);
  const [editOpen, setEditOpen] = useState(false);

  const [removeBook] = useMutation(REMOVE_BOOK_FROM_COLLECTION, {
    refetchQueries: [{ query: COLLECTION, variables: { id } }],
  });
  const [deleteCollection, deleteState] = useMutation(DELETE_COLLECTION, {
    refetchQueries: [{ query: MY_COLLECTIONS }],
  });

  if (loading) return <CenteredSpinner mt={10} />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  const collection = data?.collection;
  if (!collection) return <Alert severity="warning">Collection not found.</Alert>;

  const books = collection.books ?? [];

  const statusByBookId = new Map<string, ShelfStatus>(
    (shelf.data?.me?.shelf ?? []).map((item) => [item.book.id, item.status]),
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
    if (!window.confirm(`Delete the shelf “${collection.name}”? This can't be undone.`)) return;
    await deleteCollection({ variables: { id } });
    navigate('/collections');
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
            void removeBook({ variables: { collectionId: id, bookId: book.id } });
          }}
        >
          Remove
        </Button>
      }
    />
  );

  return (
    <Box>
      <Button component={RouterLink} to="/collections" sx={{ mb: 3, ml: -1 }}>
        ← My Shelves
      </Button>

      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Eyebrow>A Shelf</Eyebrow>
        <Box
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}
        >
          <CollectionIcon icon={collection.icon} sx={{ color: collection.color, fontSize: 40 }} />
          <Typography variant="h2" sx={{ fontSize: { xs: '2.2rem', sm: '3rem' } }}>
            {collection.name}
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
            Open a book and add it to this collection from its page.
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

      <CollectionFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        collection={collection}
      />
    </Box>
  );
}

export default CollectionDetailPage;
