import { client } from '@lib/db/client';

type AvatarFile = File;
type LogoFile = File;

export async function uploadAvatarImage(userId: string, image: AvatarFile) {
  const { data, error } = await client.storage
    .from('avatars')
    .upload(`${Date.now()}_${userId}`, image, { upsert: true });
  if (error) throw error;
  return data;
}

export async function getAvatarImage(imageId: string) {
  const { signedURL, error } = await client.storage
    .from('avatars')
    .createSignedUrl(imageId, 3600);

  return { signedURL, error };
}

export async function uploadLogoImage(clubId: number, image: LogoFile) {
  const { data, error } = await client.storage
    .from('logos')
    .upload(`$Date.now()}_${clubId}`, image, { upsert: true });
  if (error) throw error;
  return data;
}

export async function getLogoImage(imageId: string) {
  const { signedURL, error } = await client.storage
    .from('logos')
    .createSignedUrl(imageId, 3600);

  return { signedURL, error };
}
