import { Box, Menu, MenuItem } from '@mui/material';
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

export const AvatarButton = styled('button')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  border: 'none',
  background: 'none',
  borderRadius: '50%',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover, &[aria-expanded="true"]': {
    transform: 'translateY(-1px)',
    boxShadow: `0 0 0 4px ${theme.palette.gilt.soft}`,
  },
}));

export const UserMenu = styled(Menu)(({ theme }) => {
  const dark = theme.palette.mode === 'dark';
  return {
    '& .MuiPaper-root': {
      marginTop: theme.spacing(1.25),
      minWidth: 184,
      borderRadius: 12,
      border: `1px solid ${dark ? 'rgba(217,173,98,0.22)' : 'rgba(156,111,37,0.24)'}`,
      backgroundImage: dark
        ? 'linear-gradient(165deg, #241c14 0%, #1b150f 100%)'
        : 'linear-gradient(165deg, #fdf9ef 0%, #f4ead3 100%)',
      boxShadow: dark
        ? '0 22px 46px -22px rgba(0,0,0,0.85), inset 0 1px 0 rgba(217,173,98,0.08)'
        : '0 22px 46px -24px rgba(58,40,18,0.45), inset 0 1px 0 rgba(255,255,255,0.6)',
    },
    '& .MuiList-root': {
      padding: theme.spacing(0.75),
    },
  };
});

export const UserMenuItem = styled(MenuItem)(({ theme }) => ({
  fontFamily: '"Spectral", Georgia, serif',
  fontSize: '0.95rem',
  color: theme.palette.text.secondary,
  borderRadius: 8,
  padding: theme.spacing(1, 1.5),
  transition: 'background-color 0.15s ease, color 0.15s ease',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(217,173,98,0.10)' : 'rgba(156,111,37,0.08)',
    color: theme.palette.text.primary,
  },
}));

export const Footer = styled('footer')(({ theme }) => ({
  marginTop: 'auto',
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(4, 2),
  textAlign: 'center',
}));
