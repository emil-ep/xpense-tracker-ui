import { ApiConfig } from "./hook/useApi";


export const apiCaller = async <T>(config: ApiConfig): Promise<T> => {
  const { url, method, headers = {}, body } = config;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  return (await response.json()) as T;
};