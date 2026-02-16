export function getQueryParam(key: string): string | null {
  const hash = window.location.hash;

  const queryIndex = hash.indexOf('?');
  if (queryIndex === -1) return null;

  const queryString = hash.slice(queryIndex + 1);

  const params = new URLSearchParams(queryString);

  return params.get(key);
}
