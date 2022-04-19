import { NextApiRequest, NextApiResponse } from 'next';
import { SupportedMethods } from './api-types';

export const unsupportedMethodResponse =
  (methods: SupportedMethods[]) =>
  (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Allow', methods);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  };
