// Comes with supabase no need to install separate
// eslint-disable-next-line import/no-extraneous-dependencies
import { AuthChangeEvent, Session, UserCredentials } from '@supabase/gotrue-js';
import { keysToCamel } from '@utils/object-utils';
import { client } from './client';

export const currentUser = () => client.auth.user();
export const signUp = (data: UserCredentials) => client.auth.signUp(data);
export const signIn = (data: UserCredentials) => client.auth.signIn(data);
export const signOut = () => client.auth.signOut();
export const session = () => client.auth.session();
export const onAuthStateChange = (
  callback: (event: AuthChangeEvent, session: Session) => void,
) => client.auth.onAuthStateChange(callback);
export const resetPassword = (email: string) => {
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/account/password-recovery`;
  return client.auth.api.resetPasswordForEmail(email, {
    redirectTo,
  });
};
export const updatePassword = async (accessToken: string, password: string) => {
  const { data, error } = await client.auth.api.updateUser(accessToken, {
    password,
  });
  if (error) throw error;
  return keysToCamel(data);
};
export const handler = (req, res) => {
  client.auth.api.setAuthCookie(req, res);
};
