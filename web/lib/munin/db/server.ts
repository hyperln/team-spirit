import { createClient } from '@supabase/supabase-js';
import { config } from 'config';

const client = createClient(config.munin.url, process.env.SUPABASE_SECRET_KEY);

export async function checkEmail(
  email: string,
): Promise<'registered' | 'unregistered'> {
  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('email', email);

  return !error && data.length > 0 ? 'registered' : 'unregistered';
}
