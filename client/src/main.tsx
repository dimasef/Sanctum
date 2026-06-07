import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { apolloClient } from './apollo/client.ts';
import './index.css';
import App from './App.tsx';

const theme = createTheme({
  palette: { mode: 'light' },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </ThemeProvider>
  </StrictMode>,
);
