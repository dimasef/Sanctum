import { styled } from '@mui/material/styles';

export const Layout = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(5),
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('sm')]: { gridTemplateColumns: '260px 1fr' },
}));

export const InfoPanel = styled('div')(({ theme }) => ({
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(165deg, #241c14 0%, #1b150f 100%)'
      : 'linear-gradient(165deg, #fdf9ef 0%, #f4ead3 100%)',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 14,
  padding: theme.spacing(4),
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 26px 50px -28px rgba(0,0,0,0.85), inset 0 1px 0 rgba(217,173,98,0.08)'
      : '0 26px 50px -30px rgba(58,40,18,0.4), inset 0 1px 0 rgba(255,255,255,0.6)',
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(5) },
}));

export const CoverPane = styled('div')(({ theme }) => ({
  aspectRatio: '2 / 3',
  borderRadius: '3px 8px 8px 3px',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 26px 50px -18px rgba(0,0,0,0.75), inset 0 0 0 1px rgba(217,173,98,0.20)'
      : '0 26px 50px -20px rgba(58,40,18,0.5), inset 0 0 0 1px rgba(156,111,37,0.24)',
}));
