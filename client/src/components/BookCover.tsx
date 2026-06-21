import { useState, type SyntheticEvent } from 'react';
import { CardMedia } from '@mui/material';
import { coverSrc } from '../books/coverUrl.ts';
import { BookCoverPlaceholder } from './BookCoverPlaceholder.tsx';

const coverSx = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  display: 'block',
} as const;

type CoverSize = 'card' | 'full';

const ZOOM: Record<CoverSize, number> = { card: 2, full: 0 };
const isUnavailable = (size: CoverSize, width: number) =>
  size === 'full' ? width < 1000 : width > 360;

export function BookCover({
  coverUrl,
  alt,
  size = 'card',
}: {
  coverUrl: string | null;
  alt: string;
  size?: CoverSize;
}) {
  const src = coverSrc(coverUrl, ZOOM[size]);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <BookCoverPlaceholder title={alt} />;
  }

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    if (src.includes('books.google') && isUnavailable(size, event.currentTarget.naturalWidth)) {
      setFailed(true);
    }
  };

  return (
    <CardMedia
      component="img"
      image={src}
      alt={alt}
      loading="lazy"
      onLoad={handleLoad}
      onError={() => setFailed(true)}
      sx={coverSx}
    />
  );
}
