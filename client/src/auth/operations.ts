import { gql, type TypedDocumentNode } from '@apollo/client';
import type { AuthUser, RegisterInput } from './authContext.ts';

interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export const ME: TypedDocumentNode<{ me: AuthUser | null }, Record<string, never>> = gql`
  query Me {
    me {
      id
      email
      name
    }
  }
`;

export const LOGIN: TypedDocumentNode<
  { login: AuthPayload },
  { input: { email: string; password: string } }
> = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        name
      }
    }
  }
`;

export const REGISTER: TypedDocumentNode<{ register: AuthPayload }, { input: RegisterInput }> = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        name
      }
    }
  }
`;

export const LOGOUT: TypedDocumentNode<{ logout: boolean }, { token: string }> = gql`
  mutation Logout($token: String!) {
    logout(token: $token)
  }
`;
