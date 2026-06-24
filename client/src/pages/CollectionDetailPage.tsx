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

function CollectionDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(COLLECTION, { variables: { id } });
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

  const handleDelete = async () => {
    if (!window.confirm(`Delete the collection “${collection.name}”? This can't be undone.`)) return;
    await deleteCollection({ variables: { id } });
    navigate('/collections');
  };

  return (
    <Box>
      <Button component={RouterLink} to="/collections" sx={{ mb: 3, ml: -1 }}>
        ← Collections
      </Button>

      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Eyebrow>A Collection</Eyebrow>
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
        <>
          <SectionHeading count={books.length}>Volumes</SectionHeading>
          <BookGrid>
            {books.map((book) => (
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
            ))}
          </BookGrid>
        </>
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
