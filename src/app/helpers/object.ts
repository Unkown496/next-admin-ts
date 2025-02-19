export function excludeKeys<T extends object>(obj: T, keys: Array<keyof T>) {
  const excludedObject = {
    ...obj,
  };

  keys.forEach(key => {
    Reflect.deleteProperty(excludedObject, key);
  });

  return excludedObject;
}

export const isEmptyObject = <T extends object>(object: T): boolean =>
  Object.keys(object).length === 0;
