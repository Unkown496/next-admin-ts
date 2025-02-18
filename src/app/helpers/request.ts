export const headersToObject = (headers: Headers): Record<string, string> =>
  Object.fromEntries(Array.from(headers.entries()));
