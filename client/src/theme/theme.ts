import { createTheme, type Theme } from '@mui/material/styles';

export type ColorMode = 'light' | 'dark';

// A warm, "library" palette: deep green + amber on paper-like backgrounds.
const serifHeadings =
  '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif';

export function getTheme(mode: ColorMode): Theme {
  const isLight = mode === 'light';

  return createTheme({
    palette: {
      mode,
      ...(isLight
        ? {
            primary: { main: '#2e6f55' },
            secondary: { main: '#b5793a' },
            background: { default: '#f5f2ea', paper: '#fffdf8' },
            text: { primary: '#241f1a' },
          }
        : {
            primary: { main: '#7cc4a1' },
            secondary: { main: '#d8a45f' },
            background: { default: '#121517', paper: '#1a1f22' },
          }),
    },
    shape: { borderRadius: 12 },
    typography: {
      h3: { fontFamily: serifHeadings, fontWeight: 700, letterSpacing: '-0.5px' },
      h4: { fontFamily: serifHeadings, fontWeight: 700 },
      h5: { fontFamily: serifHeadings, fontWeight: 600 },
      h6: { fontFamily: serifHeadings, fontWeight: 600 },
    },
    components: {
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
      },
    },
  });
}
