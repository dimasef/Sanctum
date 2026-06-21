import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

export function SectionHeading({ children, count }: { children: ReactNode; count?: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 3 }}>
      <Typography variant="h5" sx={{ flex: '0 0 auto' }}>
        {children}
      </Typography>
      {count !== undefined && (
        <Typography
          variant="caption"
          sx={{
            color: 'gilt.main',
            fontWeight: 600,
            fontFeatureSettings: '"tnum"',
            flex: '0 0 auto',
          }}
        >
          {count}
        </Typography>
      )}
      <Box
        sx={{
          flex: 1,
          height: '1px',
          background: (t) => `linear-gradient(90deg, ${t.palette.divider}, transparent)`,
          transform: 'translateY(-3px)',
        }}
      />
    </Box>
  );
}
