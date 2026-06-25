import { styled } from '@mui/material/styles';

export const Strip = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1),
  maxWidth: 560,
  margin: '0 auto',
  marginBottom: theme.spacing(6),
  padding: theme.spacing(2, 1),
  borderRadius: 14,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(31,24,18,0.82)' : 'rgba(252,247,236,0.85)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  boxShadow:
    theme.palette.mode === 'dark'
      ? 'inset 0 1px 0 rgba(217,173,98,0.08)'
      : 'inset 0 1px 0 rgba(255,255,255,0.6)',
}));

export const Stat = styled('div')(({ theme }) => ({
  flex: '1 1 0',
  minWidth: 88,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 1),
}));

export const StatNumber = styled('span')(({ theme }) => ({
  fontFamily: '"Fraunces", Georgia, serif',
  fontVariationSettings: '"opsz" 40',
  fontWeight: 600,
  fontSize: '2rem',
  lineHeight: 1,
  color: theme.palette.gilt.main,
  fontFeatureSettings: '"tnum"',
}));

export const Divider = styled('span')(({ theme }) => ({
  alignSelf: 'stretch',
  width: 1,
  margin: theme.spacing(1, 0),
  background: `linear-gradient(transparent, ${theme.palette.divider}, transparent)`,
}));
