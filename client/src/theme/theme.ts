import { createTheme, type Theme } from '@mui/material/styles';

export type ColorMode = 'light' | 'dark';

const display = '"Fraunces", "Iowan Old Style", Palatino, Georgia, serif';
const body = '"Spectral", "Iowan Old Style", Palatino, Georgia, serif';

const displayAxes = (opsz: number) => `"opsz" ${opsz}`;

declare module '@mui/material/styles' {
  interface Palette {
    gilt: { main: string; soft: string };
  }
  interface PaletteOptions {
    gilt?: { main: string; soft: string };
  }
}

export function getTheme(mode: ColorMode): Theme {
  const isLight = mode === 'light';

  const ink = '#241c12';
  const parchment = '#f4ecdb';

  const palette = isLight
    ? {
        primary: { main: '#8a6118', light: '#a87c2a', dark: '#6b4a12', contrastText: '#fdf8ee' },
        secondary: { main: '#2c6b4f' },
        gilt: { main: '#9c6f25', soft: '#caa258' },
        background: { default: parchment, paper: '#fcf7ec' },
        text: { primary: ink, secondary: 'rgba(36,28,18,0.62)' },
        divider: 'rgba(60,44,24,0.16)',
      }
    : {
        primary: { main: '#d9ad62', light: '#e6c483', dark: '#b88f47', contrastText: '#241c12' },
        secondary: { main: '#7fc6a2' },
        gilt: { main: '#d9ad62', soft: '#f0d29a' },
        background: { default: '#15110c', paper: '#1f1812' },
        text: { primary: '#ece2d0', secondary: 'rgba(236,226,208,0.60)' },
        divider: 'rgba(216,168,90,0.18)',
      };

  return createTheme({
    palette: { mode, ...palette },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: body,
      fontSize: 15,
      h1: {
        fontFamily: display,
        fontWeight: 600,
        letterSpacing: '-0.02em',
        fontVariationSettings: displayAxes(144),
      },
      h2: {
        fontFamily: display,
        fontWeight: 600,
        letterSpacing: '-0.015em',
        fontVariationSettings: displayAxes(110),
      },
      h3: {
        fontFamily: display,
        fontWeight: 600,
        letterSpacing: '-0.01em',
        fontVariationSettings: displayAxes(80),
      },
      h4: {
        fontFamily: display,
        fontWeight: 600,
        fontVariationSettings: displayAxes(48),
      },
      h5: {
        fontFamily: display,
        fontWeight: 600,
        fontVariationSettings: displayAxes(32),
      },
      h6: {
        fontFamily: display,
        fontWeight: 600,
        fontVariationSettings: displayAxes(24),
      },
      subtitle1: { fontFamily: body },
      button: {
        fontFamily: body,
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: '0.01em',
      },
      overline: {
        fontFamily: body,
        fontWeight: 600,
        letterSpacing: '0.32em',
        fontSize: '0.72rem',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            WebkitFontSmoothing: 'antialiased',
            textRendering: 'optimizeLegibility',
          },
          '::selection': {
            backgroundColor: isLight ? 'rgba(156,111,37,0.24)' : 'rgba(217,173,98,0.30)',
          },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0, color: 'default' },
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundImage: 'none',
          }),
        },
      },
      MuiCard: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: 'none',
            borderColor: theme.palette.divider,
          }),
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: ({ theme, ownerState }) => ({
            borderRadius: 8,
            paddingInline: 18,
            ...(ownerState.variant === 'outlined' && { borderColor: theme.palette.divider }),
            ...(ownerState.variant === 'contained' &&
              ownerState.color === 'primary' && {
                boxShadow: `inset 0 1px 0 ${
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.14)'
                    : 'rgba(255,255,255,0.40)'
                }`,
                '&:hover': { boxShadow: `0 6px 18px -8px ${theme.palette.primary.dark}` },
              }),
          }),
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor:
              theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.55)',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.divider },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.gilt.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.gilt.main,
              borderWidth: 1,
            },
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 500 },
          outlined: ({ theme }) => ({ borderColor: theme.palette.divider }),
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            textTransform: 'none',
            fontWeight: 600,
            borderColor: theme.palette.divider,
            color: theme.palette.text.secondary,
            '&.Mui-selected': {
              color: theme.palette.primary.main,
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(217,173,98,0.16)'
                  : 'rgba(138,97,24,0.12)',
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(217,173,98,0.24)'
                    : 'rgba(138,97,24,0.18)',
              },
            },
          }),
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: ({ theme }) => ({
            backgroundColor: theme.palette.mode === 'dark' ? '#2a2117' : '#2c2114',
            fontFamily: body,
            fontSize: '0.75rem',
          }),
        },
      },
    },
  });
}
