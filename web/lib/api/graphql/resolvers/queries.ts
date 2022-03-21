/* eslint-disable @typescript-eslint/no-unused-vars */
import { verifyComingSoonLogin } from '@lib/api/maintenance';
import { checkEmail } from '@lib/munin/db/server';

export const queries = {
  verifyComingSoonLogin: async (
    _parent: any,
    _args: { input: { token: string } },
    _context: any,
  ): Promise<boolean> => verifyComingSoonLogin(_args.input.token),
  checkEmail: async (
    _parent: any,
    _args: { email: string },
    _context: any,
  ): Promise<boolean> => checkEmail(_args.email),
};
