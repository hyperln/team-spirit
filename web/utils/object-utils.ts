export function removeNullUndefinedAndEmptyStrings(object: {
  [key: string]: any;
}): { [key: string]: any } {
  const newObject = {};
  Object.keys(object).forEach((key) => {
    const value = object[key];
    if (value && value !== '' && value !== null) {
      newObject[key] =
        typeof value === 'object'
          ? removeNullUndefinedAndEmptyStrings(value)
          : value;
    }
  });
  return newObject;
}
