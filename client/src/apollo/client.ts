import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { from as rxFrom, mergeMap, throwError } from 'rxjs';
import { API_URL } from './apiUrl.ts';
import { refreshTokens } from './refresh.ts';
import { getAccessToken, getRefreshToken } from '../auth/tokenStorage.ts';

const httpLink = new HttpLink({ uri: API_URL });

// Runs before every request: inject the access token if we have one.
const authLink = new SetContextLink((prevContext) => {
  const token = getAccessToken();
  return {
    headers: {
      ...prevContext.headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

// Operations that can legitimately return UNAUTHENTICATED on their own (bad
// credentials, etc.) — they must surface to the user, never trigger a refresh.
const AUTH_OPS = new Set(['Login', 'Register', 'Logout', 'RefreshToken']);

// Catches an expired-access-token error, refreshes the token pair once, and
// replays the failed operation. Placed BEFORE authLink so the replay re-enters
// authLink and picks up the freshly stored access token.
const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (!CombinedGraphQLErrors.is(error)) return;

  const isUnauthenticated = error.errors.some((e) => e.extensions?.code === 'UNAUTHENTICATED');
  if (!isUnauthenticated) return;
  if (AUTH_OPS.has(operation.operationName ?? '')) return;
  if (!getRefreshToken()) return;

  // Retry-once guard: if the replayed op still 401s, don't loop forever.
  const ctx = operation.getContext();
  if (ctx.tokenRefreshed) return;
  operation.setContext({ ...ctx, tokenRefreshed: true });

  return rxFrom(refreshTokens()).pipe(
    mergeMap((ok) => {
      if (!ok) {
        // Refresh token is dead → tell the app to drop to the anonymous state.
        window.dispatchEvent(new Event('sanctum:session-expired'));
        return throwError(() => error);
      }
      return forward(operation);
    }),
  );
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
