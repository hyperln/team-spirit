export const pipe = {
  async: (...fns: any) => (x: any) =>
    fns.reduce((v: any, f: any) => v.then(f), Promise.resolve(x)),
  sync: (...fns: any) => (x: any) => fns.reduce((v: any, f: any) => f(v), x),
};

export const raise = (error: any) => {
  throw error;
};

export const rescue = (error: Error, type: any) =>
  error instanceof type ? error : raise(error);

export const swallow = (fn: any) => (type: any) => (fail: any) => async (
  ...args: any
) => {
  try {
    return await fn(...args);
  } catch (error) {
    rescue(error, type);
    return fail(error, ...args);
  }
};
