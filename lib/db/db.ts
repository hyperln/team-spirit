import {
  keysToCamel,
  keysToSnake,
  removeNullUndefinedAndEmptyStrings,
} from '@utils/object-utils';
import { client } from './client';

export async function listClubs({}) {
  //fetch clubs from database
  const { data, error } = await client.from('clubs').select();
  if (error) throw error;
  return data;
}

export async function listTeams({}) {
  // fetch teams from database
  const { data, error } = await client.from('teams').select();
  if (error) throw error;
  return data;
}

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  gender?: string;
}
interface CreateClub {
  clubName?: string;
  clubEstablished?: string;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await client
    .from('profiles')
    .select()
    .match({ id: userId });
  if (error) throw error;
  return keysToCamel(data[0]);
}

export async function updateUserProfile(
  userId: string,
  profileData: UpdateProfileData,
) {
  const { data, error } = await client
    .from('profiles')
    .update(keysToSnake(removeNullUndefinedAndEmptyStrings(profileData)))
    .match({ id: userId });
  if (error) throw error;
  return keysToCamel(data);
}

export async function createClub(userId: string, clubData: CreateClub) {
  const { data, error } = await client
    .from('clubs')
    .insert(keysToSnake(removeNullUndefinedAndEmptyStrings(clubData)))
    .match({ id: userId });
  if (error) throw error;
  return keysToCamel(data);
}
