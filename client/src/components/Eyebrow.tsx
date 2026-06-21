import type { ReactNode } from 'react';
import { Typography } from '@mui/material';

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <Typography
      variant="overline"
      component="p"
      sx={{ color: 'gilt.main', mb: 1.5, lineHeight: 1 }}
    >
      {children}
    </Typography>
  );
}
