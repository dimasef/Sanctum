import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { Alert, Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { CenteredSpinner } from '../components/CenteredSpinner.tsx';
import { CollectionFormDialog } from '../components/CollectionFormDialog.tsx';
import { CollectionIcon } from '../components/CollectionIcon.tsx';
import { Eyebrow } from '../components/Eyebrow.tsx';
import { OrnateDivider } from '../components/OrnateDivider.tsx';
import { MY_COLLECTIONS } from '../collections/operations.ts';
import { Grid, SpineCard } from './CollectionsPage.styles.ts';

const ALL_BOOKS_ACCENT = '#8a6118';

function CollectionsPage() {
  const { data, loading, error } = useQuery(MY_COLLECTIONS);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (loading) return <CenteredSpinner mt={10} />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  const collections = data?.me?.collections ?? [];

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Eyebrow>Your Library, Curated</Eyebrow>
        <Typography variant="h2" sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem' } }}>
          My Shelves
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontStyle: 'italic', mt: 1.5 }}>
          Every volume by reading status, and the shelves of your own making.
        </Typography>
        <OrnateDivider />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          New shelf
        </Button>
      </Box>

      <Grid>
        <SpineCard to="/shelf" accent={ALL_BOOKS_ACCENT}>
          <AutoStoriesIcon sx={{ color: ALL_BOOKS_ACCENT, fontSize: 32 }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: '"Fraunces", Georgia, serif',
                fontSize: '1.2rem',
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              All books
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Grouped by reading status
            </Typography>
          </Box>
        </SpineCard>

        {collections.map((collection) => (
          <SpineCard key={collection.id} to={`/collections/${collection.id}`} accent={collection.color}>
            <CollectionIcon icon={collection.icon} sx={{ color: collection.color, fontSize: 32 }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: '"Fraunces", Georgia, serif',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {collection.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {collection.bookCount} {collection.bookCount === 1 ? 'volume' : 'volumes'}
              </Typography>
            </Box>
          </SpineCard>
        ))}
      </Grid>

      {collections.length === 0 && (
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', fontStyle: 'italic', textAlign: 'center', mt: 4 }}
        >
          Create a shelf to group books by theme, mood or author.
        </Typography>
      )}

      <CollectionFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Box>
  );
}

export default CollectionsPage;
