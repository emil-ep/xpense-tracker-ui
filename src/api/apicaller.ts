import { getErrorMessage } from "./ApiUtil";
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
     const errorMessage = await getErrorMessage(response);
     throw new Error(errorMessage);
  }

  return (await response.json()) as T;
};