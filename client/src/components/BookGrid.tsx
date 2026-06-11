import { styled } from '@mui/material/styles';

export const BookGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(3.5),
  gridTemplateColumns: 'repeat(2, 1fr)',
  [theme.breakpoints.up('sm')]: { gridTemplateColumns: 'repeat(3, 1fr)' },
  [theme.breakpoints.up('md')]: { gridTemplateColumns: 'repeat(4, 1fr)' },
}));
