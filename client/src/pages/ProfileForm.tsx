import { useState, type SyntheticEvent } from 'react';
import { useMutation } from '@apollo/client/react';
import { Alert, Box, Button, CardContent, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from '../auth/authContext.ts';
import { AvatarUploader } from '../components/AvatarUploader.tsx';
import { Eyebrow } from '../components/Eyebrow.tsx';
import { OrnateDivider } from '../components/OrnateDivider.tsx';
import {
  REQUEST_AVATAR_UPLOAD_URL,
  UPDATE_PROFILE,
  type ProfileUser,
} from '../profile/operations.ts';
import { putFileToS3, validateImageFile } from '../lib/imageUpload.ts';
import { Header, PageCard } from './ProfilePage.styles.ts';

type Feedback = { type: 'success' | 'error'; message: string };

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong. Please try again.';
}

function ProfileForm({ me }: { me: ProfileUser }) {
  const { updateUser } = useAuth();

  const [name, setName] = useState(me.name);
  const [bio, setBio] = useState(me.bio ?? '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(me.avatarUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const [requestUploadUrl] = useMutation(REQUEST_AVATAR_UPLOAD_URL);
  const [updateProfile, { loading: saving }] = useMutation(UPDATE_PROFILE);

  const dirty = name.trim() !== me.name || bio !== (me.bio ?? '');

  const handleAvatarSelected = async (file: File) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      setFeedback({ type: 'error', message: validationError });
      return;
    }
    setUploading(true);
    try {
      const { data } = await requestUploadUrl({ variables: { contentType: file.type } });
      if (!data) throw new Error('Could not start the upload.');
      const { uploadUrl, publicUrl } = data.requestAvatarUploadUrl;
      await putFileToS3(uploadUrl, file);
      await updateProfile({ variables: { input: { avatarUrl: publicUrl } } });
      setAvatarUrl(publicUrl);
      updateUser({ avatarUrl: publicUrl });
      setFeedback({ type: 'success', message: 'Your portrait has been updated.' });
    } catch (err) {
      setFeedback({ type: 'error', message: getErrorMessage(err) });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      await updateProfile({ variables: { input: { name: name.trim(), bio } } });
      updateUser({ name: name.trim() });
      setFeedback({ type: 'success', message: 'Your profile has been saved.' });
    } catch (err) {
      setFeedback({ type: 'error', message: getErrorMessage(err) });
    }
  };

  return (
    <PageCard>
      <CardContent sx={{ p: { xs: 3.5, sm: 5 } }}>
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Eyebrow>Your Study</Eyebrow>
          <Typography variant="h4" sx={{ fontSize: '2.1rem' }}>
            Profile
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
            A portrait and a few words for the keeper of this library.
          </Typography>
          <OrnateDivider maxWidth={200} />
        </Box>

        <Header>
          <AvatarUploader
            src={avatarUrl}
            name={name || me.name}
            uploading={uploading}
            onFileSelected={handleAvatarSelected}
          />
          <Box>
            <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
              {me.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {me.email}
            </Typography>
          </Box>
        </Header>

        <Box component="form" onSubmit={handleSave}>
          <Stack spacing={2.5}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              fullWidth
              multiline
              minRows={3}
              placeholder="A line or two about the books you keep."
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              loading={saving}
              disabled={!dirty || !name.trim()}
            >
              Save changes
            </Button>
          </Stack>
        </Box>
      </CardContent>

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
    </PageCard>
  );
}

export default ProfileForm;
