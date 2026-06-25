import { styled } from '@mui/material/styles';

export const EditorCard = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  padding: theme.spacing(2.5),
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(217,173,98,0.05)' : 'rgba(156,111,37,0.05)',
}));

export const ReviewList = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

export const ReviewItem = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.divider}`,
}));
