import { gql, type TypedDocumentNode } from '@apollo/client';
import type { UploadUrl } from '../lib/imageUpload.ts';

export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  avatarUrl: string | null;
}

export const ME_PROFILE: TypedDocumentNode<{ me: ProfileUser | null }, Record<string, never>> = gql`
  query MeProfile {
    me {
      id
      name
      email
      bio
      avatarUrl
    }
  }
`;

export const REQUEST_AVATAR_UPLOAD_URL: TypedDocumentNode<
  { requestAvatarUploadUrl: UploadUrl },
  { contentType: string }
> = gql`
  mutation RequestAvatarUploadUrl($contentType: String!) {
    requestAvatarUploadUrl(contentType: $contentType) {
      uploadUrl
      publicUrl
    }
  }
`;

export interface UpdateProfileInput {
  name?: string;
  bio?: string | null;
  avatarUrl?: string | null;
}

export const UPDATE_PROFILE: TypedDocumentNode<
  { updateProfile: ProfileUser },
  { input: UpdateProfileInput }
> = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
      email
      bio
      avatarUrl
    }
  }
`;
