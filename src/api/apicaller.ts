import { getNavigate } from "../navigation";
import { getErrorMessage } from "./ApiUtil";
import { ApiConfig } from "./hook/useApi";


export const apiCaller = async <T>(config: ApiConfig): Promise<T> => {
  const navigate = getNavigate();
  const { url, method, headers = {}, body } = config;
  console.log('response');
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

  console.log('response', response);
  if (response.status === 401) {
    console.log('navigate', navigate);
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