import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Perspective = styled('div')({
  perspective: '1400px',
  cursor: 'pointer',
  outline: 'none',
  '&:hover .book-inner, &:focus-visible .book-inner': { transform: 'rotateY(180deg)' },
});

export const Inner = styled('div')({
  position: 'relative',
  width: '100%',
  aspectRatio: '2 / 3',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.85s cubic-bezier(0.2, 0.8, 0.2, 1)',
});

export const Face = styled('div')(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  backfaceVisibility: 'hidden',
  borderRadius: '3px 8px 8px 3px',
  overflow: 'hidden',
  isolation: 'isolate',
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 12px 28px rgba(0,0,0,0.45)',
}));

export const BackFace = styled(Face)(({ theme }) => ({
  transform: 'rotateY(180deg)',
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));

export const Spine = styled('div')({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  width: 12,
  pointerEvents: 'none',
  background:
    'linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 45%, rgba(255,255,255,0.18) 70%, rgba(0,0,0,0) 100%)',
});

export const TitleStrip = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  padding: theme.spacing(1.25),
  paddingLeft: theme.spacing(2),
  background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
}));

export const ClampedText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'lines',
})<{ lines: number }>(({ lines }) => ({
  display: '-webkit-box',
  WebkitLineClamp: String(lines),
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}));
