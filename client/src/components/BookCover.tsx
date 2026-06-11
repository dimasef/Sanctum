import { useState } from 'react';
import { Box, CardMedia } from '@mui/material';
import { upgradeCoverUrl } from '../books/coverUrl.ts';

const coverSx = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  display: 'block',
} as const;

const placeholderSx = {
  ...coverSx,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bgcolor: 'action.hover',
  fontSize: 64,
} as const;

export function BookCover({ coverUrl, alt }: { coverUrl: string | null; alt: string }) {
  const sources = [...new Set([upgradeCoverUrl(coverUrl), coverUrl])].filter(
    (u): u is string => !!u,
  );
  const [step, setStep] = useState(0);
  const src = sources[step];

  if (!src) {
    return <Box sx={placeholderSx}>📖</Box>;
  }

  return (
    <CardMedia
      component="img"
      image={src}
      alt={alt}
      onError={() => setStep((s) => s + 1)}
      sx={coverSx}
    />
  );
}
