import { client } from './client';

export async function listTeams({}) {
  // fetch teams from database
  const { data, error } = await client.from('teams').select();
  if (error) throw error;
  return data;
}



