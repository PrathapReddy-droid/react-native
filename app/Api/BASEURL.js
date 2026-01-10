import axios from 'axios';
import { API_BASE_URL } from '@env';
console.log(API_BASE_URL)

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// OPTIONAL: token interceptor
apiClient.interceptors.request.use(
  async config => {
    // const token = await getToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

apiClient.interceptors.response.use(
  response => response.data,
  error => {
    console.log('API Error:', error || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
