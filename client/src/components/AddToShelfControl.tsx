import { useState, type MouseEvent } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { Button, Checkbox, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import LibraryAddIcon from '@mui/icons-material/LibraryAddOutlined';
import { ShelfIcon } from './ShelfIcon.tsx';
import { useAuth } from '../auth/authContext.ts';
import { ADD_BOOK_TO_SHELF, MY_SHELVES, REMOVE_BOOK_FROM_SHELF } from '../shelf/operations.ts';

export function AddToShelfControl({ bookId }: { bookId: string }) {
  const { status } = useAuth();
  const authenticated = status === 'authenticated';
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { data } = useQuery(MY_SHELVES, { skip: !authenticated });
  const refetch = { refetchQueries: [{ query: MY_SHELVES }] };
  const [addBook] = useMutation(ADD_BOOK_TO_SHELF, refetch);
  const [removeBook] = useMutation(REMOVE_BOOK_FROM_SHELF, refetch);

  if (!authenticated) return null;

  const shelves = data?.me?.shelves ?? [];

  const toggle = (shelfId: string, isMember: boolean) => {
    const variables = { shelfId, bookId };
    if (isMember) void removeBook({ variables });
    else void addBook({ variables });
  };

  return (
    <>
      <Button
        size="small"
        startIcon={<LibraryAddIcon />}
        onClick={(e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}
      >
        Add to shelf
      </Button>
      <Menu anchorEl={anchorEl} open={anchorEl !== null} onClose={() => setAnchorEl(null)}>
        {shelves.length === 0 ? (
          <MenuItem disabled>No shelves yet</MenuItem>
        ) : (
          shelves.map((shelf) => {
            const isMember = shelf.books?.some((book) => book.id === bookId) ?? false;
            return (
              <MenuItem key={shelf.id} onClick={() => toggle(shelf.id, isMember)}>
                <Checkbox edge="start" checked={isMember} tabIndex={-1} disableRipple />
                <ListItemIcon>
                  <ShelfIcon icon={shelf.icon} sx={{ color: shelf.color }} fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={shelf.name} />
              </MenuItem>
            );
          })
        )}
      </Menu>
    </>
  );
}
