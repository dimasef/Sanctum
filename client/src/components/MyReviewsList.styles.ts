import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

export const Container = styled('div')({
  width: '100%',
  maxWidth: 560,
  margin: '0 auto',
});

export const ReviewRow = styled(RouterLink)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  textDecoration: 'none',
  color: 'inherit',
  transition: 'border-color 120ms ease, background-color 120ms ease',
  '&:hover': {
    borderColor: theme.palette.gilt.main,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(217,173,98,0.06)' : 'rgba(156,111,37,0.05)',
  },
}));

export const Thumb = styled('div')(({ theme }) => ({
  width: 48,
  aspectRatio: '2 / 3',
  flexShrink: 0,
  borderRadius: '2px 4px 4px 2px',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
}));
