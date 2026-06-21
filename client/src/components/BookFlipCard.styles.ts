import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

export const Perspective = styled('div')({
  perspective: '1500px',
  transition: 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)',
  '&:hover': { transform: 'translateY(-7px)' },
  '&:hover .book-inner, &:focus-within .book-inner': { transform: 'rotateY(180deg)' },
});

export const CardLink = styled(RouterLink)({
  display: 'block',
  textDecoration: 'none',
  color: 'inherit',
  cursor: 'pointer',
  outline: 'none',
});

export const Inner = styled('div')({
  position: 'relative',
  width: '100%',
  aspectRatio: '2 / 3',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)',
  willChange: 'transform',
});

export const Face = styled('div')(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  backfaceVisibility: 'hidden',
  borderRadius: '3px 7px 7px 3px',
  overflow: 'hidden',
  isolation: 'isolate',
  backgroundColor: theme.palette.background.paper,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 18px 38px -12px rgba(0,0,0,0.75), inset 0 0 0 1px rgba(217,173,98,0.18)'
      : '0 18px 38px -14px rgba(58,40,18,0.55), inset 0 0 0 1px rgba(156,111,37,0.22)',
  // The fore-edge: a sliver of stacked pages along the right side.
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 3,
    bottom: 3,
    right: 0,
    width: 5,
    pointerEvents: 'none',
    background:
      'repeating-linear-gradient(90deg, rgba(247,238,220,0.95) 0 1px, rgba(196,178,142,0.55) 1px 2px)',
  },
}));

export const BackFace = styled(Face)(({ theme }) => ({
  transform: 'rotateY(180deg)',
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(160deg, #241c14, #1b150f)'
      : 'linear-gradient(160deg, #fdf9ef, #f3e9d3)',
  '&::after': { display: 'none' },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: `linear-gradient(90deg, transparent, ${theme.palette.gilt.main}, transparent)`,
  },
}));

export const Spine = styled('div')({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  width: 14,
  pointerEvents: 'none',
  background:
    'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.18) 42%, rgba(255,255,255,0.22) 68%, rgba(0,0,0,0) 100%)',
});

export const TitleStrip = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  padding: theme.spacing(1.25),
  paddingLeft: theme.spacing(2.25),
  background: 'linear-gradient(transparent, rgba(0,0,0,0.88))',
}));

export const ClampedText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'lines',
})<{ lines: number }>(({ lines }) => ({
  display: '-webkit-box',
  WebkitLineClamp: String(lines),
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}));
