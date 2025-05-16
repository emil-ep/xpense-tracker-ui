import { getNavigate } from "../navigation";
import { getErrorMessage } from "./ApiUtil";
import { ApiConfig } from "./hook/useApi";


export const apiCaller = async <T>(config: ApiConfig): Promise<T> => {
  const navigate = getNavigate();
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

  if (response.status === 401) {
    if (navigate) {
      navigate('/login'); // Redirect to login page
    }
    return Promise.reject(new Error('Unauthorized')); // Reject the promise
  }

  if (!response.ok) {
     const errorMessage = await getErrorMessage(response);
     throw new Error(errorMessage);
  }

  return (await response.json()) as T;
};

export const fileDownloader = async <T>(config: ApiConfig): Promise<Blob> => {
  const response = await fetch(config.url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorMessage = await getErrorMessage(response);
    throw new Error(errorMessage);
  }
  return response.blob();
}