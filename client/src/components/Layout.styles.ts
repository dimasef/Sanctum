import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';
import sanctumBackground from '../assets/bg.png';

export const Root = styled(Box)(({ theme }) => {
  const dark = theme.palette.mode === 'dark';
  const scrim = dark
    ? 'linear-gradient(rgba(16,13,9,0.84), rgba(16,13,9,0.94))'
    : 'linear-gradient(rgba(244,236,219,0.80), rgba(244,236,219,0.93))';
  const vignette = dark
    ? 'radial-gradient(120% 90% at 50% 0%, transparent 40%, rgba(0,0,0,0.55) 100%)'
    : 'radial-gradient(120% 90% at 50% 0%, transparent 45%, rgba(60,44,24,0.22) 100%)';
  return {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundImage: `${vignette}, ${scrim}, url(${sanctumBackground})`,
    backgroundSize: 'cover, cover, cover',
    backgroundPosition: 'center, center, center top',
    backgroundAttachment: 'fixed',
  };
});

export const Wordmark = styled('span')(({ theme }) => ({
  fontFamily: '"Fraunces", Georgia, serif',
  fontWeight: 600,
  fontSize: '1.4rem',
  letterSpacing: '0.04em',
  fontVariationSettings: '"opsz" 40',
  color: theme.palette.text.primary,
  lineHeight: 1,
}));

export const NavItem = styled(NavLink)(({ theme }) => ({
  position: 'relative',
  fontFamily: '"Spectral", Georgia, serif',
  fontWeight: 600,
  fontSize: '0.95rem',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  padding: theme.spacing(0.5, 0.5),
  transition: 'color 0.2s ease',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -4,
    height: 2,
    borderRadius: 2,
    background: theme.palette.gilt.main,
    transform: 'scaleX(0)',
    transformOrigin: 'center',
    transition: 'transform 0.25s ease',
  },
  '&:hover': { color: theme.palette.text.primary },
  '&.active': { color: theme.palette.primary.main },
  '&.active::after': { transform: 'scaleX(1)' },
}));

export const Footer = styled('footer')(({ theme }) => ({
  marginTop: 'auto',
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(4, 2),
  textAlign: 'center',
}));
