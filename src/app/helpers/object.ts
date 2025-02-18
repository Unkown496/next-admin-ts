export function excludeKeys<T extends object>(obj: T, keys: Array<keyof T>) {
  const excludedObject = {
    ...obj,
  };

  keys.forEach(key => {
    Reflect.deleteProperty(excludedObject, key);
  });

  return excludedObject;
}
