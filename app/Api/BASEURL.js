import axios from 'axios';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openAuthModal } from './AuthEvents';

console.log('=== API URL ===', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async config => config,
  error => Promise.reject(error)
);

apiClient.interceptors.response.use(
  response => response.data,
  async error => {
    const status = error?.response?.status;

    if (status === 401) {
      await AsyncStorage.removeItem('AccessToken');
      openAuthModal(); // 👈 triggers the modal
    }

    console.log('API Error:', error?.message || error);
    return Promise.reject(error);
  }
);

export default apiClient;