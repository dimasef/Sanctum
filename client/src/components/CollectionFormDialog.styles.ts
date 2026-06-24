import { styled } from '@mui/material/styles';

export const Swatch = styled('button', {
  shouldForwardProp: (prop) => prop !== 'swatchColor' && prop !== 'selected',
})<{ swatchColor: string; selected: boolean }>(({ theme, swatchColor, selected }) => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  cursor: 'pointer',
  padding: 0,
  backgroundColor: swatchColor,
  border: selected
    ? `2px solid ${theme.palette.gilt.main}`
    : '2px solid transparent',
  outline: selected ? `1px solid ${theme.palette.gilt.main}` : 'none',
  outlineOffset: 2,
  transition: 'transform 0.15s ease',
  '&:hover': { transform: 'scale(1.1)' },
}));
