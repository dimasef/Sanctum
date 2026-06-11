import { Box, CircularProgress } from '@mui/material';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/authContext.ts';

function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  // Wait for the session bootstrap before deciding — otherwise we'd flash a
  // redirect to /login on reload while `me` is still in flight.
  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'anonymous') {
    // Remember where the user was headed so we can return them after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
