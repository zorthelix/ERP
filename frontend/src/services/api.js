import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api', timeout: 12_000 });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('store_manager_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function messageFrom(error) {
  const detail = error.response?.data?.details?.[0]?.message;
  return detail || error.response?.data?.error || 'Unable to complete that request. Please try again.';
}

export default api;

