import { styled } from '@mui/material/styles';

export const Shelf = styled('section')(({ theme }) => ({
  marginBottom: theme.spacing(6),
}));

export const Ledge = styled('div')(({ theme }) => {
  const dark = theme.palette.mode === 'dark';
  const wood = dark
    ? 'linear-gradient(180deg, #3f2c18 0%, #2f2012 48%, #241a0e 100%)'
    : 'linear-gradient(180deg, #8a5e34 0%, #6a4626 46%, #4f3318 100%)';
  return {
    height: 16,
    marginTop: theme.spacing(2.5),
    borderRadius: 3,
    background: `repeating-linear-gradient(90deg, rgba(0,0,0,0.10) 0 2px, transparent 2px 9px), ${wood}`,
    boxShadow: '0 14px 22px -14px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,236,200,0.22)',
    borderBottom: `1px solid ${dark ? 'rgba(0,0,0,0.5)' : 'rgba(40,24,10,0.4)'}`,
  };
});
