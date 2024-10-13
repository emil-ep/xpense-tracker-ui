import { useState, useEffect, useCallback } from 'react';

export interface ApiConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

type FetchFunction = () => ApiConfig;

export const useApi = <T>(fetchConfig: FetchFunction, dependencies: any[] = []) => {
  const [responseBody, setResponseBody] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const { url, method, headers = {}, body } = fetchConfig();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include', // Optional: Handles authentication cookies
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const result = (await response.json()) as T;
      setResponseBody(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [fetchConfig, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { responseBody, loading, error, refetch: fetchData };
};