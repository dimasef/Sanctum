import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

export const Grid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(3),
  gridTemplateColumns: 'repeat(1, 1fr)',
  [theme.breakpoints.up('sm')]: { gridTemplateColumns: 'repeat(2, 1fr)' },
  [theme.breakpoints.up('md')]: { gridTemplateColumns: 'repeat(3, 1fr)' },
}));

export const SpineCard = styled(RouterLink, {
  shouldForwardProp: (prop) => prop !== 'accent',
})<{ accent: string }>(({ theme, accent }) => {
  const dark = theme.palette.mode === 'dark';
  return {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(2.5, 2.5, 2.5, 3),
    textDecoration: 'none',
    color: theme.palette.text.primary,
    borderRadius: '4px 10px 10px 4px',
    overflow: 'hidden',
    background: dark
      ? 'linear-gradient(150deg, #241c14 0%, #1b150f 100%)'
      : 'linear-gradient(150deg, #fdf9ef 0%, #f4ead3 100%)',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: dark
      ? '0 18px 36px -26px rgba(0,0,0,0.85)'
      : '0 18px 36px -28px rgba(58,40,18,0.45)',
    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 8,
      background: accent,
    },
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: dark
        ? '0 26px 46px -24px rgba(0,0,0,0.9)'
        : '0 26px 46px -24px rgba(58,40,18,0.55)',
    },
  };
});
