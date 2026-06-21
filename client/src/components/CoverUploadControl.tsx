import { useRef, useState, type ChangeEvent } from 'react';
import { useMutation } from '@apollo/client/react';
import { Alert, Button, Snackbar, Stack } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCameraOutlined';
import RestoreIcon from '@mui/icons-material/RestoreOutlined';
import {
  REMOVE_BOOK_COVER,
  REQUEST_COVER_UPLOAD_URL,
  SET_BOOK_COVER,
} from '../books/operations.ts';
import { ACCEPTED_IMAGE_TYPES, putFileToS3, validateImageFile } from '../lib/imageUpload.ts';

type Feedback = { type: 'success' | 'error'; message: string };

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong. Please try again.';
}

export function CoverUploadControl({
  bookId,
  hasCustomCover,
}: {
  bookId: string;
  hasCustomCover: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const [requestUploadUrl] = useMutation(REQUEST_COVER_UPLOAD_URL);
  const [setBookCover] = useMutation(SET_BOOK_COVER);
  const [removeBookCover, { loading: resetting }] = useMutation(REMOVE_BOOK_COVER);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setFeedback({ type: 'error', message: validationError });
      return;
    }

    setUploading(true);
    try {
      const { data } = await requestUploadUrl({
        variables: { bookId, contentType: file.type },
      });
      if (!data) throw new Error('Could not start the upload.');
      const { uploadUrl, publicUrl } = data.requestCoverUploadUrl;
      await putFileToS3(uploadUrl, file);
      await setBookCover({ variables: { bookId, coverUrl: publicUrl } });
      setFeedback({ type: 'success', message: 'Your cover for this book has been saved.' });
    } catch (err) {
      setFeedback({ type: 'error', message: getErrorMessage(err) });
    } finally {
      setUploading(false);
    }
  };

  const handleReset = async () => {
    try {
      await removeBookCover({ variables: { bookId } });
      setFeedback({ type: 'success', message: 'Restored the default cover.' });
    } catch (err) {
      setFeedback({ type: 'error', message: getErrorMessage(err) });
    }
  };

  return (
    <Stack spacing={1} sx={{ mt: 1.5 }}>
      <Button
        fullWidth
        size="small"
        variant="outlined"
        startIcon={<PhotoCameraIcon />}
        loading={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {hasCustomCover ? 'Replace your cover' : 'Use your own cover'}
      </Button>
      {hasCustomCover && (
        <Button
          fullWidth
          size="small"
          color="inherit"
          startIcon={<RestoreIcon />}
          loading={resetting}
          onClick={handleReset}
        >
          Reset to default
        </Button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        hidden
        onChange={handleChange}
      />

      <Snackbar
        open={feedback !== null}
        autoHideDuration={4000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {feedback ? (
          <Alert severity={feedback.type} onClose={() => setFeedback(null)} variant="filled">
            {feedback.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Stack>
  );
}
