// Comes with supabase no need to install separate
// eslint-disable-next-line import/no-extraneous-dependencies
import { AuthChangeEvent, Session, UserCredentials } from '@supabase/gotrue-js';
import { client } from './client';

export const currentUser = () => client.auth.user();
export const signUp = (data: UserCredentials) => client.auth.signUp(data);
export const signIn = (data: UserCredentials) => client.auth.signIn(data);
export const signOut = () => client.auth.signOut();
export const session = () => client.auth.session();
export const onAuthStateChange = (
  callback: (event: AuthChangeEvent, session: Session) => void,
) => client.auth.onAuthStateChange(callback);
