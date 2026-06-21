import { Box } from '@mui/material';
import { Gilt, Hairline } from './OrnateDivider.styles.ts';

export function OrnateDivider({ maxWidth = 320 }: { maxWidth?: number | string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        maxWidth,
        mx: 'auto',
        my: 3,
      }}
    >
      <Hairline />
      <Gilt sx={{ fontSize: 13, letterSpacing: 2 }}>✦</Gilt>
      <Hairline />
    </Box>
  );
}
