// Comes with supabase no need to install separate
// eslint-disable-next-line import/no-extraneous-dependencies
import { AuthChangeEvent, Session, UserCredentials } from '@supabase/gotrue-js';
import { client } from './client';

export function auth() {
  return {
    currentUser: client.auth.user(),
    signUp: (data: UserCredentials) => client.auth.signUp(data),
    signIn: (data: UserCredentials) => client.auth.signIn(data),
    signOut: () => client.auth.signOut(),
    session: () => client.auth.session(),
    onAuthStateChange: (
      callback: (event: AuthChangeEvent, session: Session) => void,
    ) => client.auth.onAuthStateChange(callback),
  };
}
