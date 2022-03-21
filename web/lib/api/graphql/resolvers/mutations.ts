/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComingSoonLoginResponse } from '@lib/api/api-types';
import { comingSoonLogin } from '@lib/api/maintenance';

export const mutations = {
  comingSoonLogin: async (
    _parent: any,
    _args: { input: { password: string } },
    _context: any,
  ): Promise<ComingSoonLoginResponse> => comingSoonLogin(_args.input.password),
};
