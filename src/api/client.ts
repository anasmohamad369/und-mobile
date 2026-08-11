import axios from 'axios';

export const API_BASE_URL = 'https://api.chickencommerce.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    // Attach authorization header if available
    const token = 'mock_jwt_token_retailer';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = error.response?.data?.message || 'Network request failed. Please try again.';
    return Promise.reject(new Error(customError));
  }
);
