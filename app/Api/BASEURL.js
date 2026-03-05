import axios from 'axios';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from './NavigateService';
console.log('===========================apiurl',API_BASE_URL)

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (unchanged)
apiClient.interceptors.request.use(
  async config => {
    return config;
  },
  error => Promise.reject(error)
);

// ✅ Response interceptor
apiClient.interceptors.response.use(
  response => response.data,
  async error => {
    const status = error?.response?.status;

    if (status === 401) {
      // only clear token, no navigation
      await AsyncStorage.removeItem('AccessToken');
    }

    console.log('API Error:', error?.message || error);
    return Promise.reject(error);
  }
);


export default apiClient;
