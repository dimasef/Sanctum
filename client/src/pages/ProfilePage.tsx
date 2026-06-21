import { useQuery } from '@apollo/client/react';
import { Alert } from '@mui/material';
import { CenteredSpinner } from '../components/CenteredSpinner.tsx';
import { ME_PROFILE } from '../profile/operations.ts';
import ProfileForm from './ProfileForm.tsx';

function ProfilePage() {
  const { data, loading, error } = useQuery(ME_PROFILE);

  if (loading) return <CenteredSpinner mt={10} />;
  if (error) return <Alert severity="error">{error.message}</Alert>;
  if (!data?.me) return null;

  return <ProfileForm me={data.me} />;
}

export default ProfilePage;
