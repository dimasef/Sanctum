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
import { ShelfIcon } from './ShelfIcon.tsx';
import {
  SHELF_COLORS,
  SHELF_ICONS,
  CREATE_SHELF,
  MY_SHELVES,
  UPDATE_SHELF,
  type Shelf,
} from '../shelf/operations.ts';
import { Swatch } from './ShelfFormDialog.styles.ts';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong. Please try again.';
}

interface ShelfFormDialogProps {
  open: boolean;
  onClose: () => void;
  shelf?: Shelf;
}

export function ShelfFormDialog({ open, onClose, shelf }: ShelfFormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      {open && <ShelfForm key={shelf?.id ?? 'new'} shelf={shelf} onClose={onClose} />}
    </Dialog>
  );
}

function ShelfForm({ shelf, onClose }: { shelf?: Shelf; onClose: () => void }) {
  const isEdit = shelf !== undefined;
  const [name, setName] = useState(shelf?.name ?? '');
  const [color, setColor] = useState<string>(shelf?.color ?? SHELF_COLORS[0]);
  const [icon, setIcon] = useState<string>(shelf?.icon ?? SHELF_ICONS[0]);
  const [error, setError] = useState<string | null>(null);

  const [createShelf, createState] = useMutation(CREATE_SHELF, {
    refetchQueries: [{ query: MY_SHELVES }],
  });
  const [updateShelf, updateState] = useMutation(UPDATE_SHELF);

  const submitting = createState.loading || updateState.loading;

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setError(null);
    const input = { name: name.trim(), color, icon };
    try {
      if (isEdit) {
        await updateShelf({ variables: { id: shelf.id, input } });
      } else {
        await createShelf({ variables: { input } });
      }
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <>
      <DialogTitle sx={{ fontFamily: '"Fraunces", Georgia, serif' }}>
        {isEdit ? 'Edit shelf' : 'New shelf'}
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
                {SHELF_COLORS.map((c) => (
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
                {SHELF_ICONS.map((key) => (
                  <ToggleButton key={key} value={key} sx={{ color }}>
                    <ShelfIcon icon={key} fontSize="small" />
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
