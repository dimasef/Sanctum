import { prisma } from '../prisma.js';

interface UpdateProfileInput {
  name?: string;
  bio?: string | null;
  avatarUrl?: string | null;
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const data: Record<string, string | null> = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.bio !== undefined) data.bio = input.bio;
  if (input.avatarUrl !== undefined) data.avatarUrl = input.avatarUrl;
  return prisma.user.update({ where: { id: userId }, data });
}
