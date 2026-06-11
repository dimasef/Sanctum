import { API_URL } from './apiUrl.ts';
import { clearTokens, getRefreshToken, setTokens } from '../auth/tokenStorage.ts';

// Plain GraphQL string (not a parsed document): this request goes out via raw
// fetch, on purpose. Sending it through the Apollo client would route it back
// through the ErrorLink and risk a refresh-of-the-refresh loop.
const REFRESH_MUTATION = `
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      accessToken
      refreshToken
    }
  }
`;

// Single-flight guard: while one refresh is in flight, every other caller awaits
// the same promise instead of firing its own. This matters because the server
// ROTATES refresh tokens (the used one is revoked) — parallel refreshes would
// race, and all but the first would fail with an already-revoked token.
let inFlight: Promise<boolean> | null = null;

export function refreshTokens(): Promise<boolean> {
  if (inFlight) return inFlight;

  const token = getRefreshToken();
  if (!token) return Promise.resolve(false);

  inFlight = (async () => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query: REFRESH_MUTATION, variables: { token } }),
      });
      const json = (await res.json()) as {
        data?: { refreshToken?: { accessToken: string; refreshToken: string } };
      };
      const payload = json.data?.refreshToken;
      if (!payload?.accessToken || !payload?.refreshToken) {
        // The refresh token itself is invalid/expired/revoked → hard sign-out.
        clearTokens();
        return false;
      }
      setTokens(payload);
      return true;
    } catch {
      // Network blip (server down, offline): keep tokens, allow a later retry.
      return false;
    }
  })().finally(() => {
    inFlight = null;
  });

  return inFlight;
}
