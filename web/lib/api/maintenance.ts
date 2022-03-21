import { sha256Hash } from './utils';

export async function comingSoonLogin(password: string) {
  return password === process.env.PASSWORD_PROTECT_PASSWORD
    ? sha256Hash(password)
    : null;
}

export async function verifyComingSoonLogin(token: string) {
  return token === sha256Hash(process.env.PASSWORD_PROTECT_PASSWORD);
}
