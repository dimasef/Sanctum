import { createContext, useContext } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

// `loading` matters: on a page reload we have a token in storage but don't yet
// know if it's valid (we have to fetch `me`). Without this state, ProtectedRoute
// would flash a redirect to /login before the server answers.
export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
