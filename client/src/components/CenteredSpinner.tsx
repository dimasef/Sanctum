import { Box, CircularProgress } from '@mui/material';

export function CenteredSpinner({ mt = 6 }: { mt?: number }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt }}>
      <CircularProgress />
    </Box>
  );
}
