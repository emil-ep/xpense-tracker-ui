

export const getErrorMessage = async (response: Response): Promise<string> => {
  try {
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const errorBody = await response.json();
      return errorBody.data || JSON.stringify(errorBody); // Adjust based on your API structure
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error('Error parsing response:', error);
    return 'Unknown error occurred';
  }
};