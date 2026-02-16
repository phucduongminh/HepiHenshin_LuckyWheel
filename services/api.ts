import axios from 'axios';
import { authService } from './authService';

export const api = axios.create({
  baseURL: 'http://localhost:4000',
});

api.interceptors.request.use((config) => {
  const token = authService.getToken() || authService.loadToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
