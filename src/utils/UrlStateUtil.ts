import type { NavigateFunction } from 'react-router-dom';

export type QueryUpdates = Record<string, string | null>;

export function updateUrlQuery(
  navigate: NavigateFunction,
  pathname: string,
  search: string,
  hash: string,
  updates: QueryUpdates,
) {
  const params = new URLSearchParams(search);
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === '') params.delete(key);
    else params.set(key, value);
  });
  const nextSearch = params.toString();
  const currentSearch = search.startsWith('?') ? search.slice(1) : search;
  if (nextSearch === currentSearch) return;
  navigate({ pathname, search: nextSearch ? `?${nextSearch}` : '', hash }, { replace: true });
}
