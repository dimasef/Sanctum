import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const AvatarFrame = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 132,
  height: 132,
  borderRadius: '50%',
  cursor: 'pointer',
  flexShrink: 0,
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.gilt.main}`,
    outlineOffset: 3,
  },
}));

export const Ring = styled(Box)(({ theme }) => {
  const dark = theme.palette.mode === 'dark';
  return {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    padding: 3,
    background: `linear-gradient(145deg, ${theme.palette.gilt.main}, ${
      dark ? 'rgba(120,90,40,0.5)' : 'rgba(180,150,90,0.6)'
    })`,
    boxShadow: dark
      ? '0 18px 36px -20px rgba(0,0,0,0.8)'
      : '0 18px 36px -22px rgba(58,40,18,0.55)',
  };
});

export const Overlay = styled(Box)({
  position: 'absolute',
  inset: 3,
  borderRadius: '50%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 2,
  color: '#f6ecd8',
  background: 'rgba(20,14,8,0.55)',
  opacity: 0,
  transition: 'opacity 0.2s ease',
  fontFamily: '"Spectral", Georgia, serif',
  fontSize: '0.78rem',
  letterSpacing: '0.04em',
  [`${AvatarFrame}:hover &`]: {
    opacity: 1,
  },
});
