import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';

export const PageCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 560,
  margin: '0 auto',
  backgroundColor: theme.palette.background.paper,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 30px 60px -30px rgba(0,0,0,0.8)'
      : '0 30px 60px -32px rgba(58,40,18,0.45)',
}));

export const Header = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    textAlign: 'center',
  },
}));
