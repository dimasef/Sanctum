import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useApolloClient } from '@apollo/client/react';
import {
  AuthContext,
  type AuthContextValue,
  type AuthStatus,
  type AuthUser,
} from './authContext.ts';
import { LOGIN, LOGOUT, ME, REGISTER } from './operations.ts';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './tokenStorage.ts';
import { refreshTokens } from '../apollo/refresh.ts';

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>(() =>
    getAccessToken() ? 'loading' : 'anonymous',
  );

  const applySession = useCallback(
    async (payload: { accessToken: string; refreshToken: string; user: AuthUser }) => {
      setTokens(payload);
      setUser(payload.user);
      setStatus('authenticated');
      await client.resetStore();
    },
    [client],
  );

  const clearSession = useCallback(
    async ({ refetch }: { refetch: boolean }) => {
      clearTokens();
      setUser(null);
      setStatus('anonymous');
      await (refetch ? client.resetStore() : client.clearStore());
    },
    [client],
  );

  const bootstrapped = useRef(false);
  useEffect(() => {
    if (bootstrapped.current || !getAccessToken()) return;
    bootstrapped.current = true;

    const fetchMe = async () =>
      (await client.query({ query: ME, fetchPolicy: 'network-only' })).data?.me ?? null;

    (async () => {
      try {
        let me = await fetchMe();
        if (!me && getRefreshToken() && (await refreshTokens())) {
          me = await fetchMe();
        }
        if (me) {
          setUser(me);
          setStatus('authenticated');
        } else {
          await clearSession({ refetch: false });
        }
      } catch {
        await clearSession({ refetch: false });
      }
    })();
  }, [client, clearSession]);

  useEffect(() => {
    const onExpired = () => void clearSession({ refetch: false });
    window.addEventListener('sanctum:session-expired', onExpired);
    return () => window.removeEventListener('sanctum:session-expired', onExpired);
  }, [clearSession]);

  const login: AuthContextValue['login'] = async (email, password) => {
    const { data } = await client.mutate({
      mutation: LOGIN,
      variables: { input: { email, password } },
    });
    if (data) await applySession(data.login);
  };

  const register: AuthContextValue['register'] = async (input) => {
    const { data } = await client.mutate({ mutation: REGISTER, variables: { input } });
    if (data) await applySession(data.register);
  };

  const logout: AuthContextValue['logout'] = async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await client.mutate({ mutation: LOGOUT, variables: { token: refreshToken } }).catch(() => {});
    }
    await clearSession({ refetch: true });
  };

  const updateUser = useCallback((patch: Partial<AuthUser>) => {
    setUser((current) => (current ? { ...current, ...patch } : current));
  }, []);

  const value: AuthContextValue = { status, user, login, register, logout, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
