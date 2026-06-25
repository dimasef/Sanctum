import { useQuery } from '@apollo/client/react';
import { Alert, Stack } from '@mui/material';
import { CenteredSpinner } from '../components/CenteredSpinner.tsx';
import { MyReviewsList } from '../components/MyReviewsList.tsx';
import { ME_PROFILE } from '../profile/operations.ts';
import ProfileForm from './ProfileForm.tsx';

function ProfilePage() {
  const { data, loading, error } = useQuery(ME_PROFILE);

  if (loading) return <CenteredSpinner mt={10} />;
  if (error) return <Alert severity="error">{error.message}</Alert>;
  if (!data?.me) return null;

  return (
    <Stack spacing={6}>
      <ProfileForm me={data.me} />
      <MyReviewsList />
    </Stack>
  );
}

export default ProfilePage;
