import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Production Railway Backend URL
// export const API_BASE_URL = 'https://und-backend-production.up.railway.app/api/v1';
export const API_BASE_URL = 'http://localhost:8080/api/v1';
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@chicken_commerce_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.log('Error attaching authorization token', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Network request failed. Please check your connection.';
    return Promise.reject(new Error(customError));
  }
);
