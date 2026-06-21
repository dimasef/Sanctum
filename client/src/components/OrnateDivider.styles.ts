import { styled } from '@mui/material/styles';

export const Gilt = styled('span')(({ theme }) => ({
  color: theme.palette.gilt.main,
  flex: '0 0 auto',
}));

export const Hairline = styled('span')(({ theme }) => ({
  flex: 1,
  height: 1,
  background: `linear-gradient(90deg, transparent, ${theme.palette.gilt.main}, transparent)`,
  opacity: 0.55,
}));
