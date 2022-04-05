export const snakeToCamel = (s: string) =>
  s.replace(/([-_][a-z])/gi, ($1) =>
    $1.toUpperCase().replace('-', '').replace('_', ''),
  );

export const isArray = (a: any) => Array.isArray(a);

export const isObject = (o: any) =>
  o === Object(o) && !isArray(o) && typeof o !== 'function';

export const keysToCamel = (o: any) => {
  if (isObject(o)) {
    const n: { [key: string]: any } = {};

    Object.keys(o).forEach((k) => {
      n[snakeToCamel(k)] = keysToCamel(o[k]);
    });

    return n;
  }
  if (isArray(o)) {
    return o.map((i: any) => keysToCamel(i));
  }

  return o;
};

export const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const keysToSnake = (o: any) => {
  if (isObject(o)) {
    const n: { [key: string]: any } = {};

    Object.keys(o).forEach((k) => {
      n[camelToSnakeCase(k)] = keysToSnake(o[k]);
    });

    return n;
  }
  if (isArray(o)) {
    return o.map((i: any) => keysToSnake(i));
  }

  return o;
};
