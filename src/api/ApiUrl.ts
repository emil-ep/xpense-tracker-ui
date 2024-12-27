const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export const SIGN_IN_URL = `${API_BASE_URL}/v1/auth/signIn`;
export const EXPENSES_URL = `${API_BASE_URL}/v1/expenses`;
export const FILE_URL = `${API_BASE_URL}/v1/file`;
export const FILE_MAPPER_URL = `${API_BASE_URL}/v1/expenses/statement`;
export const METRICS_URL = `${API_BASE_URL}/v1/metrics`;
export const TAG_URL = `${API_BASE_URL}/v1/tag`;
