import { currentUser } from '@lib/auth';
import {
  keysToCamel,
  keysToSnake,
  removeNullUndefinedAndEmptyStrings,
} from '@utils/object-utils';
import { Club, Team } from 'shared/types';
import { client } from './client';

export async function listClubs() {
  //fetch clubs from database
  const { data, error } = await client.from('clubs').select().order('name');
  if (error) throw error;
  return data;
}

export async function listTeams(clubId: number) {
  // fetch teams from database
  const { data, error } = await client
    .from('teams')
    .select()
    .match(keysToSnake({ clubId }))
    .order('name');
  if (error) throw error;
  return data;
}

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  gender?: string;
}
interface CreateClubData {
  name: string;
  established?: string;
}

interface CreateTeamData {
  name: string;
  gender?: string;
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

export async function createClub(clubData: CreateClubData) {
  const { data, error } = await client
    .from('clubs')
    .insert(keysToSnake(removeNullUndefinedAndEmptyStrings(clubData)));
  if (error) throw error;
  return keysToCamel(data);
}

export async function fetchClub(clubId: number): Promise<Club> {
  const { data, error } = await client
    .from('clubs')
    .select()
    .match({ id: clubId });
  if (error) throw error;
  return keysToCamel(data[0]);
}

export async function joinClub(clubId: number) {
  const user = currentUser();
  const { data, error } = await client
    .from('club_members')
    .insert({
      club_id: clubId,
      user_id: user.id,
    })
    .match({ id: clubId });
  if (error) throw error;
  return keysToCamel(data);
}

export async function leaveClub(clubId: number) {
  const user = currentUser();
  const { data, error } = await client
    .from('club_members')
    .delete()
    .match(keysToSnake({ clubId, userId: user.id }));
  if (error) throw error;
  return keysToCamel(data);
}

export async function isUserMember(clubId: number): Promise<boolean> {
  const user = currentUser();
  const { data, error } = await client
    .from('club_members')
    .select()
    .match(keysToSnake({ clubId, userId: user.id }));
  if (error) throw error;
  return data.length > 0;
}

export async function isUserAdmin(clubId: number): Promise<boolean> {
  const user = currentUser();
  const { data, error } = await client
    .from('club_admins')
    .select()
    .match({ club_id: clubId, user_id: user.id });
  if (error) throw error;
  return data.length > 0;
}

export async function fetchGenders() {
  const { data, error } = await client.from('genders').select();
  if (error) throw error;
  return data;
}

export async function fetchTeam(teamId: number): Promise<Team> {
  const { data, error } = await client
    .from('teams')
    .select()
    .match({ id: teamId });
  if (error) throw error;
  return keysToCamel(data[0]);
}

export async function createTeam(teamData: CreateTeamData) {
  const { data, error } = await client
    .from('teams')
    .insert(keysToSnake(removeNullUndefinedAndEmptyStrings(teamData)));
  if (error) throw error;
  return keysToCamel(data);
}

export async function joinTeam(teamId: number) {
  const user = currentUser();
  const { data, error } = await client
    .from('team_members')
    .insert({
      team_id: teamId,
      user_id: user.id,
    })
    .match({ id: teamId });
  if (error) throw error;
  return keysToCamel(data);
}

export async function leaveTeam(teamId: number) {
  const user = currentUser();
  const { data, error } = await client
    .from('team_members')
    .delete()
    .match(keysToSnake({ teamId, userId: user.id }));
  if (error) throw error;
  return keysToCamel(data);
}
