import { useState, type SyntheticEvent } from 'react';
import { useMutation } from '@apollo/client/react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { CollectionIcon } from './CollectionIcon.tsx';
import {
  COLLECTION_COLORS,
  COLLECTION_ICONS,
  CREATE_COLLECTION,
  MY_COLLECTIONS,
  UPDATE_COLLECTION,
  type Collection,
} from '../collections/operations.ts';
import { Swatch } from './CollectionFormDialog.styles.ts';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong. Please try again.';
}

interface CollectionFormDialogProps {
  open: boolean;
  onClose: () => void;
  collection?: Collection;
}

export function CollectionFormDialog({ open, onClose, collection }: CollectionFormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      {open && (
        <CollectionForm key={collection?.id ?? 'new'} collection={collection} onClose={onClose} />
      )}
    </Dialog>
  );
}

function CollectionForm({ collection, onClose }: { collection?: Collection; onClose: () => void }) {
  const isEdit = collection !== undefined;
  const [name, setName] = useState(collection?.name ?? '');
  const [color, setColor] = useState<string>(collection?.color ?? COLLECTION_COLORS[0]);
  const [icon, setIcon] = useState<string>(collection?.icon ?? COLLECTION_ICONS[0]);
  const [error, setError] = useState<string | null>(null);

  const [createCollection, createState] = useMutation(CREATE_COLLECTION, {
    refetchQueries: [{ query: MY_COLLECTIONS }],
  });
  const [updateCollection, updateState] = useMutation(UPDATE_COLLECTION);

  const submitting = createState.loading || updateState.loading;

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setError(null);
    const input = { name: name.trim(), color, icon };
    try {
      if (isEdit) {
        await updateCollection({ variables: { id: collection.id, input } });
      } else {
        await createCollection({ variables: { input } });
      }
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <>
      <DialogTitle sx={{ fontFamily: '"Fraunces", Georgia, serif' }}>
        {isEdit ? 'Edit collection' : 'New collection'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              autoFocus
            />
            <Box>
              <Box sx={{ mb: 1, color: 'text.secondary', fontSize: '0.85rem' }}>Colour</Box>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {COLLECTION_COLORS.map((c) => (
                  <Swatch
                    key={c}
                    type="button"
                    aria-label={`Colour ${c}`}
                    swatchColor={c}
                    selected={c === color}
                    onClick={() => setColor(c)}
                  />
                ))}
              </Box>
            </Box>
            <Box>
              <Box sx={{ mb: 1, color: 'text.secondary', fontSize: '0.85rem' }}>Icon</Box>
              <ToggleButtonGroup
                exclusive
                size="small"
                value={icon}
                onChange={(_e, value: string | null) => value && setIcon(value)}
                sx={{ flexWrap: 'wrap' }}
              >
                {COLLECTION_ICONS.map((key) => (
                  <ToggleButton key={key} value={key} sx={{ color }}>
                    <CollectionIcon icon={key} fontSize="small" />
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={submitting} disabled={!name.trim()}>
            {isEdit ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Box>
    </>
  );
}
