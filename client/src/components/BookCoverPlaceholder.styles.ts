import { styled } from '@mui/material/styles';

export const Cloth = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  overflow: 'hidden',
  containerType: 'inline-size',
  padding: theme.spacing(2.5),
  background: 'linear-gradient(155deg, #34594a 0%, #244338 52%, #1a3429 100%)',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 9,
    border: '1px solid rgba(216,176,98,0.45)',
    borderRadius: 2,
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 10,
    background:
      'linear-gradient(90deg, rgba(0,0,0,0.45), rgba(0,0,0,0.12) 55%, rgba(255,255,255,0.10) 80%, transparent)',
    pointerEvents: 'none',
  },
}));

export const Mark = styled('span')({
  color: '#d8b062',
  fontSize: 14,
  lineHeight: 1,
  opacity: 0.9,
});

export const Title = styled('span')({
  fontFamily: '"Fraunces", Georgia, serif',
  fontVariationSettings: '"opsz" 40',
  fontWeight: 600,
  color: '#e9cd83',
  letterSpacing: '0.01em',
  lineHeight: 1.2,
  margin: '12px 0',
  display: '-webkit-box',
  WebkitLineClamp: '5',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textShadow: '0 1px 1px rgba(0,0,0,0.35)',
  fontSize: 'clamp(0.95rem, 2.4cqw + 0.6rem, 1.6rem)',
});

export const Rule = styled('span')({
  width: 34,
  height: 1,
  background: 'rgba(216,176,98,0.55)',
});
