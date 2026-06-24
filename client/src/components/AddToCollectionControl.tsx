import { useState, type MouseEvent } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { Button, Checkbox, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import LibraryAddIcon from '@mui/icons-material/LibraryAddOutlined';
import { CollectionIcon } from './CollectionIcon.tsx';
import { useAuth } from '../auth/authContext.ts';
import {
  ADD_BOOK_TO_COLLECTION,
  MY_COLLECTIONS,
  REMOVE_BOOK_FROM_COLLECTION,
} from '../collections/operations.ts';

export function AddToCollectionControl({ bookId }: { bookId: string }) {
  const { status } = useAuth();
  const authenticated = status === 'authenticated';
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { data } = useQuery(MY_COLLECTIONS, { skip: !authenticated });
  const refetch = { refetchQueries: [{ query: MY_COLLECTIONS }] };
  const [addBook] = useMutation(ADD_BOOK_TO_COLLECTION, refetch);
  const [removeBook] = useMutation(REMOVE_BOOK_FROM_COLLECTION, refetch);

  if (!authenticated) return null;

  const collections = data?.me?.collections ?? [];

  const toggle = (collectionId: string, isMember: boolean) => {
    const variables = { collectionId, bookId };
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
        Add to collection
      </Button>
      <Menu anchorEl={anchorEl} open={anchorEl !== null} onClose={() => setAnchorEl(null)}>
        {collections.length === 0 ? (
          <MenuItem disabled>No collections yet</MenuItem>
        ) : (
          collections.map((collection) => {
            const isMember = collection.books?.some((book) => book.id === bookId) ?? false;
            return (
              <MenuItem key={collection.id} onClick={() => toggle(collection.id, isMember)}>
                <Checkbox edge="start" checked={isMember} tabIndex={-1} disableRipple />
                <ListItemIcon>
                  <CollectionIcon icon={collection.icon} sx={{ color: collection.color }} fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={collection.name} />
              </MenuItem>
            );
          })
        )}
      </Menu>
    </>
  );
}
