import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from './apollo/client.ts';
import { ColorModeProvider } from './theme/ColorModeProvider.tsx';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorModeProvider>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </ColorModeProvider>
  </StrictMode>,
);
