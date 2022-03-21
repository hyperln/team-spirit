import crypto from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';

export const snakeToCamel = (s: string) =>
  s.replace(/([-_][a-z])/gi, ($1) =>
    $1.toUpperCase().replace('-', '').replace('_', ''),
  );

export const isArray = (a: any) => Array.isArray(a);

export const isObject = (o: any) =>
  o === Object(o) && !isArray(o) && typeof o !== 'function';

export const keysToCamel = (o: any) => {
  if (isObject(o)) {
    const n = {};

    Object.keys(o).forEach((k) => {
      n[snakeToCamel(k)] = keysToCamel(o[k]);
    });

    return n;
  }
  if (isArray(o)) {
    return o.map((i) => keysToCamel(i));
  }

  return o;
};

export const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const keysToSnake = (o: any) => {
  if (isObject(o)) {
    const n = {};

    Object.keys(o).forEach((k) => {
      n[camelToSnakeCase(k)] = keysToSnake(o[k]);
    });

    return n;
  }
  if (isArray(o)) {
    return o.map((i) => keysToSnake(i));
  }

  return o;
};

export function textToCamel(text: string) {
  return text.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
}

export enum SupportedMethods {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export const unsupportedMethodResponse = (methods: SupportedMethods[]) => (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  res.setHeader('Allow', methods);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};

export function initMiddleware(middleware: any) {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

export function sha256Hash(text: string) {
  const hash = crypto.createHash('sha256');
  hash.update(text);
  return hash.digest('hex');
}
